import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AUTH_SESSION_CLEARED_EVENT,
  type AuthSessionClearedEventDetail,
} from '@/services/api/authToken';

const PUBLIC_PATHS = [
  '/landing',
  '/login',
  '/signup',
  '/forgot-password',
  '/profile-setup',
  '/signup-complete',
  '/oauth/callback',
];

/** 다른 탭에서 로그아웃·토큰 만료·탈퇴가 발생하면 현재 탭도 즉시 로그아웃합니다. */
export function AuthSessionSynchronizer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionCleared = (event: Event) => {
      const { external } = (event as CustomEvent<AuthSessionClearedEventDetail>)
        .detail;

      if (
        external &&
        !PUBLIC_PATHS.some((path) => location.pathname.startsWith(path))
      ) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);
    return () => {
      window.removeEventListener(
        AUTH_SESSION_CLEARED_EVENT,
        handleSessionCleared,
      );
    };
  }, [location.pathname, navigate]);

  return null;
}
