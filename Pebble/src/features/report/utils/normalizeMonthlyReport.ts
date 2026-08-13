import type {
  BusiestCategory,
  BusiestDay,
  DaySchedule,
  MonthlyReportInput,
  MonthlyReportResponse,
  RecentMonthPebble,
  ReportMilestone,
  ReportTask,
  ScheduleKind,
  SharedFriend,
  SharedFriends,
} from '../types/report';
import {
  isCount,
  isHexColor,
  isIsoDate,
  isMonth,
  isNonEmptyString,
  isPlainObject,
  isYear,
  pad2,
  toBooleanOr,
  toCountOr,
  toHexOr,
  toIsoDate,
  toStringOr,
} from './validators';

/** 카테고리/마일스톤 색을 못 받았을 때 쓰는 중립 회색 */
const DEFAULT_ACCENT = '#9CA3AF';

/** 정규화 결과 */
export interface NormalizedMonthlyReport {
  /** 화면에 그대로 넣을 수 있는 완전한 데이터 */
  data: MonthlyReportResponse;
  /**
   * 한 필드라도 "누락/타입 오류" 때문에 기본값으로 채웠는지.
   * true 면 화면 상단에 "불러오지 못했어요" 안내가 뜹니다.
   *
   * 서버가 의도적으로 null 을 보낸 경우(기록 0건)는 여기 포함되지 않습니다.
   */
  usedFallback: boolean;
  /** 기본값으로 채운 필드 이름들 (개발 중 콘솔 확인용) */
  fallbackFields: string[];
}

/* -------------------------------------------------------------------------- */

/**
 * (year, month) 로 끝나는 최근 3개월을 count 0 으로 만듭니다.
 * 예: (2026, 1) -> 2025-11, 2025-12, 2026-01
 * Date 생성자가 월 언더플로를 연도로 넘겨줍니다.
 */
const buildEmptyRecentMonths = (
  year: number,
  month: number,
): RecentMonthPebble[] =>
  [2, 1, 0].map((back) => {
    const d = new Date(year, month - 1 - back, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1, count: 0 };
  });

const isRecentMonth = (v: unknown): v is RecentMonthPebble =>
  isPlainObject(v) && isYear(v.year) && isMonth(v.month) && isCount(v.count);

/* ------------------------------ R004 정규화 ------------------------------ */

const normalizeTask = (raw: unknown, index: number): ReportTask | null => {
  if (!isPlainObject(raw)) return null;
  if (!isNonEmptyString(raw.name)) return null;
  return {
    id: toStringOr(raw.id, `task-${index}`),
    name: raw.name,
    completed: toBooleanOr(raw.completed, false),
  };
};

const normalizeMilestone = (
  raw: unknown,
  index: number,
): ReportMilestone | null => {
  if (!isPlainObject(raw)) return null;
  if (!isNonEmptyString(raw.name)) return null;

  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks
        .map((t, i) => normalizeTask(t, i))
        .filter((t): t is ReportTask => t !== null)
    : [];

  return {
    id: toStringOr(raw.id, `milestone-${index}`),
    name: raw.name,
    featured: toBooleanOr(raw.featured, false),
    tasks,
    remainingTaskCount: toCountOr(raw.remainingTaskCount, 0),
  };
};

const normalizeBusiestCategory = (raw: unknown): BusiestCategory | null => {
  if (!isPlainObject(raw)) return null;
  if (!isNonEmptyString(raw.name)) return null;

  const milestones = Array.isArray(raw.milestones)
    ? raw.milestones
        .map((m, i) => normalizeMilestone(m, i))
        .filter((m): m is ReportMilestone => m !== null)
    : [];

  return {
    name: raw.name,
    colorHex: toHexOr(raw.colorHex, DEFAULT_ACCENT),
    milestoneCount: toCountOr(raw.milestoneCount, milestones.length),
    taskCount: toCountOr(raw.taskCount, 0),
    milestones,
  };
};

