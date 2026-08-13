import type { ReactNode } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const WEEKS = [
  [31, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 1, 2, 3, 4],
];

const ROW_HEIGHT = 92.4;
const COLUMN_WIDTH = 96.84;
const BAR_GAP = 4;

const ROW_SCHEDULES = [
  {
    rowIndex: 0,
    schedules: [
      {
        title: '강의 복습',
        startColumn: 2,
        top: 29,
        width: 90,
        backgroundColor: '#DAF4FF',
        barColor: '#00CEF5',
        textColor: '#003B48',
      },
    ],
  },
  {
    rowIndex: 1,
    schedules: [
      {
        title: '1차 MVP 완성',
        startColumn: 1,
        top: 29,
        width: 410,
        backgroundColor: '#B9B5F7',
        barColor: '#8B84F2',
        textColor: '#302A73',
      },
      {
        title: '핵심 화면 정리',
        startColumn: 1,
        top: 51,
        width: COLUMN_WIDTH * 2 - BAR_GAP,
        backgroundColor: '#DAD9FB',
        barColor: '#8B84F2',
        textColor: '#302A73',
      },
      {
        title: '캘린더 연결',
        startColumn: 3,
        offsetLeft: BAR_GAP,
        top: 51,
        width: 90,
        backgroundColor: '#DAD9FB',
        barColor: '#8B84F2',
        textColor: '#302A73',
      },
      {
        title: '학원',
        startColumn: 1,
        top: 73,
        width: 92,
        backgroundColor: '#DAF4FF',
        barColor: '#00CEF5',
        textColor: '#003B48',
      },
    ],
  },
  {
    rowIndex: 2,
    schedules: [
      {
        title: '참여자 모집',
        startColumn: 0,
        top: 29,
        width: 285,
        backgroundColor: '#FFEFAD',
        barColor: '#FFDD47',
        textColor: '#241D00',
      },
      {
        title: '장소 예약',
        startColumn: 3,
        offsetLeft: BAR_GAP,
        top: 29,
        width: 210,
        backgroundColor: '#FFF6D5',
        barColor: '#FFDD47',
        textColor: '#241D00',
      },
      {
        title: '참가 신청 오픈',
        startColumn: 0,
        top: 51,
        width: COLUMN_WIDTH * 2 - BAR_GAP,
        backgroundColor: '#FFF6D5',
        barColor: '#FFDD47',
        textColor: '#241D00',
      },
      {
        title: '참석 인원 확인',
        startColumn: 2,
        offsetLeft: BAR_GAP,
        top: 51,
        width: 90,
        backgroundColor: '#FFF6D5',
        barColor: '#FFDD47',
        textColor: '#241D00',
      },
    ],
  },
];

interface DateControlButtonProps {
  children: ReactNode;
  ariaLabel: string;
}

function DateControlButton({ children, ariaLabel }: DateControlButtonProps) {
  return (
    <span
      aria-label={ariaLabel}
      className="flex size-[25.49px] items-center justify-center rounded-token-infinite bg-btn-quaternary text-text-secondary"
    >
      {children}
    </span>
  );
}

function CalendarHeader() {
  return (
    <div className="flex h-[25.49px] w-[182.32px] items-center gap-[4.6px]">
      <strong className="w-[85px] shrink-0 text-[16px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
        2026년 6월
      </strong>

      <div className="flex items-center gap-[4.6px]">
        <DateControlButton ariaLabel="이전 달">
          <ChevronLeftIcon className="size-[14px]" aria-hidden="true" />
        </DateControlButton>

        <span className="flex h-[25.49px] w-[33px] items-center justify-center rounded-token-infinite bg-btn-quaternary text-[9.2px] font-semibold leading-[150%] tracking-[-0.01em] text-text-secondary">
          오늘
        </span>

        <DateControlButton ariaLabel="다음 달">
          <ChevronRightIcon className="size-[14px]" aria-hidden="true" />
        </DateControlButton>
      </div>
    </div>
  );
}

function WeekdayHeader() {
  return (
    <div className="grid h-[32px] w-[677.87px] grid-cols-7">
      {WEEKDAYS.map((weekday, index) => (
        <div key={weekday} className="relative">
          <span
            className={[
              'absolute left-[6px] top-[5px] text-[11.25px] font-medium leading-[150%] tracking-[-0.01em]',
              index === 0
                ? 'text-fill-danger'
                : index === 6
                  ? 'text-fill-info'
                  : 'text-text-secondary',
            ].join(' ')}
          >
            {weekday}
          </span>
        </div>
      ))}
    </div>
  );
}

