// @/features/auth/components/LoginForm.tsx
import React from "react";
import { Link } from "react-router-dom";
import { AuthCard } from './AuthCard';
import { AuthDivider } from './AuthDivider';
import { AuthErrorMessage } from "./AuthErrorMessage";
import { EyeIcon } from "./EyeIcon";
import { SocialAuthButtons } from './SocialAuthButtons';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  errorMessage: string | null; 
  errors: {                    
    email?: string;
    password?: string;
  };
  shakeTarget: { email?: boolean; password?: boolean };
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFieldBlur: (field: "email" | "password") => void; 
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialLogin: (provider: "google" | "naver") => void;
}

export const LoginForm = ({
  email,
  password,
  showPassword,
  errorMessage, 
  errors, 
  shakeTarget,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onFieldBlur, 
  onTogglePassword,
  onSubmit,
  onSocialLogin,
}: LoginFormProps) => {
  return (
    <AuthCard title="로그인" dataId="login-form-section">
      <div className="flex w-full flex-col gap-[40px]">
        <div className="flex w-full flex-col gap-[12px]">
          <form onSubmit={onSubmit} className="flex w-full flex-col gap-[20px]" noValidate>
            <div className="flex w-full flex-col gap-[12px]">
              {/* 입력 오류가 발생한 필드만 흔들림과 위험 색상 테두리를 적용합니다. */}
              <div className={`flex flex-col gap-[8px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
                <label htmlFor="login-email" className="auth-label text-[16px] font-medium tracking-[-0.16px]">
                  이메일<span className="auth-required">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    onBlur={() => onFieldBlur("email")}
                    placeholder="이메일을 입력해 주세요"
                    className={`auth-input !h-[44px] pl-[12px] pr-[48px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${
                      errors.email || errorMessage
                        ? "!border-fill-danger focus:!border-fill-danger"
                        : ""
                    }`}
                  />
                  {/* 피그마 Input Box의 아이콘 미사용 상태도 동일한 44px 영역을 유지합니다. */}
                  <span aria-hidden="true" className="pointer-events-none absolute right-[4px] top-1/2 size-[44px] -translate-y-1/2" />
                </div>
                {errors.email && <AuthErrorMessage>{errors.email}</AuthErrorMessage>}
              </div>

              <div className={`flex flex-col gap-[8px] ${shakeTarget.password && errors.password ? "animate-shake" : ""}`}>
                <label htmlFor="login-password" className="auth-label text-[16px] font-medium tracking-[-0.16px]">
                  비밀번호<span className="auth-required">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onBlur={() => onFieldBlur("password")}
                    placeholder="비밀번호를 입력해 주세요"
                    className={`auth-input !h-[44px] pl-[12px] pr-[48px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${
                      errors.password || errorMessage
                        ? "!border-fill-danger focus:!border-fill-danger"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                    className="absolute right-[14px] top-1/2 flex -translate-y-1/2 items-center justify-center text-text-teritary transition-colors hover:text-text-primary"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <AuthErrorMessage>{errors.password}</AuthErrorMessage>}
              </div>

              {errorMessage && (
                <AuthErrorMessage className="leading-[1.6] break-keep whitespace-pre-line">
                  {errorMessage}
                </AuthErrorMessage>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[44px] w-full rounded-[12px] bg-btn-primary px-[20px] text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-text-onFill transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#171717B2] disabled:text-text-teritary disabled:hover:brightness-100"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="flex w-full justify-end">
            <Link
              to="/forgot-password"
              className="text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-text-teritary hover:underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </div>

        <AuthDivider />

        <SocialAuthButtons
          actionLabel="계속하기"
          onSocialAuth={onSocialLogin}
        />

        <div className="flex justify-center gap-[8px] text-center text-[16px] font-medium leading-[150%] tracking-[-0.16px]">
          <span className="text-text-teritary">Pebble이 처음이신가요?</span>
          <Link to="/signup" className="text-text-strong hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};
