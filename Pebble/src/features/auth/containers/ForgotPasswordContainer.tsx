// @/features/auth/containers/ForgotPasswordContainer.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  changePassword,
  requestTemporaryPassword,
} from "@/features/auth/api/authApi";
import { ApiRequestError, setAuthTokens } from "@/services/api";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import type { PasswordChangeLocationState } from "../types/authNavigation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;
// 특수문자는 허용하고, 8자 이상이면서 영문과 숫자를 모두 포함하는지만 확인합니다.
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const ForgotPasswordContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const passwordChangeState =
    location.state as PasswordChangeLocationState | null;
  const initialStep =
    passwordChangeState?.initialStep === 3 ? 3 : 1;
  
  // 흐름 제어 상태 (1: 이메일 입력, 2: 발송 완료, 3: 패스워드 재설정)
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; newPassword?: string; passwordConfirm?: string }>({});
  const [shakeTarget, setShakeTarget] = useState<{ email?: boolean; newPassword?: boolean; passwordConfirm?: boolean }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 셰이크 모션 트리거
  const triggerShake = (field: "email" | "newPassword" | "passwordConfirm") => {
    setShakeTarget((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setShakeTarget((prev) => ({ ...prev, [field]: false })), 400);
  };

  // 폼 유효성 실시간 체크 (버튼 활성화 스위치)
  useEffect(() => {
    if (step === 1) {
      setIsFormValid(email.trim() !== "" && EMAIL_REGEX.test(email) && !errors.email);
    } else if (step === 3) {
      const hasValues = newPassword !== "" && passwordConfirm !== "";
      const hasNoErrors = !errors.newPassword && !errors.passwordConfirm;
      setIsFormValid(hasValues && hasNoErrors);
    }
  }, [email, newPassword, passwordConfirm, errors, step]);

  const handleChange = (field: string, value: string) => {
    setErrorMessage(null);

    if (field === "email") {
      setEmail(value);
      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (field === "newPassword") {
      setNewPassword(value);
      if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: undefined }));
    }
    if (field === "passwordConfirm") {
      setPasswordConfirm(value);
      if (errors.passwordConfirm) setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
    }
  };

  // 포커스 아웃(onBlur) 핸들러 (회원가입/로그인 양식과 동일하게 빈 값 패스 조건 포함)
  const handleFieldBlur = (field: "email" | "newPassword" | "passwordConfirm") => {
    if (field === "email" && email !== "") {
      if (!EMAIL_REGEX.test(email)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아니에요" }));
        triggerShake("email");
      }
    }

    if (field === "newPassword" && newPassword !== "") {
      if (!PASSWORD_REGEX.test(newPassword)) {
        setErrors((prev) => ({ ...prev, newPassword: "8자 이상, 영문·숫자 포함" }));
        triggerShake("newPassword");
      }
    }

    if (field === "passwordConfirm" && passwordConfirm !== "" && newPassword !== "") {
      if (newPassword !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호를 다시 확인해 주세요" }));
        triggerShake("passwordConfirm");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (step === 1) {
      if (!email.trim() || !EMAIL_REGEX.test(email)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아니에요" }));
        triggerShake("email");
        return;
      }
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        await requestTemporaryPassword(email.trim());
        setStep(2);
      } catch (error) {
        setErrorMessage(
          error instanceof ApiRequestError
            ? error.message
            : "임시 비밀번호를 발급하지 못했어요. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } 
    
    else if (step === 2) {
      // 발급받은 임시 비밀번호로 로그인해야 서버가 변경 권한을 부여합니다.
      navigate("/login");
    } 
    
    else if (step === 3) {
      if (!PASSWORD_REGEX.test(newPassword)) {
        setErrors((prev) => ({ ...prev, newPassword: "8자 이상, 영문·숫자 포함" }));
        triggerShake("newPassword");
        return;
      }

      if (newPassword !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호를 다시 확인해 주세요" }));
        triggerShake("passwordConfirm");
        return;
      }

      if (!passwordChangeState?.currentPassword) {
        navigate("/login", { replace: true });
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const tokens = await changePassword(
          passwordChangeState.currentPassword,
          newPassword,
        );
        setAuthTokens(tokens.accessToken, tokens.refreshToken);
        navigate("/", { replace: true });
      } catch (error) {
        setErrorMessage(
          error instanceof ApiRequestError
            ? error.message
            : "비밀번호를 변경하지 못했어요. 잠시 후 다시 시도해 주세요.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBackToLogin = () => {
    if (step === 1) {
      navigate("/login");
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      navigate("/login");
    }
  };

  return (
    <ForgotPasswordForm
      step={step}
      email={email}
      newPassword={newPassword}
      passwordConfirm={passwordConfirm}
      showPw={showPw}
      showPwConfirm={showPwConfirm}
      errors={errors}
      shakeTarget={shakeTarget}
      isFormValid={isFormValid}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onChange={handleChange}
      onFieldBlur={handleFieldBlur}
      onTogglePw={() => setShowPw((p) => !p)}
      onTogglePwConfirm={() => setShowPwConfirm((p) => !p)}
      onSubmit={handleSubmit}
      onBackToLogin={handleBackToLogin}
    />
  );
};
