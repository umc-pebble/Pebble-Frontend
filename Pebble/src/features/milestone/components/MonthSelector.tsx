import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";

type MonthSelectorProps = {
  displayedYear: number;
  displayedMonth: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export const MonthSelector = ({
  displayedYear,
  displayedMonth,
  onPrevious,
  onNext,
  onToday,
}: MonthSelectorProps) => {
  return (
    <div className="relative flex w-full flex-wrap items-center justify-between gap-token-m sm:inline-flex sm:w-auto sm:flex-nowrap sm:justify-start sm:gap-token-l">
      <div className="inline-flex shrink-0 items-center gap-2 text-title-03-sb text-text-strong sm:text-title-01-sb">
        <span>{displayedYear}년</span>
        <span>{displayedMonth}월</span>
      </div>
      <div
        aria-label="캘린더 이동 컨트롤"
        className="inline-flex items-center gap-2"
        role="group"
      >
        <button
          aria-label="이전 달"
          className="flex size-10 shrink-0 items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-strong transition-colors hover:bg-btn-pressed sm:size-11 dark:text-text-secondary"
          onClick={onPrevious}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          className="flex h-10 shrink-0 items-center justify-center rounded-token-infinite bg-btn-quaternary px-3 transition-colors hover:bg-btn-pressed sm:h-11 sm:px-4"
          onClick={onToday}
        >
          <span className="text-body-02-sb text-text-secondary whitespace-nowrap">오늘</span>
        </button>
        <button
          aria-label="다음 달"
          className="flex size-10 shrink-0 items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-strong transition-colors hover:bg-btn-pressed sm:size-11 dark:text-text-secondary"
          onClick={onNext}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
