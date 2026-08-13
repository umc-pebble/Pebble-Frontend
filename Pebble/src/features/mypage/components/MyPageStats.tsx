type MyPageStatsProps = {
  isCompact: boolean;
  pebbleCount: number;
  completedCategoryCount: number;
};

export const MyPageStats = ({
  isCompact,
  pebbleCount,
  completedCategoryCount,
}: MyPageStatsProps): JSX.Element => {
  return (
    <div
      className={`mx-auto w-full max-w-[640px] overflow-hidden transition-[max-height,margin,opacity,transform] duration-500 ease-in-out ${
        isCompact
          ? "pointer-events-none mt-0 max-h-0 -translate-y-3 opacity-0"
          : "mt-11 max-h-[120px] translate-y-0 opacity-100"
      }`}
    >
      <div className="flex h-[104px] items-center justify-center rounded-token-l bg-fill-surface shadow-shadow-m sm:h-[120px] sm:rounded-[40px] dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.06)]">
        <div className="flex w-1/2 flex-col items-center gap-1">
          <span className="text-body-01-m text-text-secondary">
            수놓은 조약돌
          </span>
          <strong className="text-title-01-sb text-text-strong">
            {pebbleCount}
          </strong>
        </div>

        <div
          className="h-[72px] w-px bg-border-default"
          aria-hidden="true"
        />

        <div className="flex w-1/2 flex-col items-center gap-1">
          <span className="text-body-01-m text-text-secondary">
            완료한 카테고리
          </span>
          <strong className="text-title-01-sb text-text-strong">
            {completedCategoryCount}
          </strong>
        </div>
      </div>
    </div>
  );
};
