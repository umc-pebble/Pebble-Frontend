import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getAccessToken } from '@/services/api';

interface RequireAuthProps {
  children: ReactNode;
}

/** 인증 토큰이 필요한 화면을 보호하고, 미로그인 사용자를 로그인으로 보냅니다. */
export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();

  if (!getAccessToken()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}
