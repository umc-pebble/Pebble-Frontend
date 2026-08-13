import { useEffect } from 'react';

import CloseIcon from '@/assets/icons/Close.svg?react';
import { ModalBackdrop } from '@/components/ui/ModalBackdrop';

type LogoutConfirmModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export const LogoutConfirmModal = ({
  isOpen,
  isSubmitting = false,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop
      layerClassName="z-[100]"
      className="overflow-hidden"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        className="flex w-[400px] flex-col items-start justify-center gap-5 overflow-hidden rounded-token-l bg-fill-inverse p-token-xl shadow-[0_0_28px_0_rgba(23,23,23,0.05)] max-sm:w-full max-sm:rounded-token-m max-sm:p-4 dark:border-[0.5px] dark:border-border-secondary"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-token-xs pt-token-s">
            <h2
              id="logout-confirm-title"
              className="whitespace-nowrap text-title-02-sb text-text-strong"
            >
              로그아웃 하시겠어요?
            </h2>
          </div>

          <button
            type="button"
            className="flex size-11 shrink-0 items-center justify-center rounded-token-s text-text-secondary transition-colors hover:bg-fill-surface dark:text-btn-secondary"
            aria-label="로그아웃 모달 닫기"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <CloseIcon className="size-6" />
          </button>
        </header>

        <div className="flex w-full items-start gap-token-m">
          <button
            type="button"
            className="relative flex h-11 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-token-s bg-btn-quaternary px-token-l text-body-02-m text-text-strong transition-colors before:pointer-events-none before:absolute before:inset-0 before:rounded-token-s before:transition-colors hover:before:bg-[rgba(250,250,250,0.18)] active:before:bg-[rgba(250,250,250,0.28)] dark:hover:before:bg-[rgba(23,23,23,0.15)] dark:active:before:bg-[rgba(23,23,23,0.25)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:before:bg-transparent"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="button"
            className="dark-disabled-primary relative flex h-11 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-token-s bg-btn-primary px-token-l text-body-02-m text-text-onFill transition-colors before:pointer-events-none before:absolute before:inset-0 before:rounded-token-s before:transition-colors hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:before:bg-transparent"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            로그아웃
          </button>
        </div>
      </section>
    </ModalBackdrop>
  );
};
