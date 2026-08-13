// src/features/landing/components/LandingCalendarPreview.tsx

import type { CSSProperties, ReactNode } from 'react';

import BellOutlineIcon from '@/assets/icons/bell-outline no-dot.svg?react';
import CalendarOutlineIcon from '@/assets/icons/calendar-outline.svg?react';
import CardViewIcon from '@/assets/icons/Card-view.svg?react';
import ChevronDownIcon from '@/assets/icons/chevron-down.svg?react';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';
import ListViewIcon from '@/assets/icons/List-view.svg?react';
import SettingsOutlineIcon from '@/assets/icons/settings-outline.svg?react';
import SidebarOpenIcon from '@/assets/icons/sidebar-open.svg?react';
import SocialOutlineIcon from '@/assets/icons/social-outline.svg?react';
import UserOutlineIcon from '@/assets/icons/user-outline.svg?react';

import calendarBgEllipse1 from '@/assets/images/landing/hero-calendar-bg-ellipse-1.svg';
import calendarBgEllipse2 from '@/assets/images/landing/hero-calendar-bg-ellipse-2.svg';
import calendarBgEllipse4 from '@/assets/images/landing/hero-calendar-bg-ellipse-4.svg';
import calendarBgEllipse5 from '@/assets/images/landing/hero-calendar-bg-ellipse-5.svg';

interface LandingCalendarPreviewProps {
  className?: string;
  style?: CSSProperties;
}

type CalendarDateType = 'sunday' | 'saturday' | 'weekday' | 'today';

interface CalendarDate {
  day: number;
  currentMonth: boolean;
  type: CalendarDateType;
}

interface ScheduleItem {
  id: string;
  title: string;
  week: number;
  row: number;
  startColumn: number;
  span: number;
  backgroundColor: string;
  barColor: string;
  textColor: string;
}

interface CategoryItem {
  id: string;
  title: string;
  color: string;
}

