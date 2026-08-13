/* ==========================================================================
 *  월말 리포트 — 서버 응답 명세  (R003 ~ R007)
 *  이 파일 하나만 백엔드 개발자에게 전달하면 됩니다.
 * --------------------------------------------------------------------------
 *  Endpoint : GET /api/v1/reports
 *
 *  리포트 5단계 전체가 이 응답 하나로 그려집니다.
 *  단계를 넘길 때마다 다시 요청하지 않습니다. (진입 시 1회만 호출)
 *
 *  ▼ 이런 형태로 보내주세요 (실제 응답 예시)
 *
 *  {
 *    "reportYear": 2026,
 *    "reportMonth": 6,
 *
 *    // --- R003 이번 달 조약돌 ---
 *    "monthlyPebbleCount": 64,
 *    "recentMonths": [
 *      { "year": 2026, "month": 4, "count": 46 },
 *      { "year": 2026, "month": 5, "count": 36 },
 *      { "year": 2026, "month": 6, "count": 64 }
 *    ],
 *    "totalPebbleCount": 256,
 *    "recordStartDate": "2025-12-24",
 *    "recordEndDate": "2026-06-30",
 *
 *    // --- R004 가장 바빴던 카테고리 ---
 *    "busiestCategory": {
 *      "name": "학교",
 *      "colorHex": "#3B82F6",
 *      "milestoneCount": 5,
 *      "taskCount": 23,
 *      "milestones": [
 *        { "id": "m1", "name": "중간고사", "featured": true,  "remainingTaskCount": 6,
 *          "tasks": [ { "id": "t1", "name": "태스크 이름", "completed": true },
 *                     { "id": "t2", "name": "태스크 이름 이름", "completed": true } ] },
 *        { "id": "m2", "name": "동아리",   "featured": false, "remainingTaskCount": 0, "tasks": [] },
 *        { "id": "m3", "name": "팀플",     "featured": false, "remainingTaskCount": 0, "tasks": [] },
 *        { "id": "m4", "name": "축제",     "featured": true,  "remainingTaskCount": 4,
 *          "tasks": [ { "id": "t3", "name": "태스크 이름", "completed": true },
 *                     { "id": "t4", "name": "태스크 이름 이름", "completed": false } ] },
 *        { "id": "m5", "name": "기말고사", "featured": true,  "remainingTaskCount": 7,
 *          "tasks": [ { "id": "t5", "name": "태스크 이름", "completed": true },
 *                     { "id": "t6", "name": "태스크 이름 이름", "completed": true } ] }
 *      ]
 *    },
 *
 *    // --- R005 가장 바빴던 하루 ---
 *    "busiestDay": {
 *      "date": "2026-06-08",
 *      "schedules": [
 *        { "id": "s1", "kind": "task", "breadcrumb": "EXPO - 계획서 제출",
 *          "name": "EXPO 계획서 작성하기", "completed": false, "colorHex": null },
 *        { "id": "s2", "kind": "milestone", "breadcrumb": "창업 공모전",
 *          "name": "백엔드 프로젝트", "completed": true, "colorHex": "#F26B6B" },
 *        { "id": "s3", "kind": "task", "breadcrumb": "창업 공모전 - 백엔드 프로젝트",
 *          "name": "MVP 페이지 구현", "completed": true, "colorHex": null }
 *      ]
 *    },
 *
 *    // --- R006 함께한 친구들 ---
 *    "sharedFriends": {
 *      "sharedCategoryCount": 2,
 *      "friends": [
 *        { "id": "u1", "categoryName": "창업 공모전",      "nickname": "담검이", "avatarUrl": null },
 *        { "id": "u2", "categoryName": "창업 공모전",      "nickname": "조로",   "avatarUrl": "https://cdn.../u2.png" },
 *        { "id": "u3", "categoryName": "다른 공유 카테고리", "nickname": "돼병이", "avatarUrl": "https://cdn.../u3.png" }
 *      ]
 *    }
 *  }
 *
 *  ▼ 약속 사항
 *  1. 모든 날짜는 "YYYY-MM-DD" 문자열. 타임존/시각 정보는 붙이지 말아주세요.
 *  2. month 는 1~12 정수. 문자열("06")이 아니라 숫자 6 으로 주세요.
 *  3. recentMonths 는 항상 정확히 3개, 과거 → 현재 순으로 정렬해서 주세요.
 *     클라이언트에서 정렬하지 않습니다. 기록 없는 달도 빼지 말고 count: 0.
 *  4. recentMonths 의 마지막 원소는 reportYear/reportMonth 와 같은 달이어야 하고,
 *     그 count 는 monthlyPebbleCount 와 같아야 합니다.
 *  5. colorHex 는 "#RRGGBB" 6자리. 3자리 축약(#F00)이나 색 이름("red")은 안 됩니다.
 *  6. 개수 필드(count, milestoneCount, taskCount, remainingTaskCount,
 *     sharedCategoryCount)는 0 이상의 정수.
 *
 *  ▼ R004 milestones 규칙
 *  - milestones 는 상단 타임라인에 순서대로 전부 표시됩니다. (디자인 기준 5개)
 *  - featured: true 인 것만 하단에 태스크 목록 카드로 펼쳐집니다. 최대 3개까지
 *    표시되며, 4개 이상 보내시면 앞에서 3개만 씁니다.
 *  - tasks 는 카드에 직접 보이는 것만(디자인상 2개) 주시고, 나머지 개수는
 *    remainingTaskCount 로 주세요. 화면에는 "+ 6개" 버튼으로 표시됩니다.
 *  - featured: false 인 항목의 tasks 는 빈 배열로 주셔도 됩니다.
 *
 *  ▼ R005 규칙
 *  - kind 는 "milestone" 또는 "task" 두 값만. 그 외 값은 "task" 로 처리됩니다.
 *  - colorHex 는 kind: "milestone" 일 때만 쓰이고, task 는 null 로 주세요.
 *  - breadcrumb 은 상단 회색 경로 텍스트. 서버에서 완성된 문자열로 주세요.
 *    클라이언트가 카테고리명과 마일스톤명을 조합하지 않습니다.
 *  - 요일("월요일")과 일정 개수("총 3개의 일정")는 클라이언트가 계산합니다.
 *    별도 필드로 보내지 마세요. (서버 값과 어긋날 여지를 없애기 위함)
 *
 *  ▼ 값이 없을 때 — 중요
 *  "기록이 0건인 정상 응답"과 "데이터를 못 만든 상태"는 다르게 처리됩니다.
 *
 *  - 기록이 0건이면 → busiestCategory: null, busiestDay: null,
 *    sharedFriends: { sharedCategoryCount: 0, friends: [] } 처럼 명시해주세요.
 *    화면에는 "이번 달 기록이 없어요" 안내가 조용히 뜹니다.
 *
 *  - 필드를 아예 누락시키거나 타입이 틀리면 → 클라이언트가 기본값으로 채우고
 *    "불러오지 못했어요" 경고 문구를 띄웁니다. 정상 상황에서 이게 뜨면 안 됩니다.
 *
 *  요청이 통째로 실패해도 화면은 깨지지 않습니다. 현재 연월 + 0 으로 그려집니다.
 * ========================================================================== */

