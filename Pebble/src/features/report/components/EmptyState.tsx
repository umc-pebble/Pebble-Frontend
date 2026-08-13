interface EmptyStateProps {
  /** 예: "이번 달에는 기록한 카테고리가 없어요" */
  message: string;
  className?: string;
  darkTheme?: boolean;
}

/**
 * 해당 섹션에 보여줄 기록이 없을 때.
 *
 * FallbackNotice 와 구분해주세요.
 *  - EmptyState : 정상 응답인데 기록이 0건 (사용자 잘못도 오류도 아님)
 *  - FallbackNotice : 데이터를 못 받음 (오류 상황)
 */
export function EmptyState({
  message,
  className = '',
  darkTheme = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[180px] items-center justify-center rounded-2xl bg-[#F7F7F7] px-6 ${
        darkTheme ? 'dark:bg-fill-inverse' : ''
      } ${className}`}
    >
      <p
        className={`text-center text-sm text-[#8E8E8E] ${
          darkTheme ? 'dark:text-text-secondary' : ''
        }`}
      >
        {message}
      </p>
    </div>
  );
}
