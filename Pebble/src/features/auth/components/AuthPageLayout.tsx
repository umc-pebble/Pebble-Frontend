import type { ReactNode } from 'react';

import { Header } from './Header';

interface AuthPageLayoutProps {
  children: ReactNode;
  dataId: string;
  variant?: 'login' | 'signup';
}

export const AuthPageLayout = ({
  children,
  dataId,
  variant = 'login',
}: AuthPageLayoutProps): JSX.Element => {
  return (
    <main
      className="flex h-dvh w-full flex-col overflow-x-hidden overflow-y-auto bg-fill-inverse [font-family:'Pretendard',sans-serif]"
      data-id={dataId}
      data-theme="light"
    >
      <Header />
      <div
        className={`mx-auto flex min-h-0 w-full flex-1 justify-center overflow-x-clip px-[16px] ${
          variant === 'signup'
            ? 'shrink-0 items-start pb-[52px] pt-0'
            : 'items-center pb-[54px]'
        }`}
      >
        {/* 회원가입은 원본 크기를 유지하고 낮은 화면에서만 페이지를 스크롤합니다. */}
        <div className="w-full max-w-[570px]">{children}</div>
      </div>
    </main>
  );
};
