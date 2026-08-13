import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/Button';
import { confirmEmailChange } from '@/features/settings/api/settingsApi';
import type { EmailConfirmResponse } from '@/features/settings/types/settings';
import {
  ApiRequestError,
  getAccessToken,
} from '@/services/api';

type VerificationStatus = 'loading' | 'success' | 'error';

const verificationRequests = new Map<
  string,
  Promise<EmailConfirmResponse>
>();

function confirmEmailOnce(token: string) {
  const cachedRequest = verificationRequests.get(token);

  if (cachedRequest) {
    return cachedRequest;
  }

  const request = confirmEmailChange(token).catch((error) => {
    verificationRequests.delete(token);
    throw error;
  });

  verificationRequests.set(token, request);

  return request;
}

export function EmailVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(
    () => searchParams.get('token')?.trim() ?? '',
    [searchParams],
  );

  const [status, setStatus] =
    useState<VerificationStatus>('loading');
  const [message, setMessage] = useState(
    '이메일 인증 정보를 확인하고 있어요.',
  );
  const [changedEmail, setChangedEmail] = useState('');
  const [canRetry, setCanRetry] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const isAuthenticated = Boolean(getAccessToken());

  const verifyEmail = useCallback(async () => {
    if (!token) {
      setStatus('error');
      setMessage('이메일 인증 토큰이 없어요.');
      setCanRetry(false);
      return;
    }

    setStatus('loading');
    setMessage('이메일 인증 정보를 확인하고 있어요.');
    setChangedEmail('');
    setCanRetry(false);

    try {
      const result = await confirmEmailOnce(token);

      setChangedEmail(result.email);
      setStatus('success');
      setMessage('이메일이 변경되었어요.');
    } catch (error) {
      const isTemporaryError =
        error instanceof ApiRequestError &&
        (!error.status || error.status >= 500);

      setStatus('error');
      setCanRetry(isTemporaryError);
      setMessage(
        error instanceof Error
          ? error.message
          : '인증 링크가 만료되었거나 유효하지 않아요.',
      );
    }
  }, [token]);

  useEffect(() => {
    let isActive = true;

    void verifyEmail().catch(() => {
      if (!isActive) return;
    });

    return () => {
      isActive = false;
    };
  }, [retryCount, verifyEmail]);

  const handleMove = () => {
    navigate(isAuthenticated ? '/settings' : '/login', {
      replace: true,
    });
  };

  const handleRetry = () => {
    if (status === 'loading') return;

    verificationRequests.delete(token);
    setRetryCount((current) => current + 1);
  };

  return (
    <div className="min-h-screen bg-fill-inverse">
      <PublicHeader variant="auth" />

      <main className="flex min-h-[calc(100vh-95px)] items-center justify-center px-token-l pb-[95px]">
        <section
          aria-live="polite"
          className="w-full max-w-[480px] rounded-token-l bg-fill-surface p-token-xl text-center shadow-shadow-m"
        >
          {status === 'loading' ? (
            <>
              <div
                aria-hidden="true"
                className="mx-auto size-10 animate-spin rounded-full border-4 border-border-secondary border-t-border-primary"
              />

              <h1 className="mt-token-l text-title-02-sb text-text-strong">
                이메일 인증 중
              </h1>

              <p className="mt-token-s text-body-02-m text-text-secondary">
                {message}
              </p>
            </>
          ) : null}

          {status === 'success' ? (
            <>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-btn-primary text-[24px] text-text-onFill">
                ✓
              </div>

              <h1 className="mt-token-l text-title-02-sb text-text-strong">
                이메일 변경 완료
              </h1>

              <p className="mt-token-s text-body-02-m text-text-secondary">
                {message}
              </p>

              {changedEmail ? (
                <p className="mt-token-xs break-all text-body-02-sb text-text-primary">
                  {changedEmail}
                </p>
              ) : null}

              <Button
                variant="primary"
                className="mt-token-xl h-11 w-full"
                onClick={handleMove}
              >
                {isAuthenticated
                  ? '설정으로 돌아가기'
                  : '로그인하러 가기'}
              </Button>
            </>
          ) : null}

          {status === 'error' ? (
            <>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-fill-danger text-[24px] text-text-onFill">
                !
              </div>

              <h1 className="mt-token-l text-title-02-sb text-text-strong">
                이메일 인증 실패
              </h1>

              <p className="mt-token-s whitespace-pre-line text-body-02-m text-fill-danger">
                {message}
              </p>

              <p className="mt-token-xs text-caption-01 text-text-teritary">
                {canRetry
                  ? '네트워크 연결을 확인한 후 다시 시도해 주세요.'
                  : '인증 링크가 만료되었다면 이메일 변경을 다시 요청해 주세요.'}
              </p>

              <div className="mt-token-xl flex flex-col gap-token-s">
                {canRetry ? (
                  <Button
                    variant="primary"
                    className="h-11 w-full"
                    onClick={handleRetry}
                  >
                    다시 확인
                  </Button>
                ) : null}

                <Button
                  variant={canRetry ? 'secondary' : 'primary'}
                  className="h-11 w-full"
                  onClick={handleMove}
                >
                  {isAuthenticated
                    ? '설정으로 돌아가기'
                    : '로그인하러 가기'}
                </Button>
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}