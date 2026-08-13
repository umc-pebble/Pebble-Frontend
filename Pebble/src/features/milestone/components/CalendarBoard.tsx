import { useMemo } from "react";
import { MonthSelector } from "./MonthSelector";
import { CalendarGrid } from "./CalendarGrid";
import { generateWeeks } from "./calendarWeeks";
import { type Category, type TaskItem } from "@/types";
import { CalendarStatusView } from "@/features/calendar/components/CalendarStatusView";

type CalendarBoardProps = {
  isSidebarOpen?: boolean;
  variant?: "default" | "home";
  categories?: Category[];
  standaloneTasks?: TaskItem[];
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
  selectedDate?: Date | null;
  onSelectDate?: (date: Date) => void;
  onClearSelectedDate?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  emptyTitle?: string;
  onRetry?: () => void;
};

export const CalendarBoard = ({
  isSidebarOpen = true,
  variant = "default",
  categories = [],
  standaloneTasks = [],
  currentYear,
  currentMonth,
  onChangeCalendarMonth,
  selectedDate = null,
  onSelectDate,
  onClearSelectedDate,
  isLoading = false,
  errorMessage = null,
  emptyTitle = "왼쪽 추가하기 버튼으로\n카테고리, 마일스톤, 태스크를 만들어 보세요.",
  onRetry,
}: CalendarBoardProps): JSX.Element => {
  const isHomeVariant = variant === "home";
  const boardHeightClassName = isHomeVariant ? "h-[671px]" : "h-[1000px]";
  const boardWidthClassName = isHomeVariant
    ? isSidebarOpen
      ? "w-full rounded-[20px] xl:w-[924px]"
      : "w-full rounded-token-l xl:w-[1316px]"
    : isSidebarOpen
      ? "w-[924px] rounded-[20px]"
      : "w-[1316px] rounded-token-l";
  const contentClassName = isHomeVariant
    ? "ml-6 mt-5 h-[631px] w-[calc(100%_-_48px)]"
    : isSidebarOpen
      ? "ml-6 mt-8 h-[936px]"
      : "ml-[93px] mt-10 h-[920px]";
  const contentWidth = isHomeVariant
    ? undefined
    : isSidebarOpen
      ? 876
      : 1130;
  const todayDate = useMemo(() => new Date(), []);
  const displayedYear = useMemo(() => currentYear, [currentYear]);
  const displayedMonth = useMemo(() => currentMonth, [currentMonth]);
  const visibleCategories = useMemo(
    () => categories.filter((category) => !category.isHidden),
    [categories],
  );
  const weeks = useMemo(
    () =>
      generateWeeks(
        currentYear,
        currentMonth,
        visibleCategories,
        standaloneTasks,
      ),
    [currentYear, currentMonth, visibleCategories, standaloneTasks],
  );
  const hasVisibleScheduleItems = useMemo(
    () => weeks.some((week) => (week.events?.length ?? 0) > 0),
    [weeks],
  );

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      onChangeCalendarMonth(currentYear - 1, 12);
      return;
    }

    onChangeCalendarMonth(currentYear, currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      onChangeCalendarMonth(currentYear + 1, 1);
      return;
    }

    onChangeCalendarMonth(currentYear, currentMonth + 1);
  };

  const handleToday = () => {
    const today = new Date();
    onChangeCalendarMonth(today.getFullYear(), today.getMonth() + 1);
  };

  return (
    <section
      aria-label="월간 캘린더"
      className={`flex shrink-0 flex-col overflow-hidden bg-fill-inverse shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)] transition-all duration-300 ${boardHeightClassName} ${boardWidthClassName}`}
    >
      <div
        className={`relative flex flex-col items-start gap-token-l transition-all duration-300 ${contentClassName}`}
        style={{ width: contentWidth }}
      >
        <header className="inline-flex items-end">
          <MonthSelector 
            displayedYear={displayedYear}
            displayedMonth={displayedMonth}
            onPrevious={handlePreviousMonth}
            onNext={handleNextMonth}
            onToday={handleToday}
          />
        </header>

        <div className="relative flex min-h-0 w-full flex-1 self-stretch">
          <CalendarGrid
            weeks={weeks}
            currentYear={currentYear}
            currentMonth={currentMonth}
            todayDate={todayDate}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onClearSelectedDate={onClearSelectedDate}
            density={isHomeVariant ? "compact" : "default"}
          />
          {(isLoading || errorMessage || !hasVisibleScheduleItems) && (
            <div className="absolute inset-[45px_0_0_0] rounded-token-m bg-fill-inverse/80 backdrop-blur-[1px]">
              {isLoading ? (
                <CalendarStatusView
                  title="캘린더를 불러오는 중이에요"
                  description="카테고리, 마일스톤, 태스크 정보를 확인하고 있어요."
                />
              ) : errorMessage ? (
                <CalendarStatusView
                  title="캘린더를 불러오지 못했어요"
                  description={errorMessage}
                  actionLabel="다시 시도"
                  onAction={onRetry}
                />
              ) : (
                <CalendarStatusView
                  title={emptyTitle}
                  showIcon={false}
                  contentClassName="max-w-[360px]"
                  titleClassName="whitespace-pre-line text-title-03-sb text-text-strong"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
