import type { BusiestDay, DaySchedule } from '../types/report';
import { formatMonthDay, formatWeekday } from '../utils/formatDate';
import { EmptyState } from '../components/EmptyState';
import checkIcon from '@/assets/report/Ic/Check.svg';
import closeIcon from '@/assets/report/Ic/Close.svg';

interface BusiestDaySectionProps {
  /** 서버 값: busiestDay. null 이면 빈 상태 */
  day: BusiestDay | null;
  darkTheme?: boolean;
}

const MAX_VISIBLE_SCHEDULES = 3;

/**
 * 개별 화면과 합본 이미지에서 같은 일정이 보이도록 날짜와 일정 ID로
 * 안정적인 무작위 순서를 만듭니다. 렌더링 중 Math.random()을 호출하지 않습니다.
 */
function createStableRandomValue(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickSchedules(schedules: DaySchedule[], date: string) {
  if (schedules.length < MAX_VISIBLE_SCHEDULES) {
    return schedules;
  }

  return [...schedules]
    .sort(
      (first, second) =>
        createStableRandomValue(`${date}:${first.id}`) -
        createStableRandomValue(`${date}:${second.id}`),
    )
    .slice(0, MAX_VISIBLE_SCHEDULES);
}

/** 일정 한 줄 */
function ScheduleRow({
  schedule,
  darkTheme = false,
}: {
  schedule: DaySchedule;
  darkTheme?: boolean;
}) {
  // API 색상이 없는 목 데이터도 피그마의 상태색으로 안전하게 표시합니다.
  const barColor =
    schedule.colorHex ?? (schedule.completed ? '#FFECED' : '#DAF4FF');

  return (
    <li
      className={`flex min-h-[60px] flex-col justify-center gap-[4px] overflow-hidden rounded-[20px] bg-white px-[20px] py-[12px] ${
        darkTheme ? 'dark:bg-fill-inverse' : ''
      }`}
    >
      {/* 경로 텍스트 — 서버 값(breadcrumb). 서버가 완성해서 보냅니다 */}
      {schedule.breadcrumb && (
        <p
          className={`truncate text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3] ${
            darkTheme ? 'dark:text-text-teritary' : ''
          }`}
        >
          {schedule.breadcrumb}
        </p>
      )}

      <div className="flex items-center justify-between gap-[12px]">
        <span className="flex min-w-0 items-center gap-[8px]">
          {/* 일정 계층 색상 — 서버 색상을 우선 사용합니다 */}
          <span
            className="h-[32px] w-[8px] shrink-0 rounded-[4px]"
            style={{ backgroundColor: barColor }}
            aria-hidden="true"
          />
          {/* 일정 이름 — 서버 값(name) */}
          <span
            className={`truncate text-[18px] font-medium leading-[150%] tracking-[-0.18px] text-[#404040] ${
              darkTheme ? 'dark:text-text-primary' : ''
            }`}
          >
            {schedule.name}
          </span>
        </span>

        {/* 완료 여부 — 서버 값(completed) */}
        <img
          src={schedule.completed ? checkIcon : closeIcon}
          alt=""
          className={`h-[24px] w-[24px] shrink-0 ${
            darkTheme ? 'dark:hidden' : ''
          }`}
        />
        {darkTheme ? (
          <span
            className={`hidden h-[24px] w-[24px] shrink-0 dark:block ${
              schedule.completed ? 'bg-btn-primary' : 'bg-fill-secondary'
            }`}
            style={{
              WebkitMaskImage: `url(${
                schedule.completed ? checkIcon : closeIcon
              })`,
              WebkitMaskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: '24px 24px',
              maskImage: `url(${schedule.completed ? checkIcon : closeIcon})`,
              maskPosition: 'center',
              maskRepeat: 'no-repeat',
              maskSize: '24px 24px',
            }}
            aria-hidden="true"
          />
        ) : null}
        <span className="sr-only">
          {schedule.completed ? '완료' : '미완료'}
        </span>
      </div>
    </li>
  );
}

/** R005 — 저번 달 가장 바빴던 하루 */
export function BusiestDaySection({
  day,
  darkTheme = false,
}: BusiestDaySectionProps) {
  if (!day) {
    return (
      <EmptyState
        message="저번 달에는 기록한 일정이 없어요."
        darkTheme={darkTheme}
      />
    );
  }

  const { date, schedules } = day;
  const visibleSchedules = pickSchedules(schedules, date);
  const hiddenScheduleCount = schedules.length - visibleSchedules.length;

  return (
    <div className="flex h-full w-full flex-col gap-[20px]">
      <div className="flex flex-col gap-[8px]">
        <p
          className={`text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3] ${
            darkTheme ? 'dark:text-text-teritary' : ''
          }`}
        >
          저번 달 가장 바빴던 하루
        </p>

        <h2
          className={`flex items-baseline text-[#404040] ${
            darkTheme ? 'dark:text-text-primary' : ''
          }`}
        >
          {/* 날짜 — 서버 값(busiestDay.date) */}
          <strong className="text-[40px] font-bold leading-[120%] tracking-[-0.4px]">
            {formatMonthDay(date)}
          </strong>
          <span className="text-[28px] font-medium leading-[130%] tracking-[-0.28px]">
            에 일정이 가장 많았어요
          </span>
        </h2>
      </div>

      <div className="flex h-[40px] gap-[20px]">
        {/* 요일 — 날짜에서 계산 (서버가 보내지 않습니다) */}
        <span
          className={`flex flex-1 items-center rounded-[999px] bg-[#FAFAFA] px-[20px] text-[16px] font-semibold leading-[150%] tracking-[-0.16px] text-[#A3A3A3] ${
            darkTheme
              ? 'dark:bg-[rgba(23,23,23,0.7)] dark:text-text-teritary'
              : ''
          }`}
        >
          {formatWeekday(date)}
        </span>
        {/* 일정 개수 — schedules 배열 길이 */}
        <span
          className={`flex flex-1 items-center rounded-[999px] bg-[#FAFAFA] px-[20px] text-[16px] font-semibold leading-[150%] tracking-[-0.16px] text-[#A3A3A3] ${
            darkTheme
              ? 'dark:bg-[rgba(23,23,23,0.7)] dark:text-text-teritary'
              : ''
          }`}
        >
          총 {schedules.length}개의 일정
        </span>
      </div>

      {schedules.length === 0 ? (
        <EmptyState
          className="flex-1"
          message="이 날 기록된 일정이 없어요."
          darkTheme={darkTheme}
        />
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-[12px]">
          {visibleSchedules.map((schedule) => (
            <ScheduleRow
              key={schedule.id}
              schedule={schedule}
              darkTheme={darkTheme}
            />
          ))}

          {hiddenScheduleCount > 0 ? (
            <li
              className={`flex h-[40px] shrink-0 items-center justify-center rounded-[999px] px-[12px] py-[8px] text-center text-[16px] font-semibold leading-[150%] tracking-[-0.16px] text-[#A3A3A3] ${
                darkTheme ? 'dark:text-text-teritary' : ''
              }`}
            >
              + {hiddenScheduleCount.toLocaleString('ko-KR')}개의 일정
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
