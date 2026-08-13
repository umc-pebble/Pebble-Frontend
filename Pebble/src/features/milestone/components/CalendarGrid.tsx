import { type CalendarWeek } from "./types";
import { DateCell } from "./DateCell";
import { ScheduleBar } from "./ScheduleBar";
import { EVENT_ROW_HEIGHT, EVENT_START_TOP_OFFSET } from "./calendarWeeks";

type CalendarGridProps = {
  weeks: CalendarWeek[];
  currentYear: number;
  currentMonth: number;
  todayDate: Date;
  selectedDate?: Date | null;
  onSelectDate?: (date: Date) => void;
  onClearSelectedDate?: () => void;
  density?: "default" | "compact";
};

const dayLabels = [
  { label: "일", textClass: "text-fill-danger" },
  { label: "월", textClass: "text-text-secondary" },
  { label: "화", textClass: "text-text-secondary" },
  { label: "수", textClass: "text-text-secondary" },
  { label: "목", textClass: "text-text-secondary" },
  { label: "금", textClass: "text-text-secondary" },
  { label: "토", textClass: "text-fill-info" },
];

const DEFAULT_WEEK_ROW_MIN_HEIGHT = 132;
const EVENT_BOTTOM_PADDING = 12;

const getWeekRowMinHeight = (
  eventCount: number,
  density: CalendarGridProps["density"],
) =>
  Math.max(
    density === "compact" ? 88 : DEFAULT_WEEK_ROW_MIN_HEIGHT,
    EVENT_START_TOP_OFFSET + eventCount * EVENT_ROW_HEIGHT + EVENT_BOTTOM_PADDING,
  );

export const CalendarGrid = ({
  weeks,
  currentYear,
  currentMonth,
  todayDate,
  selectedDate = null,
  onSelectDate,
  onClearSelectedDate,
  density = "default",
}: CalendarGridProps) => {
  return (
    <div className="relative flex min-h-0 w-full flex-1 grow flex-col items-start gap-3 self-stretch">
      {/* 요일 헤더 */}
      <div
        aria-hidden="true"
        className="relative flex w-full flex-[0_0_auto] items-center self-stretch"
      >
        {dayLabels.map((day) => (
          <div key={day.label} className="relative flex h-[45px] flex-1 grow justify-center">
            <div className={`absolute top-2 text-body-01-m ${day.textClass}`}>
              {day.label}
            </div>
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div
        className="custom-scrollbar relative flex w-full flex-1 grow flex-col items-start self-stretch overflow-y-auto overflow-x-hidden pr-1"
        onClick={onClearSelectedDate}
      >
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className="relative flex w-full flex-1 grow items-center self-stretch"
            style={{
              minHeight: getWeekRowMinHeight(
                week.events?.length ?? 0,
                density,
              ),
            }}
            role="row"
          >
            {/* 각 일(Day) 셀 */}
            {week.days.map((day, dayIndex) => {
              const cellDate = new Date(
                currentYear,
                currentMonth - 1 + day.monthOffset,
                day.day,
              );
              const isSelected =
                selectedDate?.getFullYear() === cellDate.getFullYear() &&
                selectedDate?.getMonth() === cellDate.getMonth() &&
                selectedDate?.getDate() === cellDate.getDate();
              const isToday =
                currentYear === todayDate.getFullYear() &&
                currentMonth === todayDate.getMonth() + 1 &&
                day.day === todayDate.getDate() &&
                day.monthOffset === 0;

              return (
                <DateCell
                  key={`${weekIndex}-${dayIndex}-${day.day}`}
                  day={day}
                  columnIndex={dayIndex}
                  isSelected={isSelected}
                  isToday={isToday}
                  onSelect={(event) => {
                    event.stopPropagation();
                    onSelectDate?.(cellDate);
                  }}
                />
              );
            })}

            {/* 마일스톤(이벤트) 렌더링 */}
            {week.events?.map((event) => (
              <ScheduleBar key={event.id} event={event} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
