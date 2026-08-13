import type { ReactNode } from 'react';

interface ReportCardProps {
  children: ReactNode;
  className?: string;
}

/** 모든 단계가 공유하는 Figma 1040 × 482 리포트 카드 */
export function ReportCard({ children, className = '' }: ReportCardProps) {
  return (
    <div
      className={`h-[482px] w-[1040px] overflow-hidden rounded-[20px] bg-[rgba(250,250,250,0.4)] px-[64px] shadow-[0_30px_100px_rgba(23,23,23,0.05),inset_0_-3px_4px_#fff,inset_0_5px_8px_rgba(255,255,255,0.6)] ${className}`}
    >
      {children}
    </div>
  );
}