/* ------------------------------ R005 정규화 ------------------------------ */

const normalizeSchedule = (raw: unknown, index: number): DaySchedule | null => {
  if (!isPlainObject(raw)) return null;
  if (!isNonEmptyString(raw.name)) return null;

  // 명세에 없는 값이 오면 task 로 처리합니다 (색 바 없이 안전하게 렌더링됨)
  const kind: ScheduleKind = raw.kind === 'milestone' ? 'milestone' : 'task';

  return {
    id: toStringOr(raw.id, `schedule-${index}`),
    kind,
    breadcrumb: toStringOr(raw.breadcrumb, ''),
    name: raw.name,
    completed: toBooleanOr(raw.completed, false),
    colorHex: isHexColor(raw.colorHex)
      ? raw.colorHex
      : kind === 'milestone'
        ? DEFAULT_ACCENT
        : null,
  };
};

const normalizeBusiestDay = (raw: unknown): BusiestDay | null => {
  if (!isPlainObject(raw)) return null;
  if (!isIsoDate(raw.date)) return null;

  const schedules = Array.isArray(raw.schedules)
    ? raw.schedules
        .map((s, i) => normalizeSchedule(s, i))
        .filter((s): s is DaySchedule => s !== null)
    : [];

  return { date: raw.date, schedules };
};

/* ------------------------------ R006 정규화 ------------------------------ */

const normalizeFriend = (raw: unknown, index: number): SharedFriend | null => {
  if (!isPlainObject(raw)) return null;
  if (!isNonEmptyString(raw.nickname)) return null;

  return {
    id: toStringOr(raw.id, `friend-${index}`),
    categoryName: toStringOr(raw.categoryName, ''),
    nickname: raw.nickname,
    avatarUrl: isNonEmptyString(raw.avatarUrl) ? raw.avatarUrl : null,
  };
};

const normalizeSharedFriends = (raw: unknown): SharedFriends => {
  if (!isPlainObject(raw)) return { sharedCategoryCount: 0, friends: [] };

  const friends = Array.isArray(raw.friends)
    ? raw.friends
        .map((f, i) => normalizeFriend(f, i))
        .filter((f): f is SharedFriend => f !== null)
    : [];

  return {
    sharedCategoryCount: toCountOr(raw.sharedCategoryCount, 0),
    friends,
  };
};

/* ------------------------------- 정규화 본체 ------------------------------ */

/**
 * 서버 응답을 화면이 바로 쓸 수 있는 형태로 바꿉니다.
 *
 * - 요청 실패(null/undefined)  → 전부 기본값, usedFallback: true
 * - 일부 필드만 누락/타입 오류 → 정상인 값은 살리고 빈 곳만 채움
 * - 서버가 명시적으로 보낸 null → 기본값 처리하되 경고는 띄우지 않음
 *
 * 실제 없는 수치를 그럴듯하게 지어내지 않습니다.
 * 0 이나 빈 배열을 채우고 usedFallback 을 올려서 화면이 안내하게 합니다.
 *
 * @param input  서버 응답(또는 null)
 * @param now    기준 시각. 테스트에서 고정 날짜를 주입할 수 있게 열어둡니다.
 */