interface DateNumberProps {
  date: number;
  rowIndex: number;
  columnIndex: number;
}

function DateNumber({ date, rowIndex, columnIndex }: DateNumberProps) {
  const isSunday = columnIndex === 0;
  const isSaturday = columnIndex === 6;
  const isToday = date === 4 && rowIndex === 0;
  const isOutsideMonth =
    (rowIndex === 0 && date === 31) || (rowIndex === 4 && date <= 4);

  if (isToday) {
    return (
      <span className="absolute left-[5px] top-[3px] flex size-[22px] items-center justify-center rounded-full bg-btn-primary text-[11.25px] font-semibold leading-[150%] tracking-[-0.01em] text-text-onFill">
        {date}
      </span>
    );
  }

  return (
    <span
      className={[
        'absolute left-[6px] top-[5px] text-[11.25px] font-semibold leading-[150%] tracking-[-0.01em]',
        isOutsideMonth && isSunday
          ? 'text-text-sunday'
          : isOutsideMonth
            ? 'text-text-teritary'
            : isSunday
              ? 'text-fill-danger'
              : isSaturday
                ? 'text-fill-info'
                : 'text-text-strong',
      ].join(' ')}
    >
      {date}
    </span>
  );
}

interface ScheduleBarProps {
  title: string;
  startColumn: number;
  offsetLeft?: number;
  top: number;
  width: number;
  backgroundColor: string;
  barColor: string;
  textColor: string;
}

function ScheduleBar({
  title,
  startColumn,
  offsetLeft = 0,
  top,
  width,
  backgroundColor,
  barColor,
  textColor,
}: ScheduleBarProps) {
  return (
    <div
      className="absolute flex h-4 items-center overflow-hidden rounded-token-xs"
      style={{
        left: startColumn * COLUMN_WIDTH + offsetLeft,
        top,
        width,
        backgroundColor,
      }}
    >
      <span
        className="h-[14.38px] w-[2.5px] shrink-0 rounded-token-xs"
        style={{ backgroundColor: barColor }}
      />

      <span
        className="ml-[5px] truncate text-[8.13px] font-medium leading-[130%] tracking-[-0.01em]"
        style={{ color: textColor }}
      >
        {title}
      </span>
    </div>
  );
}

function MonthGrid() {
  return (
    <div className="relative h-[462px] w-[677.87px] overflow-hidden">
      <div className="grid h-full w-full grid-cols-7 grid-rows-5">
        {WEEKS.map((week, rowIndex) =>
          week.map((date, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}-${date}`}
              className="relative h-[92.4px] w-[96.84px]"
            >
              <DateNumber
                date={date}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
              />
            </div>
          )),
        )}
      </div>

      {ROW_SCHEDULES.map(({ rowIndex, schedules }) => (
        <div
          key={rowIndex}
          className="absolute left-0 w-full overflow-hidden"
          style={{
            top: rowIndex * ROW_HEIGHT,
            height: ROW_HEIGHT,
          }}
        >
          {schedules.map((schedule) => (
            <ScheduleBar key={schedule.title} {...schedule} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CalendarBody() {
  return (
    <div className="flex h-[500.72px] w-[677.87px] flex-col gap-[6.89px]">
      <WeekdayHeader />
      <MonthGrid />
    </div>
  );
}

interface CalendarFrameProps {
  faded?: boolean;
}

function CalendarFrame({ faded = false }: CalendarFrameProps) {
  return (
    <div
      className={[
        'relative h-[574.47px] w-[756px] overflow-hidden rounded-[18.38px] bg-fill-inverse',
        faded ? '' : 'shadow-[0_0_16.09px_rgba(23,23,23,0.05)]',
      ].join(' ')}
    >
      <div className="absolute left-[39.06px] top-[18.38px] flex h-[537.7px] w-[677.87px] flex-col gap-[11.49px]">
        <CalendarHeader />
        <CalendarBody />
      </div>
    </div>
  );
}

export function FeatureCalendarPreview() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* 뒤쪽 흐린 캘린더 */}
      <div className="absolute left-[719px] top-[130px] h-[607px] w-[788.5px] overflow-hidden opacity-20">
        <CalendarFrame faded />
      </div>

      {/* 앞쪽 메인 캘린더 카드 */}
      <div className="absolute left-[719px] top-[130px] h-[364px] w-[421px] overflow-hidden rounded-token-m bg-fill-inverse shadow-[0_0_28px_rgba(23,23,23,0.05)]">
        <CalendarFrame />
      </div>
    </div>
  );
}