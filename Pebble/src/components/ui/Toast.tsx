import type { ReactNode } from 'react';

type ToastProps = {
  message: string;
  open?: boolean;
  actionLabel?: string;
  isActionLoading?: boolean;
  children?: ReactNode;
  className?: string;
  role?: 'status' | 'alert';
  'aria-live'?: 'polite' | 'assertive';
  onAction?: () => void;
  onClose?: () => void;
};

export function Toast({
  message,
  open = true,
  actionLabel,
  isActionLoading = false,
  children,
  className = '',
  role = 'status',
  'aria-live': ariaLive = 'polite',
  onAction,
  onClose,
}: ToastProps) {
  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-hidden={!open}
      className={[
        'w-[376px] overflow-hidden rounded-token-s',
        'bg-fill-primary p-3 text-body-02-m text-text-onFill shadow-shadow-m dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.06)]',
        'transition-[opacity,transform] duration-[450ms] ease-in-out',
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
        className,
      ].join(' ')}
    >
      <div className="flex min-h-7 items-center gap-token-m">
        <p className="min-w-0 flex-1 leading-[150%]">
          {message}
        </p>

        {children}

        {actionLabel && onAction ? (
          <button
            type="button"
            disabled={isActionLoading}
            className={[
              'shrink-0 rounded-token-xs px-token-s py-token-xs',
              'text-body-02-sb text-text-onFill underline-offset-2',
              'hover:underline',
              'disabled:cursor-not-allowed disabled:opacity-60',
            ].join(' ')}
            onClick={onAction}
          >
            {isActionLoading ? '재시도 중...' : actionLabel}
          </button>
        ) : null}

        {onClose ? (
          <button
            type="button"
            aria-label="토스트 닫기"
            disabled={isActionLoading}
            className={[
              'shrink-0 text-body-02-sb text-text-onFill',
              'opacity-80 transition-opacity hover:opacity-100',
              'disabled:cursor-not-allowed disabled:opacity-40',
            ].join(' ')}
            onClick={onClose}
          >
            닫기
          </button>
        ) : null}
      </div>
    </div>
  );
}