/* ------------------------------- R003 ------------------------------- */

/** 최근 3개월 차트의 한 점 */
export interface RecentMonthPebble {
  /** 연도 — 예: 2026 */
  year: number;
  /** 월 (1~12 정수) — 예: 4 */
  month: number;
  /** 해당 월에 쌓은 조약돌 개수 — 예: 46 */
  count: number;
}

/* ------------------------------- R004 ------------------------------- */

/** 마일스톤에 달린 태스크 한 줄 */
export interface ReportTask {
  id: string;
  /** 태스크 이름 */
  name: string;
  /** 완료 여부 — true 면 체크(✓), false 면 엑스(✕) 아이콘 */
  completed: boolean;
}

/** 카테고리 안의 마일스톤 하나 */
export interface ReportMilestone {
  id: string;
  /** 마일스톤 이름 — 타임라인 라벨 및 카드 제목 */
  name: string;
  /** true 면 타임라인에서 강조되고 하단 태스크 카드로 펼쳐짐 (최대 3개) */
  featured: boolean;
  /** 카드에 직접 표시할 태스크 (디자인상 2개) */
  tasks: ReportTask[];
  /** 카드에 안 보이는 나머지 태스크 개수 — "+ 6개" 버튼 */
  remainingTaskCount: number;
}

