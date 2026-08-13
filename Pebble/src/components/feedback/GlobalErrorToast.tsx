import { useEffect, useState } from 'react';

import { Toast } from '@/components/ui/Toast';

import {
  closeGlobalErrorToast,
  retryGlobalErrorToastAction,
  subscribeGlobalErrorToast,
  type GlobalErrorToastState,
} from './globalErrorToastStore';

const INITIAL_TOAST_STATE: GlobalErrorToastState = {
  open: false,
  message: '',
  isRetrying: false,
};

export function GlobalErrorToast() {
  const [toastState, setToastState] =
    useState<GlobalErrorToastState>(INITIAL_TOAST_STATE);

  useEffect(
    () => subscribeGlobalErrorToast(setToastState),
    [],
  );

  return (
    <Toast
      open={toastState.open}
      message={toastState.message}
      actionLabel={toastState.retryLabel}
      isActionLoading={toastState.isRetrying}
      role="alert"
      aria-live="assertive"
      className={[
        'fixed bottom-4 left-4 right-4 z-[9999] w-auto',
        'sm:bottom-8 sm:left-auto sm:right-8 sm:w-[376px]',
      ].join(' ')}
      onAction={
        toastState.retry
          ? () => void retryGlobalErrorToastAction()
          : undefined
      }
      onClose={closeGlobalErrorToast}
    />
  );
}