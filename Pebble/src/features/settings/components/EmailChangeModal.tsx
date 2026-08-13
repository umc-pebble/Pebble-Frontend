import {
  useEffect,
  useState,
} from 'react';

import { Button } from '@/components/ui/Button';
import { ModalBackdrop } from '@/components/ui/ModalBackdrop';
import { useRetryableAction } from '@/hooks/useRetryableAction';

import { requestEmailChange } from '../api/settingsApi';

interface EmailChangeModalProps {
  open: boolean;
  currentEmail: string;
  onOpenChange: (open: boolean) => void;
}

function validateEmail(
  email: string,
  currentEmail: string,
) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return '이메일을 입력해 주세요.';
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return '올바른 이메일 형식으로 입력해 주세요.';
  }

  if (
    trimmedEmail.toLowerCase() ===
    currentEmail.trim().toLowerCase()
  ) {
    return '현재 이메일과 다른 이메일을 입력해 주세요.';
  }

  return '';
}

export function EmailChangeModal({
  open,
  currentEmail,
  onOpenChange,
}: EmailChangeModalProps) {
  const [email, setEmail] =
    useState('');

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  const { isRunning, run } =
    useRetryableAction();

  useEffect(() => {
    if (!open) {
      setEmail('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const canSubmit =
    email.trim().length > 0 &&
    !isRunning;

  const handleClose = () => {
    if (isRunning) {
      return;
    }

    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const trimmedEmail =
      email.trim();

    const validationError =
      validateEmail(
        trimmedEmail,
        currentEmail,
      );

    if (
      validationError ||
      isRunning
    ) {
      setErrorMessage(
        validationError,
      );
      setSuccessMessage('');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    /*
     * 다시 시도할 때도 동일한 이메일로 요청하도록
     * 제출 시점의 값을 저장합니다.
     */
    const emailSnapshot =
      trimmedEmail;

    await run(
      async () => {
        await requestEmailChange(
          emailSnapshot,
        );

        setSuccessMessage(
          '인증 링크를 발송했어요. 새 이메일에서 인증을 완료해 주세요.',
        );
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '이메일 변경 요청에 실패했어요.',
          );
        },
      },
    );
  };

  const submitButtonText =
    isRunning
      ? '요청 중...'
      : successMessage
        ? '인증 메일 재전송'
        : '인증 메일 보내기';

  return (
    <ModalBackdrop
      className="overflow-hidden"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="이메일 변경"
        className="w-[480px] rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m max-sm:w-full max-sm:rounded-token-m max-sm:p-4 dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <h2 className="text-title-02-sb text-text-strong">
          이메일 변경
        </h2>

        <p className="mt-token-xs text-body-02-m text-text-secondary">
          새 이메일로 인증을 완료해야 변경이 적용돼요.
        </p>

        <label className="mt-token-l block">
          <span className="text-body-02-sb text-text-strong">
            새 이메일
          </span>

          <input
            type="email"
            value={email}
            disabled={isRunning}
            placeholder="새 이메일을 입력해 주세요"
            className={[
              'mt-token-s h-12 w-full rounded-token-s border px-token-m',
              'bg-fill-inverse text-body-02-m text-text-strong outline-none',
              'placeholder:text-text-teritary',
              'disabled:cursor-not-allowed disabled:opacity-60',
              errorMessage
                ? 'border-fill-danger focus:border-fill-danger'
                : 'border-border-teritory focus:border-border-primary',
            ].join(' ')}
            onChange={(event) => {
              setEmail(
                event.target.value,
              );
              setErrorMessage('');
              setSuccessMessage('');
            }}
          />
        </label>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-token-s text-caption-01 text-fill-danger"
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p
            role="status"
            className="mt-token-s text-caption-01 text-text-primary"
          >
            {successMessage}
          </p>
        ) : null}

        <div className="mt-token-xl grid grid-cols-2 gap-token-m">
          <Button
            type="button"
            variant="cancel"
            disabled={isRunning}
            className="h-11 w-full"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={!canSubmit}
            className="h-11 w-full disabled:opacity-100"
            onClick={() =>
              void handleSubmit()
            }
          >
            {submitButtonText}
          </Button>
        </div>
      </section>
    </ModalBackdrop>
  );
}
