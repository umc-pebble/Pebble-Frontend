const WEEKDAY_LABELS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
] as const;

/**
 * "YYYY-MM-DD" 를 로컬 Date 로 파싱합니다.
 *
 * new Date('2026-06-08') 는 UTC 자정으로 해석돼 한국 시간대에서 하루가
 * 밀릴 수 있습니다. 그래서 직접 잘라서 로컬 Date 를 만듭니다.
 */
function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * formatKoreanDate('2025-12-24') -> '2025년 12월 24일'
 * 월/일 모두 두 자리 (디자인상 "06월 30일" 형태)
 */
export function formatKoreanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * formatMonthDay('2026-06-08') -> '6월 8일'
 * R005 제목용. 0을 채우지 않습니다.
 */
export function formatMonthDay(isoDate: string): string {
  const [, month, day] = isoDate.split('-').map(Number);
  return `${month}월 ${day}일`;
}

/**
 * formatWeekday('2026-06-08') -> '월요일'
 *
 * 서버가 요일을 보내지 않습니다. 날짜에서 결정되는 값이라
 * 서버 값과 어긋날 여지를 만들지 않으려고 클라이언트에서 계산합니다.
 */
export function formatWeekday(isoDate: string): string {
  return WEEKDAY_LABELS[parseIsoDate(isoDate).getDay()];
}
