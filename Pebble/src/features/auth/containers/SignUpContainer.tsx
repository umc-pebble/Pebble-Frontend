// @/features/auth/containers/SignUpContainer.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SignUpForm } from "../components/SignUpForm";
import type { SignUpLocationState } from "../types/authNavigation";
import { startSocialLogin } from '@/features/auth/utils/socialOAuth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;
// 새 비밀번호 화면과 동일하게 특수문자는 허용하고 영문·숫자 포함 여부만 검사합니다.
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const SignUpContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as SignUpLocationState | null;
  const [form, setForm] = useState({
    email: locationState?.draft?.email ?? "",
    password: locationState?.draft?.password ?? "",
    passwordConfirm: locationState?.draft?.password ?? "",
    agreeTerms: false,
  });

  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; passwordConfirm?: string }>({
    email: locationState?.serverError,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [socialErrorMessage, setSocialErrorMessage] = useState<string | null>(null);
  
  // 개별 컴포넌트의 흔들림 애니메이션 상태 관리
  const [shakeTarget, setShakeTarget] = useState<{ email?: boolean; password?: boolean; passwordConfirm?: boolean }>({});

  // 특정 필드에 애니메이션을 트리거하는 헬퍼 함수
  const triggerShake = (field: "email" | "password" | "passwordConfirm") => {
    setShakeTarget((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setShakeTarget((prev) => ({ ...prev, [field]: false })), 400);
  };

  // 실시간 폼 전체 정합성 체크 (버튼 활성화 여부만 판단)
  useEffect(() => {
    const hasValues = form.email !== "" && form.password !== "" && form.passwordConfirm !== "";
    
    // @ 이후 최소 3자, 첫 번째 . 이후 최소 2자 조건 만족 검사
    const isEmailValid = EMAIL_REGEX.test(form.email);
    const isPasswordValid = PASSWORD_REGEX.test(form.password);
    
    const hasNoErrors = !errors.email && !errors.password && !errors.passwordConfirm;
    
    setIsFormValid(hasValues && isEmailValid && isPasswordValid && hasNoErrors && form.agreeTerms);
  }, [form, errors]);

  // 값 입력 핸들러: 타이핑 중에는 에러 상태를 초기화하여 실시간 경고 차단
  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 통합 포커스 아웃(onBlur) 핸들러: 커서가 나갔을 때 검사 후 에러 시 흔들림 트리거
  const handleFieldBlur = (field: "email" | "password" | "passwordConfirm") => {
    if (form[field] === "") return;

    if (field === "email") {
      if (!EMAIL_REGEX.test(form.email)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아니에요" }));
        triggerShake("email");
      }
    }

    if (field === "password") {
      if (!PASSWORD_REGEX.test(form.password)) {
        setErrors((prev) => ({ ...prev, password: "8자 이상, 영문·숫자 포함" }));
        triggerShake("password");
      }
    }

    if (field === "passwordConfirm" && form.password !== "") {
      if (form.password !== form.passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요." }));
        triggerShake("passwordConfirm");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!PASSWORD_REGEX.test(form.password)) {
      setErrors((prev) => ({ ...prev, password: "8자 이상, 영문·숫자 포함" }));
      triggerShake("password");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요." }));
      triggerShake("passwordConfirm");
      return;
    }

    // 닉네임까지 입력한 다음 화면에서 Swagger의 회원가입 API를 한 번에 호출합니다.
    navigate("/profile-setup", {
      state: {
        mode: "email",
        signUpDraft: {
          email: form.email.trim(),
          password: form.password,
        },
      },
    });
  };

  const handleSocialSignUp = (provider: 'google' | 'naver') => {
    try {
      setSocialErrorMessage(null);
      startSocialLogin(provider, 'signup');
    } catch {
      setSocialErrorMessage(
        '소셜 회원가입을 시작하지 못했어요.\nOAuth 설정을 확인해 주세요.',
      );
    }
  };

  return (
    <SignUpForm
      form={form}
      showPw={showPw}
      showPwConfirm={showPwConfirm}
      errors={errors}
      socialErrorMessage={socialErrorMessage}
      isFormValid={isFormValid}
      shakeTarget={shakeTarget} 
      onChange={handleFieldChange}
      onFieldBlur={handleFieldBlur}
      onTogglePw={() => setShowPw((p) => !p)}
      onTogglePwConfirm={() => setShowPwConfirm((p) => !p)}
      onSubmit={handleSubmit}
      onSocialSignUp={handleSocialSignUp}
    />
  );
};
