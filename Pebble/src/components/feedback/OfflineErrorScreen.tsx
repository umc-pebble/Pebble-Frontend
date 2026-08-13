interface OfflineErrorScreenProps {
  isOnline: boolean;
  isRetrying: boolean;
  onRetry: () => void;
}

export function OfflineErrorScreen({
  isOnline,
  isRetrying,
  onRetry,
}: OfflineErrorScreenProps) {
  const description = isOnline
    ? '서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.'
    : '인터넷 연결을 확인한 다음 다시 시도해 주세요.';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[10000] flex min-h-screen items-center justify-center bg-fill-surface px-5 py-8"
    >
      <section className="flex w-full max-w-[480px] flex-col items-center rounded-token-l bg-fill-inverse px-6 py-12 text-center shadow-shadow-m sm:px-10 sm:py-16">
        <div
          aria-hidden="true"
          className="flex size-20 items-center justify-center rounded-full bg-btn-quaternary text-text-secondary"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
          >
            <path
              d="M8.25 17.417C12.063 13.988 16.88 12.1 22 12.1C27.12 12.1 31.937 13.988 35.75 17.417"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M13.75 23.1C16.067 21.017 18.993 19.867 22 19.867C25.007 19.867 27.933 21.017 30.25 23.1"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M19.25 29.15C20.014 28.463 20.978 28.083 22 28.083C23.022 28.083 23.986 28.463 24.75 29.15"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M8 8L36 36"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="mt-token-xl text-title-02-sb text-text-strong sm:text-[28px]">
          네트워크에 연결할 수 없어요
        </h1>

        <p className="mt-token-s text-body-02-m leading-[160%] text-text-secondary">
          {description}
        </p>

        <button
          type="button"
          disabled={isRetrying}
          className="mt-token-xl inline-flex h-12 min-w-[160px] items-center justify-center rounded-token-s bg-btn-primary px-token-xl text-body-02-sb text-text-onFill transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onRetry}
        >
          {isRetrying
            ? '연결 확인 중...'
            : '새로고침'}
        </button>
      </section>
    </div>
  );
}