// src/features/auth/containers/LoginContainer.tsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { login } from '@/features/auth/api/authApi';
import type { LoginLocationState } from '@/features/auth/types/authNavigation';
import { startSocialLogin } from '@/features/auth/utils/socialOAuth';
import { useProfileStore } from '@/features/mypage/store/useProfileStore';
import { ApiRequestError, setAuthTokens } from '@/services/api';

import { LoginForm } from '../components/LoginForm';

export const LoginContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const socialAuthMessage = (location.state as LoginLocationState | null)
    ?.socialAuthMessage;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    socialAuthMessage ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 개별 필드 에러 및 흔들림(shake) 상태 관리
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [shakeTarget, setShakeTarget] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  // 회원가입 페이지와 동일한 셰이크 트리거 함수
  const triggerShake = (field: 'email' | 'password') => {
    setShakeTarget((prev) => ({ ...prev, [field]: true }));
    setTimeout(
      () => setShakeTarget((prev) => ({ ...prev, [field]: false })),
      400,
    );
  };

  // 회원가입 정규식과 통일 (@ 이후 최소 3자, 첫 번째 . 이후 최소 2자)
  const emailRegex = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (errorMessage) setErrorMessage(null);

    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (errorMessage) setErrorMessage(null);

    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // 통합 포커스 아웃(onBlur) 핸들러
  const handleFieldBlur = (field: 'email' | 'password') => {
    // 회원가입 페이지처럼 빈 값일 때는 Blur 시점 검사를 건너뜁니다.
    if (field === 'email' && email !== '') {
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({
          ...prev,
          email: '올바른 이메일 형식이 아니에요',
        }));
        triggerShake('email');
      }
    }

    if (field === 'password' && password !== '') {
      if (password.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: '비밀번호는 8자 이상이어야 합니다.',
        }));
        triggerShake('password');
      }
    }
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  // 로그인 시도(제출) 시점에 빈 값 필터링 및 셰이크 처리
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;

    let hasError = false;
    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.';
      triggerShake('email');
      hasError = true;
    } else if (!emailRegex.test(email)) {
      nextErrors.email = '올바른 이메일 형식이 아니에요';
      triggerShake('email');
      hasError = true;
    }

    if (!password) {
      nextErrors.password = '비밀번호를 입력해 주세요.';
      triggerShake('password');
      hasError = true;
    }

    if (hasError) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      // 이전 계정 프로필을 비운 뒤 새 토큰으로 현재 사용자 프로필을 다시 조회합니다.
      useProfileStore.getState().resetProfile();

      // 발급받은 토큰은 공통 API 클라이언트가 이후 요청에 자동으로 사용합니다.
      setAuthTokens(response.accessToken, response.refreshToken);
      await useProfileStore.getState().loadProfile();
      setErrors({});
      setErrorMessage(null);

      if (response.mustChangePassword) {
        navigate('/forgot-password', {
          replace: true,
          state: {
            initialStep: 3,
            currentPassword: password,
          },
        });
        return;
      }

      navigate('/', { replace: true });
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        (error.status === 401 || error.code === 'AUTH_INVALID_CREDENTIAL')
      ) {
        setErrorMessage(
          '로그인하지 못했어요.\n이메일 또는 비밀번호를 다시 확인해 주세요.',
        );
        return;
      }

      setErrorMessage(
        '로그인하지 못했어요.\n잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'naver') => {
    try {
      setErrorMessage(null);
      startSocialLogin(provider, 'login');
    } catch {
      setErrorMessage(
        '소셜 로그인을 시작하지 못했어요.\nOAuth 설정을 확인해 주세요.',
      );
    }
  };

  return (
    <LoginForm
      email={email}
      password={password}
      showPassword={showPassword}
      errorMessage={errorMessage}
      errors={errors}
      shakeTarget={shakeTarget}
      isSubmitting={isSubmitting}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onFieldBlur={handleFieldBlur}
      onTogglePassword={handleTogglePassword}
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
    />
  );
};
