import type { CSSProperties } from 'react';

import type { DateType, DayStatus } from '@/hooks/useScheduleDatePicker';

import {
  getScheduleSelectedColor,
  getScheduleSelectedTextColor,
} from './scheduleDatePickerTheme';

type ScheduleMonthCalendarProps = {
  currentYear: number;
  currentMonth: number;
  dateType: DateType;
  daysInMonth: number;
  disabled: boolean;
  firstDay: number;
  getDayStatus: (day: number) => DayStatus;
  isTaskVariant: boolean;
  onDateClick: (day: number) => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  themeBaseColor: string;
  themeLightColor: string;
  themeMidColor: string;
};

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_SIZE_CLASS = 'size-12';
const WEEK_HEIGHT_CLASS = 'h-14';
const MONTH_BUTTON_CLASS =
  'flex h-8 w-8 items-center justify-center rounded-full bg-fill-surface text-text-strong transition-[background-color,filter] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-fill-surface dark:bg-btn-quaternary dark:text-text-secondary dark:hover:bg-btn-pressed dark:disabled:hover:bg-btn-quaternary';

const getDayButtonClass = (status: DayStatus) => {
  const baseClass = `${DAY_SIZE_CLASS} rounded-[12px] flex items-center justify-center text-body-01-m tracking-[-0.18px] transition-colors z-10 relative`;

  if (
    status === 'selected' ||
    status === 'range-start' ||
    status === 'range-end'
  ) {
    return baseClass;
  }

  if (status === 'today') {
    return `${baseClass} bg-fill-surface text-text-strong`;
  }

  return `${baseClass} text-text-strong hover:bg-fill-surface`;
};

const getCalendarWeeks = (firstDay: number, daysInMonth: number) => {
  const cells: Array<number | null> = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return Array.from(
    { length: Math.ceil(cells.length / 7) },
    (_, weekIndex) => {
      const week = cells.slice(weekIndex * 7, weekIndex * 7 + 7);
      return [...week, ...Array.from({ length: 7 - week.length }, () => null)];
    },
  );
};

const MonthArrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d={
        direction === 'left'
          ? 'M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z'
          : 'M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z'
      }
      fill="currentColor"
    />
  </svg>
);

export const ScheduleMonthCalendar = ({
  currentYear,
  currentMonth,
  dateType,
  daysInMonth,
  disabled,
  firstDay,
  getDayStatus,
  isTaskVariant,
  onDateClick,
  onNextMonth,
  onPrevMonth,
  themeBaseColor,
  themeLightColor,
  themeMidColor,
}: ScheduleMonthCalendarProps) => {
  const calendarWeeks = getCalendarWeeks(firstDay, daysInMonth);
  const selectedColor = getScheduleSelectedColor(
    dateType,
    themeBaseColor,
    themeMidColor,
  );
  const selectedTextColor = getScheduleSelectedTextColor(
    dateType,
    themeBaseColor,
    themeMidColor,
  );
  const rangeBackgroundStyle = {
    '--schedule-range-color': themeLightColor,
  } as CSSProperties;

  const renderWeekRangeBackground = (week: Array<number | null>) => {
    if (disabled || dateType !== '기간') return null;

    const rangeCells = week
      .map((day, index) => ({
        index,
        status: day === null ? 'none' : getDayStatus(day),
      }))
      .filter(({ status }) =>
        ['range-start', 'range-end', 'in-range'].includes(status),
      );

    if (rangeCells.length === 0) return null;

    const firstRangeCell = rangeCells[0];
    const lastRangeCell = rangeCells[rangeCells.length - 1];
    const startColumn =
      firstRangeCell.index +
      (firstRangeCell.status === 'range-start' ? 0.5 : 0);
    const endColumn =
      lastRangeCell.index +
      (lastRangeCell.status === 'range-end' ? 0.5 : 1);

    return (
      <div
        className="schedule-date-range-segment pointer-events-none absolute top-1/2 h-12 -translate-y-1/2 rounded-[12px]"
        style={{
          ...rangeBackgroundStyle,
          left: `${(startColumn / 7) * 100}%`,
          width: `${((endColumn - startColumn) / 7) * 100}%`,
        }}
      />
    );
  };

  return (
    <div className={`flex w-full flex-col gap-4 ${isTaskVariant ? 'mt-3' : ''}`}>
      <div
        className={
          isTaskVariant
            ? 'relative flex w-full items-center justify-center'
            : 'flex items-center gap-2'
        }
      >
        {!isTaskVariant ? (
          <span className="mr-2 text-[20px] font-bold tracking-[-0.2px] text-text-strong">
            {currentYear}년 {currentMonth + 1}월
          </span>
        ) : null}

        <button
          type="button"
          onClick={onPrevMonth}
          disabled={disabled}
          className={`${isTaskVariant ? 'absolute left-[35%]' : ''} ${MONTH_BUTTON_CLASS}`}
          aria-label="이전 달"
        >
          <MonthArrow direction="left" />
        </button>

        {isTaskVariant ? (
          <span className="text-[20px] font-semibold tracking-[-0.2px] text-text-strong">
            {currentYear}년 {currentMonth + 1}월
          </span>
        ) : null}

        <button
          type="button"
          onClick={onNextMonth}
          disabled={disabled}
          className={`${isTaskVariant ? 'absolute right-[35%]' : ''} ${MONTH_BUTTON_CLASS}`}
          aria-label="다음 달"
        >
          <MonthArrow direction="right" />
        </button>
      </div>

      <div
        className={`flex w-full flex-col gap-4 ${isTaskVariant ? 'px-4' : ''}`}
      >
        <div className="grid w-full grid-cols-7 text-center">
          {WEEK_DAYS.map((day) => (
            <span
              key={day}
              className="text-body-02-m tracking-[-0.16px] text-text-teritary"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="flex w-full flex-col gap-4">
          {calendarWeeks.map((week, weekIndex) => (
            <div
              key={`week-${weekIndex}`}
              className={`relative grid w-full grid-cols-7 ${WEEK_HEIGHT_CLASS}`}
            >
              {renderWeekRangeBackground(week)}

              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <div key={`empty-${weekIndex}-${dayIndex}`} />;
                }

                const status = disabled ? 'none' : getDayStatus(day);
                const isSelected = [
                  'selected',
                  'range-start',
                  'range-end',
                ].includes(status);

                return (
                  <div
                    key={day}
                    className="relative flex w-full items-center justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => onDateClick(day)}
                      disabled={disabled}
                      className={`${getDayButtonClass(status)} disabled:cursor-not-allowed disabled:opacity-50`}
                      style={
                        !disabled && isSelected
                          ? {
                              backgroundColor: selectedColor,
                              color: selectedTextColor,
                            }
                          : undefined
                      }
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
