import React from "react";
import CautionIcon from "@/assets/icons/Ic/Caution.svg?react";

interface AuthErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

// 인증 화면 전체에서 오류 아이콘, 색상, 간격을 동일하게 유지합니다.
export const AuthErrorMessage = ({ children, className = "" }: AuthErrorMessageProps) => (
  <div
    role="alert"
    className={`flex items-start gap-[4px] text-[13px] leading-[20px] text-fill-danger font-medium text-left ${className}`}
  >
    <CautionIcon aria-hidden="true" className="w-[20px] h-[20px] flex-shrink-0" />
    <span className="min-w-0">{children}</span>
  </div>
);