/** 이번 달 가장 바빴던 카테고리 */
export interface BusiestCategory {
  /** 카테고리 이름 — 예: "학교" */
  name: string;
  /** 카테고리 색 "#RRGGBB" — 이름 왼쪽 세로 바 색 */
  colorHex: string;
  /** 등록한 마일스톤 수 — 좌측 작은 카드 "5" */
  milestoneCount: number;
  /** 등록한 태스크 수 — 좌측 작은 카드 "23" */
  taskCount: number;
  /** 타임라인 순서대로. 과거 → 미래 */
  milestones: ReportMilestone[];
}

/* ------------------------------- R005 ------------------------------- */

/** 일정 종류 */
export type ScheduleKind = 'milestone' | 'task';

/** 가장 바빴던 하루의 일정 한 줄 */
export interface DaySchedule {
  id: string;
  /** "milestone" 이면 이름 왼쪽에 색 바가 붙습니다 */
  kind: ScheduleKind;
  /** 상단 회색 경로 텍스트 — 예: "창업 공모전 - 백엔드 프로젝트" */
  breadcrumb: string;
  /** 일정 이름 */
  name: string;
  /** 완료 여부 — true 면 체크(✓), false 면 엑스(✕) */
  completed: boolean;
  /** kind === 'milestone' 일 때의 색 바 색상. task 면 null */
  colorHex: string | null;
}

/** 저번 달 가장 바빴던 하루 */
export interface BusiestDay {
  /** "YYYY-MM-DD" — 화면 "6월 8일" 및 요일 계산의 기준 */
  date: string;
  /** 그날의 일정 목록. 개수는 이 배열 길이로 표시됩니다 */
  schedules: DaySchedule[];
}

/* ------------------------------- R006 ------------------------------- */

/** 공유 카테고리를 함께한 친구 */
export interface SharedFriend {
  id: string;
  /** 어떤 공유 카테고리에서 만났는지 — 상단 회색 라벨 */
  categoryName: string;
  /** 친구 닉네임 */
  nickname: string;
  /**
   * 프로필 이미지 URL. 없으면 null (기본 아바타로 대체)
   *
   * 주의: R007 "이미지로 저장하기"에서 이 이미지를 캔버스에 그립니다.
   * CDN 응답에 Access-Control-Allow-Origin 헤더가 없으면 저장 시 이미지가
   * 비어 보입니다. CORS 허용을 꼭 확인해주세요.
   */
  avatarUrl: string | null;
}

/** R006 전체 */
export interface SharedFriends {
  /** 공유 카테고리 개수 — "공유 카테고리 2개" */
  sharedCategoryCount: number;
  /**
   * 친구 목록.
   * API는 겹치는 공유 카테고리 수가 많은 순서로 정렬하고, 같은 경우에는
   * 먼저 생성된 공유 카테고리의 수락을 먼저 누른 순서로 반환해야 합니다.
   * 프론트엔드는 전달받은 순서를 그대로 사용합니다.
   */
  friends: SharedFriend[];
}

/* ----------------------------- 응답 전체 ----------------------------- */

/** GET /api/v1/reports/monthly 응답 본문 */
export interface MonthlyReportResponse {
  /** 서버 리포트 ID — 합본 이미지 URL 저장 시 사용 */
  reportId: number | null;
  /** 서버에 이미 저장된 합본 이미지 URL */
  reportImageUrl: string | null;
  /** 리포트 대상 연도 */
  reportYear: number;
  /** 리포트 대상 월 (1~12 정수) */
  reportMonth: number;

  /** R003 이번 달 조약돌 개수 — 대형 숫자 "64" */
  monthlyPebbleCount: number;
  /** R003 최근 3개월 추이 — 과거→현재 순, 항상 3개 */
  recentMonths: RecentMonthPebble[];
  /** R003 누적 조약돌 개수 — "256" */
  totalPebbleCount: number;
  /** R003 기록 시작일 "YYYY-MM-DD" */
  recordStartDate: string;
  /** R003 기록 종료일 "YYYY-MM-DD" */
  recordEndDate: string;

  /** R004 — 해당 없으면 null */
  busiestCategory: BusiestCategory | null;
  /** R005 — 해당 없으면 null */
  busiestDay: BusiestDay | null;
  /** R006 — 친구가 없으면 friends: [] */
  sharedFriends: SharedFriends;
}

/**
 * 화면이 실제로 받는 타입.
 *
 * 네트워크 실패(null), 응답 일부 누락, 잘못된 타입 모두 여기로 들어옵니다.
 * normalizeMonthlyReport() 를 거쳐 완전한 MonthlyReportResponse 로 바뀝니다.
 */
export type MonthlyReportInput = unknown;
