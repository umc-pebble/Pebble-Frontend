// @/features/auth/components/SignUpForm.tsx
import React from "react";
import { Link } from "react-router-dom";

import { AuthCard } from './AuthCard';
import { AuthDivider } from './AuthDivider';
import { AuthErrorMessage } from "./AuthErrorMessage";
import { EyeIcon } from "./EyeIcon";
import { SocialAuthButtons } from './SocialAuthButtons';

interface SignUpFormProps {
  form: {
    email: string;
    password: string;
    passwordConfirm: string;
    agreeTerms: boolean;
  };
  showPw: boolean;
  showPwConfirm: boolean;
  errors: {
    email?: string;
    password?: string;
    passwordConfirm?: string;
  };
  socialErrorMessage: string | null;
  isFormValid: boolean;
  shakeTarget: { email?: boolean; password?: boolean; passwordConfirm?: boolean }; 
  onChange: (field: string, value: any) => void;
  onFieldBlur: (field: "email" | "password" | "passwordConfirm") => void; 
  onTogglePw: () => void;
  onTogglePwConfirm: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialSignUp: (provider: 'google' | 'naver') => void;
}

export const SignUpForm = ({
  form,
  showPw,
  showPwConfirm,
  errors,
  socialErrorMessage,
  isFormValid,
  shakeTarget,
  onChange,
  onFieldBlur,
  onTogglePw,
  onTogglePwConfirm,
  onSubmit,
  onSocialSignUp,
}: SignUpFormProps) => {
  return (
    <AuthCard
      title="Pebble 시작하기"
      dataId="signup-form-section"
      compactVerticalPadding
    >
      {/* 제목과 본문 사이는 AuthCard의 40px, 본문 내부 섹션은 20px 간격입니다. */}
      <div className="flex w-full flex-col gap-[20px]">
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-[20px]" noValidate>
          {/* 입력 필드 사이는 Figma Input Section 명세의 16px 간격을 사용합니다. */}
          <div className="flex w-full flex-col gap-[16px]">
            {/* 1. 이메일 필드 */}
            <div className={`flex flex-col gap-[8px] ${shakeTarget.email && errors.email ? "animate-shake" : ""}`}>
              <label htmlFor="signup-email" className="auth-label text-[16px] font-medium tracking-[-0.16px]">
                이메일<span className="auth-required">*</span>
              </label>
              <div className="relative w-full">
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  onBlur={() => onFieldBlur("email")}
                  placeholder="이메일을 입력해 주세요"
                  className={`auth-input !h-[44px] pl-[12px] pr-[48px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${errors.email ? "!border-fill-danger focus:!border-fill-danger" : ""}`}
                />
                {/* 피그마 Input Box의 아이콘 미사용 상태도 44px 영역을 유지합니다. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[4px] top-1/2 size-[44px] -translate-y-1/2"
                />
              </div>
              {errors.email && <AuthErrorMessage>{errors.email}</AuthErrorMessage>}
            </div>

            {/* 2. 비밀번호 필드 */}
            <div className={`flex flex-col gap-[8px] ${shakeTarget.password && errors.password ? "animate-shake" : ""}`}>
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="signup-password" className="auth-label text-[16px] font-medium tracking-[-0.16px]">
                  비밀번호<span className="auth-required">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    onBlur={() => onFieldBlur("password")}
                    placeholder="비밀번호를 입력해 주세요"
                    className={`auth-input !h-[44px] pl-[12px] pr-[48px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${errors.password ? "!border-fill-danger focus:!border-fill-danger" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={onTogglePw}
                    aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
                    className="absolute right-[14px] top-1/2 flex -translate-y-1/2 items-center justify-center text-text-teritary transition-colors hover:text-text-primary"
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>
              {errors.password ? (
                <AuthErrorMessage>{errors.password}</AuthErrorMessage>
              ) : (
                <div className="text-left text-[13px] font-normal leading-[130%] text-text-teritary">8자 이상, 영문·숫자 포함</div>
              )}
            </div>

            {/* 3. 비밀번호 확인 필드 */}
            <div className={`flex flex-col gap-[8px] ${shakeTarget.passwordConfirm && errors.passwordConfirm ? "animate-shake" : ""}`}>
              <label htmlFor="signup-password-confirm" className="auth-label text-[16px] font-medium tracking-[-0.16px]">
                비밀번호 확인<span className="auth-required">*</span>
              </label>
              <div className="relative w-full">
                <input
                  id="signup-password-confirm"
                  name="passwordConfirm"
                  type={showPwConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.passwordConfirm}
                  onChange={(e) => onChange("passwordConfirm", e.target.value)}
                  onBlur={() => onFieldBlur("passwordConfirm")}
                  placeholder="비밀번호를 한 번 더 입력해 주세요"
                  className={`auth-input !h-[44px] pl-[12px] pr-[48px] text-[16px] font-medium tracking-[-0.16px] placeholder:text-[16px] placeholder:font-medium ${errors.passwordConfirm ? "!border-fill-danger focus:!border-fill-danger" : ""}`}
                />
                <button
                  type="button"
                  onClick={onTogglePwConfirm}
                  aria-label={showPwConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 표시"}
                  className="absolute right-[14px] top-1/2 flex -translate-y-1/2 items-center justify-center text-text-teritary transition-colors hover:text-text-primary"
                >
                  <EyeIcon open={showPwConfirm} />
                </button>
              </div>
              {errors.passwordConfirm && <AuthErrorMessage>{errors.passwordConfirm}</AuthErrorMessage>}
            </div>
          </div>

        {/* 4. 약관 동의 체크박스 영역 */}
        <div className="flex items-center text-left">
          <label className="flex cursor-pointer select-none items-center text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-text-secondary">
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={(e) => onChange("agreeTerms", e.target.checked)}
              className="hidden"
            />
            <div className={`size-[24px] shrink-0 rounded-[4px] border flex items-center justify-center mr-[8px] transition-colors
              ${form.agreeTerms ? "bg-btn-primary border-btn-primary" : "bg-fill-inverse border-border-secondary"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" 
                className={`w-[12px] h-[12px] ${form.agreeTerms ? "text-white" : "text-transparent"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <span>
              [필수]{" "}
              <a href="#terms" className="underline text-[#666666] ml-[4px]">서비스 이용약관</a> 및{" "}
              <a href="#privacy" className="underline text-[#666666]">개인정보 처리방침</a> 동의
            </span>
          </label>
        </div>

        {/* 5. 다음 제출 버튼 */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`h-[44px] w-full rounded-[12px] px-[20px] text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-white transition-colors
            ${isFormValid ? "bg-[#111111] hover:bg-[#222222] cursor-pointer" : "bg-[#737373] cursor-not-allowed"}`}
        >
          다음
        </button>
        </form>

        <AuthDivider />

        <div className="flex w-full flex-col gap-[20px]">
          <SocialAuthButtons
            actionLabel="가입하기"
            onSocialAuth={onSocialSignUp}
          />

          {socialErrorMessage && (
            <AuthErrorMessage className="text-center whitespace-pre-line">
              {socialErrorMessage}
            </AuthErrorMessage>
          )}

          <div className="flex justify-center gap-[8px] text-center text-[16px] font-medium leading-[150%] tracking-[-0.16px]">
            <span className="text-text-teritary">이미 계정이 있으신가요?</span>
            <Link to="/login" className="text-text-strong hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </AuthCard>
  );
};
