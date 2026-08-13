
import { useEffect, useState } from 'react';

import EyeOffIcon from '@/assets/icons/eye-off.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';
import { Button } from '@/components/ui/Button';
import { ModalBackdrop } from '@/components/ui/ModalBackdrop';
import { changePassword } from '@/features/auth/api/authApi';
import { setAuthTokens } from '@/services/api';

interface PasswordChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface VisibilityButtonProps {
  visible: boolean;
  disabled: boolean;
  label: string;
  onVisibleChange: (visible: boolean) => void;
}

function getNewPasswordError(password: string) {
  if (!password) return '';

  if (password.length < 8) {
    return '비밀번호는 8자 이상 입력해 주세요.';
  }

  const hasEnglish = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasEnglish || !hasNumber) {
    return '영문과 숫자를 모두 포함해 주세요.';
  }

  return '';
}

function getConfirmPasswordError(
  password: string,
  confirmPassword: string,
) {
  if (!confirmPassword) return '';

  if (password !== confirmPassword) {
    return '새 비밀번호가 일치하지 않아요.';
  }

  return '';
}

function VisibilityButton({
  visible,
  disabled,
  label,
  onVisibleChange,
}: VisibilityButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`${label} ${visible ? '숨기기' : '보기'}`}
      aria-pressed={visible}
      className="absolute right-token-m top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-text-secondary disabled:cursor-not-allowed"
      onClick={() => onVisibleChange(!visible)}
    >
      {visible ? (
        <EyeOnIcon className="size-5" aria-hidden="true" />
      ) : (
        <EyeOffIcon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}

export function PasswordChangeModal({
  open,
  onOpenChange,
  onSuccess,
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] =
    useState('');

  const [currentPasswordError, setCurrentPasswordError] =
    useState('');
  const [newPasswordServerError, setNewPasswordServerError] =
    useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');

      setCurrentPasswordError('');
      setNewPasswordServerError('');
      setErrorMessage('');

      setIsSubmitting(false);

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  if (!open) return null;

  const clientNewPasswordError =
    getNewPasswordError(newPassword);

  const sameAsCurrentPasswordError =
    currentPassword &&
    newPassword &&
    currentPassword === newPassword
      ? '현재 비밀번호와 다른 비밀번호를 입력해 주세요.'
      : '';

  const newPasswordError =
    clientNewPasswordError ||
    sameAsCurrentPasswordError ||
    newPasswordServerError;

  const confirmPasswordError = getConfirmPasswordError(
    newPassword,
    newPasswordConfirm,
  );

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    newPasswordConfirm.length > 0 &&
    !newPasswordError &&
    !confirmPasswordError &&
    !isSubmitting;

  const inputBaseClassName =
    'h-12 w-full rounded-token-s border px-token-m pr-12 text-body-02-m text-text-strong outline-none placeholder:text-text-teritary disabled:cursor-not-allowed disabled:bg-btn-quaternary';

  const normalInputClassName = [
    inputBaseClassName,
    'border-border-teritory focus:border-border-primary',
  ].join(' ');

  const errorInputClassName = [
    inputBaseClassName,
    'border-fill-danger focus:border-fill-danger',
  ].join(' ');

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setCurrentPasswordError('');
    setNewPasswordServerError('');
    setErrorMessage('');

    try {
      const tokens = await changePassword(
        currentPassword,
        newPassword,
      );

      setAuthTokens(tokens.accessToken, tokens.refreshToken);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '비밀번호 변경에 실패했어요.';

      if (message.includes('현재 비밀번호')) {
        setCurrentPasswordError(message);
      } else if (
        message.includes('8자') ||
        message.includes('영문') ||
        message.includes('숫자') ||
        message.includes('새 비밀번호')
      ) {
        setNewPasswordServerError(message);
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBackdrop
      className="overflow-hidden"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="비밀번호 변경"
        className="w-[480px] rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m max-sm:max-h-[calc(100dvh-32px)] max-sm:w-full max-sm:overflow-y-auto max-sm:rounded-token-m max-sm:p-4 dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-title-02-sb text-text-strong">
          비밀번호 변경
        </h2>

        <p className="mt-token-xs text-body-02-m text-text-secondary">
          현재 비밀번호를 확인한 다음 새 비밀번호를 설정해요.
        </p>

        <div className="mt-token-l flex flex-col gap-token-m">
          <label>
            <span className="text-body-02-sb text-text-strong">
              현재 비밀번호
            </span>

            <div className="relative mt-token-s">
              <input
                name="currentPassword"
                type={
                  showCurrentPassword ? 'text' : 'password'
                }
                autoComplete="current-password"
                value={currentPassword}
                disabled={isSubmitting}
                placeholder="현재 비밀번호를 입력해 주세요"
                className={
                  currentPasswordError
                    ? errorInputClassName
                    : normalInputClassName
                }
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setCurrentPasswordError('');
                  setNewPasswordServerError('');
                  setErrorMessage('');
                }}
              />

              <VisibilityButton
                visible={showCurrentPassword}
                disabled={isSubmitting}
                label="현재 비밀번호"
                onVisibleChange={setShowCurrentPassword}
              />
            </div>

            {currentPasswordError ? (
              <p className="mt-token-xs text-caption-01 text-fill-danger">
                {currentPasswordError}
              </p>
            ) : null}
          </label>

          <label>
            <span className="text-body-02-sb text-text-strong">
              새 비밀번호
            </span>

            <div className="relative mt-token-s">
              <input
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                disabled={isSubmitting}
                placeholder="새 비밀번호를 입력해 주세요"
                className={
                  newPasswordError
                    ? errorInputClassName
                    : normalInputClassName
                }
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setNewPasswordServerError('');
                  setErrorMessage('');
                }}
              />

              <VisibilityButton
                visible={showNewPassword}
                disabled={isSubmitting}
                label="새 비밀번호"
                onVisibleChange={setShowNewPassword}
              />
            </div>

            {newPasswordError ? (
              <p className="mt-token-xs text-caption-01 text-fill-danger">
                {newPasswordError}
              </p>
            ) : null}
          </label>

          <label>
            <span className="text-body-02-sb text-text-strong">
              새 비밀번호 확인
            </span>

            <div className="relative mt-token-s">
              <input
                name="newPasswordConfirm"
                type={
                  showConfirmPassword ? 'text' : 'password'
                }
                autoComplete="new-password"
                value={newPasswordConfirm}
                disabled={isSubmitting}
                placeholder="새 비밀번호를 다시 입력해 주세요"
                className={
                  confirmPasswordError
                    ? errorInputClassName
                    : normalInputClassName
                }
                onChange={(event) => {
                  setNewPasswordConfirm(event.target.value);
                  setErrorMessage('');
                }}
              />

              <VisibilityButton
                visible={showConfirmPassword}
                disabled={isSubmitting}
                label="새 비밀번호 확인"
                onVisibleChange={setShowConfirmPassword}
              />
            </div>

            {confirmPasswordError ? (
              <p className="mt-token-xs text-caption-01 text-fill-danger">
                {confirmPasswordError}
              </p>
            ) : null}
          </label>
        </div>

        {errorMessage ? (
          <p className="mt-token-s text-caption-01 text-fill-danger">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-token-xl grid grid-cols-2 gap-token-m">
          <Button
            variant="cancel"
            disabled={isSubmitting}
            className="h-11 w-full"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            variant="primary"
            disabled={!canSubmit}
            className="h-11 w-full disabled:opacity-100"
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? '변경 중...' : '변경하기'}
          </Button>
        </div>
      </section>
    </ModalBackdrop>
  );
}
