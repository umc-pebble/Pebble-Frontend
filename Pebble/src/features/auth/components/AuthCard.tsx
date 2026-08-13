import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  children: ReactNode;
  dataId?: string;
  /** 회원가입 최신 명세처럼 상하 패딩만 20px로 줄일지 여부 */
  compactVerticalPadding?: boolean;
}

export const AuthCard = ({
  title,
  children,
  dataId,
  compactVerticalPadding = false,
}: AuthCardProps): JSX.Element => {
  return (
    <div
      className={`flex w-full max-w-[570px] flex-col gap-[40px] rounded-[20px] bg-transparent ${
        compactVerticalPadding
          ? 'px-[32px] py-[20px]'
          : 'p-[24px] sm:p-[32px]'
      }`}
      data-id={dataId}
    >
      <h1 className="text-[24px] font-semibold leading-[31px] tracking-[-0.24px] text-text-primary">
        {title}
      </h1>
      {children}
    </div>
  );
};
