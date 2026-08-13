import React, { useRef } from "react";
import uploadIcon from "@/assets/icons/Ic/Upload.svg";
import { AuthErrorMessage } from "./AuthErrorMessage";

interface ProfileOption {
  id: string;
  src: string;
  alt: string;
}

interface ProfileSetupFormProps {
  profiles: ProfileOption[];
  selectedProfileId: string;
  selectedProfileSrc: string;
  nickname: string;
  introduction: string;
  isFormValid: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSelectProfile: (profileId: string) => void;
  onUploadProfile: (file: File) => void;
  onNicknameChange: (value: string) => void;
  onIntroductionChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const ProfileSetupForm = ({
  profiles,
  selectedProfileId,
  selectedProfileSrc,
  nickname,
  introduction,
  isFormValid,
  isSubmitting,
  errorMessage,
  onSelectProfile,
  onUploadProfile,
  onNicknameChange,
  onIntroductionChange,
  onBack,
  onSubmit,
}: ProfileSetupFormProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[570px] p-[32px] flex flex-col rounded-[20px] bg-transparent [@media(max-height:850px)]:py-[16px]"
      style={{ fontFamily: "Pretendard, sans-serif" }}
      noValidate
    >
      {/* 뒤로가기와 페이지 제목 */}
      <div className="flex items-center gap-[16px]">
        <button
          type="button"
          onClick={onBack}
          aria-label="회원가입으로 돌아가기"
          className="w-[24px] h-[28px] flex items-center justify-center text-text-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[20px] h-[20px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-[23px] leading-[130%] font-medium tracking-[-0.23px] text-text-primary">
          프로필을 완성해 주세요
        </h1>
      </div>

      {/* 선택한 프로필 이미지와 프로필 선택 목록 */}
      <div className="mt-[40px] flex flex-col items-center [@media(max-height:850px)]:mt-[16px]">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden border border-border-secondary bg-fill-surface">
          <img src={selectedProfileSrc} alt="선택한 프로필 미리보기" className="w-full h-full object-cover" />
        </div>

        <div className="mt-[20px] flex w-full items-start justify-between" aria-label="프로필 이미지 선택">
          {/* 피그마 명세: 기본 이미지 5개는 12px 간격의 한 그룹으로 배치합니다. */}
          <div className="flex shrink-0 items-center gap-[12px]">
            {profiles.map((profile) => {
              const isSelected = profile.id === selectedProfileId;

              return (
                <button
                  key={profile.id}
                  type="button"
                  aria-label={profile.alt}
                  aria-pressed={isSelected}
                  onClick={() => onSelectProfile(profile.id)}
                  className={`size-[72px] shrink-0 overflow-hidden rounded-full bg-fill-surface transition-shadow ${
                    isSelected ? "ring-[3px] ring-border-primary ring-offset-[1px] ring-offset-fill-inverse" : "border border-border-secondary"
                  }`}
                >
                  <img src={profile.src} alt="" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="프로필 이미지 업로드"
            onClick={() => fileInputRef.current?.click()}
            className={`size-[72px] shrink-0 rounded-full border flex items-center justify-center text-text-teritary bg-fill-surface ${
              selectedProfileId === "upload" ? "border-border-primary ring-[3px] ring-border-primary ring-offset-[3px] ring-offset-fill-inverse" : "border-border-secondary"
            }`}
          >
            <img src={uploadIcon} alt="" className="size-[24px]" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUploadProfile(file);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      {/* 닉네임은 필수이고 소개는 선택 입력입니다. */}
      <div className="mt-[40px] flex flex-col [@media(max-height:850px)]:mt-[20px]">
        <label htmlFor="profile-nickname" className="text-[15px] leading-[150%] font-normal tracking-[-0.15px] text-text-teritary mb-[8px]">
          닉네임<span className="text-fill-danger ml-[2px]">*</span>
        </label>
        <input
          id="profile-nickname"
          type="text"
          value={nickname}
          onChange={(event) => onNicknameChange(event.target.value)}
          placeholder="닉네임을 입력해 주세요"
          className="w-full h-[52px] px-[16px] border border-border-secondary bg-fill-inverse rounded-[12px] text-[16px] leading-[24px] font-medium tracking-[-0.16px] text-text-primary outline-none focus:border-border-primary placeholder:text-[15px] placeholder:font-normal placeholder:tracking-[-0.16px] placeholder:text-text-quaternary"
        />
      </div>

      <div className="mt-[20px] flex flex-col [@media(max-height:850px)]:mt-[12px]">
        <label htmlFor="profile-introduction" className="text-[15px] leading-[150%] font-normal tracking-[-0.15px] text-text-teritary mb-[8px]">
          소개 (선택)
        </label>
        <input
          id="profile-introduction"
          type="text"
          value={introduction}
          onChange={(event) => onIntroductionChange(event.target.value)}
          placeholder="소개를 입력해 주세요"
          className="w-full h-[52px] px-[16px] border border-border-secondary bg-fill-inverse rounded-[12px] text-[16px] leading-[24px] font-medium tracking-[-0.16px] text-text-primary outline-none focus:border-border-primary placeholder:text-[15px] placeholder:font-normal placeholder:tracking-[-0.16px] placeholder:text-text-quaternary"
        />
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={`mt-[40px] w-full h-[52px] rounded-[8px] text-[16px] transition-colors [@media(max-height:850px)]:mt-[20px] ${
          isFormValid && !isSubmitting ? "bg-btn-primary text-text-onFill hover:brightness-95 cursor-pointer" : "dark-disabled-primary bg-[#171717B2] text-text-teritary cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "저장 중..." : "시작하기"}
      </button>

      {errorMessage && (
        <AuthErrorMessage className="mt-[12px] justify-center">
          {errorMessage}
        </AuthErrorMessage>
      )}

      <p className="mt-[24px] text-center text-[13px] leading-[20px] text-text-secondary [@media(max-height:850px)]:mt-[12px]">
        프로필 이미지와 닉네임, 소개는 마이페이지에서 언제든 수정할 수 있어요
      </p>
    </form>
  );
};