interface NavigationIconProps {
  children: ReactNode;
  selected?: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const calendarDates: CalendarDate[] = [
  { day: 31, currentMonth: false, type: 'sunday' },
  { day: 1, currentMonth: true, type: 'weekday' },
  { day: 2, currentMonth: true, type: 'weekday' },
  { day: 3, currentMonth: true, type: 'weekday' },
  { day: 4, currentMonth: true, type: 'today' },
  { day: 5, currentMonth: true, type: 'weekday' },
  { day: 6, currentMonth: true, type: 'saturday' },

  { day: 7, currentMonth: true, type: 'sunday' },
  { day: 8, currentMonth: true, type: 'weekday' },
  { day: 9, currentMonth: true, type: 'weekday' },
  { day: 10, currentMonth: true, type: 'weekday' },
  { day: 11, currentMonth: true, type: 'weekday' },
  { day: 12, currentMonth: true, type: 'weekday' },
  { day: 13, currentMonth: true, type: 'saturday' },

  { day: 14, currentMonth: true, type: 'sunday' },
  { day: 15, currentMonth: true, type: 'weekday' },
  { day: 16, currentMonth: true, type: 'weekday' },
  { day: 17, currentMonth: true, type: 'weekday' },
  { day: 18, currentMonth: true, type: 'weekday' },
  { day: 19, currentMonth: true, type: 'weekday' },
  { day: 20, currentMonth: true, type: 'saturday' },

  { day: 21, currentMonth: true, type: 'sunday' },
  { day: 22, currentMonth: true, type: 'weekday' },
  { day: 23, currentMonth: true, type: 'weekday' },
  { day: 24, currentMonth: true, type: 'weekday' },
  { day: 25, currentMonth: true, type: 'weekday' },
  { day: 26, currentMonth: true, type: 'weekday' },
  { day: 27, currentMonth: true, type: 'saturday' },

  { day: 28, currentMonth: true, type: 'sunday' },
  { day: 29, currentMonth: true, type: 'weekday' },
  { day: 30, currentMonth: true, type: 'weekday' },
  { day: 1, currentMonth: false, type: 'weekday' },
  { day: 2, currentMonth: false, type: 'weekday' },
  { day: 3, currentMonth: false, type: 'weekday' },
  { day: 4, currentMonth: false, type: 'saturday' },
];

const categories: CategoryItem[] = [
  {
    id: 'side-project',
    title: '사이드 프로젝트',
    color: '#8B84F2',
  },
  {
    id: 'event',
    title: '행사 준비',
    color: '#FFDD47',
  },
  {
    id: 'certificate',
    title: '자격증 시험',
    color: '#00CEF5',
  },
];

const scheduleItems: ScheduleItem[] = [
  {
    id: 'lecture-review',
    title: '강의 복습',
    week: 0,
    row: 0,
    startColumn: 2,
    span: 1,
    backgroundColor: '#DAF4FF',
    barColor: '#00CEF5',
    textColor: '#003B48',
  },
  {
    id: 'mvp',
    title: '1차 MVP 완성',
    week: 1,
    row: 0,
    startColumn: 1,
    span: 4,
    backgroundColor: '#B9B5F7',
    barColor: '#8B84F2',
    textColor: '#31296F',
  },
  {
    id: 'plan',
    title: '계획서 작성',
    week: 1,
    row: 0,
    startColumn: 5,
    span: 1,
    backgroundColor: '#B9B5F7',
    barColor: '#8B84F2',
    textColor: '#31296F',
  },
  {
    id: 'screen',
    title: '핵심 화면 정리',
    week: 1,
    row: 1,
    startColumn: 1,
    span: 2,
    backgroundColor: '#DAD9FB',
    barColor: '#B9B5F7',
    textColor: '#31296F',
  },
  {
    id: 'calendar-connect',
    title: '캘린더 연결',
    week: 1,
    row: 1,
    startColumn: 3,
    span: 1,
    backgroundColor: '#DAD9FB',
    barColor: '#B9B5F7',
    textColor: '#31296F',
  },
  {
    id: 'academy',
    title: '학원',
    week: 1,
    row: 2,
    startColumn: 1,
    span: 1,
    backgroundColor: '#DAF4FF',
    barColor: '#00CEF5',
    textColor: '#003B48',
  },
  {
    id: 'recruit',
    title: '참여자 모집',
    week: 2,
    row: 0,
    startColumn: 0,
    span: 3,
    backgroundColor: '#FFEFAD',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    id: 'reservation',
    title: '장소 예약',
    week: 2,
    row: 0,
    startColumn: 3,
    span: 2,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    id: 'application',
    title: '참가 신청 오픈',
    week: 2,
    row: 1,
    startColumn: 0,
    span: 1,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    id: 'attendance',
    title: '참석 인원 확인',
    week: 2,
    row: 1,
    startColumn: 2,
    span: 1,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
  {
    id: 'rehearsal',
    title: '리허설',
    week: 3,
    row: 0,
    startColumn: 0,
    span: 1,
    backgroundColor: '#FFF6D5',
    barColor: '#FFDD47',
    textColor: '#241D00',
  },
];

const CELL_WIDTH = 78.214;
const WEEK_HEIGHT = 101.875;
const SCHEDULE_TOP_OFFSET = 31;
const SCHEDULE_ROW_GAP = 20;

function NavigationIcon({
  children,
  selected = false,
}: NavigationIconProps) {
  return (
    <div
      className={[
        'flex h-[27.5px] w-[27.5px] items-center justify-center rounded-token-s',
        selected
          ? 'bg-btn-primary text-text-onFill'
          : 'bg-transparent text-text-strong',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

function CalendarBackgroundGraphics() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <img
        src={calendarBgEllipse1}
        alt=""
        className="absolute left-[0px] top-[-156px] h-[653px] w-[486px] max-w-none object-contain"
      />

      <img
        src={calendarBgEllipse2}
        alt=""
        className="absolute left-[375px] top-[-156px] h-[789px] w-[788px] max-w-none object-contain"
      />

      <img
        src={calendarBgEllipse5}
        alt=""
        className="absolute left-[0px] top-[95px] h-[667.885px] w-[668.41px] max-w-none object-contain"
      />

      <img
        src={calendarBgEllipse4}
        alt=""
        className="absolute left-[375px] top-[95px] h-[667.885px] w-[668.41px] max-w-none object-contain"
      />
    </div>
  );
}

function GlobalMenuBar() {
  return (
    <nav
      aria-label="캘린더 미리보기 메뉴"
      className="flex h-[625px] w-[52.5px] flex-col justify-between border-r border-[#F5F5F5] bg-fill-inverse px-[12.5px] py-5"
    >
      <div className="flex flex-col gap-[25px]">
        <NavigationIcon>
          <SidebarOpenIcon className="h-[15px] w-[15px]" />
        </NavigationIcon>

        <NavigationIcon>
          <BellOutlineIcon className="h-[15px] w-[15px]" />
        </NavigationIcon>
      </div>

      <div className="flex flex-col gap-[25px]">
        <NavigationIcon>
          <SocialOutlineIcon className="h-[15px] w-[15px]" />
        </NavigationIcon>

        <NavigationIcon selected>
          <CalendarOutlineIcon className="h-[15px] w-[15px]" />
        </NavigationIcon>

        <NavigationIcon>
          <UserOutlineIcon className="h-[15px] w-[15px]" />
        </NavigationIcon>
      </div>

      <NavigationIcon>
        <SettingsOutlineIcon className="h-[15px] w-[15px]" />
      </NavigationIcon>
    </nav>
  );
}

function ViewSegmentControl() {
  return (
    <div className="flex h-[30px] w-[67.5px] items-center gap-[2.5px] rounded-token-s bg-btn-quaternary p-[2.5px]">
      <div className="flex h-[25px] w-[30px] items-center justify-center rounded-[5.63px] bg-fill-inverse shadow-[0_0_2.5px_rgba(23,23,23,0.1)]">
        <CardViewIcon className="h-[15px] w-[15px]" />
      </div>

      <div className="flex h-[25px] w-[30px] items-center justify-center">
        <ListViewIcon className="h-[15px] w-[15px]" />
      </div>
    </div>
  );
}

function CategoryCard({ title, color }: CategoryItem) {
  return (
    <div className="flex h-[42.5px] w-[220px] items-center justify-between rounded-token-m bg-fill-inverse py-token-m pl-token-l pr-token-m shadow-[0_0_17.5px_rgba(23,23,23,0.05)]">
      <div className="flex min-w-0 items-center gap-[7.5px]">
        <span
          aria-hidden="true"
          className="h-[25px] w-[5px] shrink-0 rounded-token-xs"
          style={{ backgroundColor: color }}
        />

        <span className="truncate text-[12.5px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
          {title}
        </span>
      </div>

      <div className="flex items-center">
        <div className="flex h-[27.5px] w-[27.5px] items-center justify-center">
          <ChevronDownIcon className="h-[15px] w-[15px] text-text-secondary" />
        </div>

        <div className="flex h-[27.5px] w-[27.5px] items-center justify-center">
          <EyeOnIcon className="h-[15px] w-[15px] text-text-secondary" />
        </div>
      </div>
    </div>
  );
}

function CalendarSidebar() {
  return (
    <aside className="flex h-[625px] w-[297.5px] overflow-hidden rounded-[12.5px] bg-fill-inverse shadow-[0_0_17.5px_rgba(23,23,23,0.05)]">
      <GlobalMenuBar />

      <div className="h-[625px] w-[245px] bg-fill-inverse">
        <header className="flex h-[62.5px] w-full items-center justify-between pb-[12.5px] pl-[12.5px] pr-[12.5px] pt-5">
          <h3 className="text-[20px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
            6월
          </h3>

          <ViewSegmentControl />
        </header>

        <div className="flex h-[562.5px] flex-col gap-[12.5px] px-[12.5px] pb-[7.5px] pt-[2.5px]">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}

          <div className="flex h-[50px] w-full items-start justify-center pt-token-m">
            <button
              type="button"
              tabIndex={-1}
              className="h-[30px] w-[219.375px] rounded-token-s bg-btn-primary text-[10px] font-medium leading-[150%] tracking-[-0.01em] text-text-onFill"
            >
              추가하기
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DateNavigation() {
  return (
    <div className="flex h-[27.5px] items-center gap-[5px]">
      <button
        type="button"
        tabIndex={-1}
        aria-label="이전 달"
        className="flex h-[27.5px] w-[27.5px] items-center justify-center rounded-full bg-btn-quaternary"
      >
        <ChevronLeftIcon className="h-[15px] w-[15px] text-text-secondary" />
      </button>

      <button
        type="button"
        tabIndex={-1}
        className="flex h-[27.5px] min-w-[38px] items-center justify-center rounded-full bg-btn-quaternary px-[10px] text-[10px] font-semibold leading-[150%] tracking-[-0.01em] text-text-secondary"
      >
        오늘
      </button>

      <button
        type="button"
        tabIndex={-1}
        aria-label="다음 달"
        className="flex h-[27.5px] w-[27.5px] items-center justify-center rounded-full bg-btn-quaternary"
      >
        <ChevronRightIcon className="h-[15px] w-[15px] text-text-secondary" />
      </button>
    </div>
  );
}

function CalendarHeader() {
  return (
    <header className="flex h-[27.5px] items-center gap-[5px]">
      <h3 className="text-[17.5px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
        2026년 6월
      </h3>

      <DateNavigation />
    </header>
  );
}

function WeekdayHeader() {
  return (
    <div className="grid h-[28.125px] w-[547.5px] grid-cols-7">
      {weekdays.map((weekday, index) => (
        <div
          key={weekday}
          className={[
            'flex h-[28.125px] items-start px-[5px] pt-[5px]',
            index === 0
              ? 'text-fill-danger'
              : index === 6
                ? 'text-fill-info'
                : 'text-text-secondary',
          ].join(' ')}
        >
          <span className="text-[11.25px] font-medium leading-[150%] tracking-[-0.01em]">
            {weekday}
          </span>
        </div>
      ))}
    </div>
  );
}

function getDateClassName(date: CalendarDate) {
  if (date.type === 'today') {
    return 'bg-[#171717] text-white';
  }

  if (!date.currentMonth) {
    if (date.type === 'sunday') return 'text-[#FEA68F]';
    if (date.type === 'saturday') return 'text-[#8299FF]';

    return 'text-text-teritary';
  }

  if (date.type === 'sunday') return 'text-fill-danger';
  if (date.type === 'saturday') return 'text-fill-info';

  return 'text-text-strong';
}

function MonthDateCell({ date }: { date: CalendarDate }) {
  const isToday = date.type === 'today';

  return (
    <div className="relative h-[101.875px] w-[78.214px]">
      <span
        className={[
          'absolute left-[5px] top-[5px] text-[11.25px] font-semibold leading-[150%] tracking-[-0.01em]',
          isToday
            ? 'flex h-5 w-5 items-center justify-center rounded-full'
            : '',
          getDateClassName(date),
        ].join(' ')}
      >
        {date.day}
      </span>
    </div>
  );
}

function ScheduleBar({ schedule }: { schedule: ScheduleItem }) {
  const left = schedule.startColumn * CELL_WIDTH;

  const top =
    schedule.week * WEEK_HEIGHT +
    SCHEDULE_TOP_OFFSET +
    schedule.row * SCHEDULE_ROW_GAP;

  const width = schedule.span * CELL_WIDTH - 4;

  return (
    <div
      className="absolute z-10 flex h-4 items-center overflow-hidden rounded-token-xs"
      style={{
        left,
        top,
        width,
        backgroundColor: schedule.backgroundColor,
        color: schedule.textColor,
      }}
    >
      <span
        aria-hidden="true"
        className="h-[14.375px] w-[2.5px] shrink-0 rounded-token-xs"
        style={{ backgroundColor: schedule.barColor }}
      />

      <span className="truncate px-[6.25px] text-[8.13px] font-medium leading-[130%] tracking-[-0.01em]">
        {schedule.title}
      </span>
    </div>
  );
}

function MonthGrid() {
  return (
    <div className="relative h-[509.375px] w-[547.5px] overflow-hidden">
      <div className="grid h-full w-full grid-cols-7 grid-rows-5">
        {calendarDates.map((date, index) => (
          <MonthDateCell
            key={`${date.currentMonth ? 'current' : 'outside'}-${index}-${date.day}`}
            date={date}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {scheduleItems.map((schedule) => (
          <ScheduleBar key={schedule.id} schedule={schedule} />
        ))}
      </div>
    </div>
  );
}

function CalendarBoard() {
  return (
    <section className="h-[625px] w-[577.5px] overflow-hidden rounded-[12.5px] bg-fill-inverse shadow-[0_0_17.5px_rgba(23,23,23,0.05)]">
      <div className="absolute left-[15px] top-[20px] flex h-[585px] w-[547.5px] flex-col gap-[12.5px]">
        <CalendarHeader />

        <div className="flex flex-col">
          <WeekdayHeader />
          <MonthGrid />
        </div>
      </div>
    </section>
  );
}

export function LandingCalendarPreview({
  className,
  style,
}: LandingCalendarPreviewProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none absolute left-[200px] top-[734px] z-10 h-[640px] w-[1040px] overflow-hidden rounded-token-l bg-white shadow-[0_0_28px_rgba(23,23,23,0.05)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <CalendarBackgroundGraphics />

      <div className="absolute left-[70px] top-[64px] h-[640px] w-[900px]">
        <div className="absolute left-[7.5px] top-[7.5px]">
          <CalendarSidebar />
        </div>

        <div className="absolute left-[315px] top-[7.5px]">
          <CalendarBoard />
        </div>
      </div>
    </div>
  );
}