export function normalizeMonthlyReport(
  input: MonthlyReportInput,
  now: Date = new Date(),
): NormalizedMonthlyReport {
  const raw: Record<string, unknown> = isPlainObject(input) ? input : {};
  const fallbackFields: string[] = [];

  // 응답 자체가 없으면(요청 실패) 개별 필드를 세지 않고 통째로 표시합니다
  if (!isPlainObject(input)) fallbackFields.push('(응답 없음)');

  const mark = <T,>(field: string, value: T): T => {
    fallbackFields.push(field);
    return value;
  };

  /* 연월 — 없으면 현재 연월 */
  const reportYear = isYear(raw.reportYear)
    ? raw.reportYear
    : mark('reportYear', now.getFullYear());

  const reportMonth = isMonth(raw.reportMonth)
    ? raw.reportMonth
    : mark('reportMonth', now.getMonth() + 1);

  const reportId =
    isCount(raw.reportId) && raw.reportId > 0 ? raw.reportId : null;
  const reportImageUrl = isNonEmptyString(raw.reportImageUrl)
    ? raw.reportImageUrl
    : null;

  /* 최근 3개월 — 유효한 항목만 추려 뒤에서 3개. 모자라면 앞을 0으로 채움 */
  const rawMonths = Array.isArray(raw.recentMonths)
    ? raw.recentMonths.filter(isRecentMonth)
    : [];

  let recentMonths: RecentMonthPebble[];
  if (rawMonths.length >= 3) {
    recentMonths = rawMonths.slice(-3);
  } else if (rawMonths.length === 0) {
    recentMonths = mark(
      'recentMonths',
      buildEmptyRecentMonths(reportYear, reportMonth),
    );
  } else {
    /*
     * 일부만 온 경우: 온 값은 살리고 앞쪽만 빈 달로 메웁니다.
     *
     * 메울 달은 reportMonth 가 아니라 "받은 첫 달"을 기준으로 거슬러 올라갑니다.
     * reportMonth 까지 함께 잘못 온 상황에서 기준을 reportMonth 로 잡으면
     * 5월/5월/6월 처럼 같은 달이 중복될 수 있기 때문입니다.
     */
    const first = rawMonths[0];
    const padding: RecentMonthPebble[] = [];
    for (let back = 3 - rawMonths.length; back >= 1; back -= 1) {
      const d = new Date(first.year, first.month - 1 - back, 1);
      padding.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        count: 0,
      });
    }
    recentMonths = mark('recentMonths(partial)', [...padding, ...rawMonths]);
  }

  /* 이번 달 개수 — 없으면 recentMonths 마지막 값에서 끌어씀 */
  const lastMonthCount = recentMonths[recentMonths.length - 1]?.count ?? 0;
  const monthlyPebbleCount = isCount(raw.monthlyPebbleCount)
    ? raw.monthlyPebbleCount
    : mark('monthlyPebbleCount', lastMonthCount);

  const totalPebbleCount = isCount(raw.totalPebbleCount)
    ? raw.totalPebbleCount
    : mark('totalPebbleCount', 0);

  /* 기록 기간 — 없으면 리포트 월 1일 ~ 오늘 */
  const recordStartDate = isIsoDate(raw.recordStartDate)
    ? raw.recordStartDate
    : mark('recordStartDate', `${reportYear}-${pad2(reportMonth)}-01`);

  const recordEndDate = isIsoDate(raw.recordEndDate)
    ? raw.recordEndDate
    : mark('recordEndDate', toIsoDate(now));

  /* ---- 섹션들 ----
   * null 은 "기록 0건"이라는 정상 응답으로 봅니다 → 경고 없이 빈 상태 표시.
   * undefined 나 타입 오류만 fallback 으로 셉니다.
   */
  const busiestCategory =
    raw.busiestCategory === null
      ? null
      : normalizeBusiestCategory(raw.busiestCategory) ??
        mark('busiestCategory', null);

  const busiestDay =
    raw.busiestDay === null
      ? null
      : normalizeBusiestDay(raw.busiestDay) ?? mark('busiestDay', null);

  const sharedFriends =
    raw.sharedFriends === null
      ? { sharedCategoryCount: 0, friends: [] }
      : isPlainObject(raw.sharedFriends)
        ? normalizeSharedFriends(raw.sharedFriends)
        : mark('sharedFriends', { sharedCategoryCount: 0, friends: [] });

  return {
    data: {
      reportId,
      reportImageUrl,
      reportYear,
      reportMonth,
      monthlyPebbleCount,
      recentMonths,
      totalPebbleCount,
      recordStartDate,
      recordEndDate,
      busiestCategory,
      busiestDay,
      sharedFriends,
    },
    usedFallback: fallbackFields.length > 0,
    fallbackFields,
  };
}
