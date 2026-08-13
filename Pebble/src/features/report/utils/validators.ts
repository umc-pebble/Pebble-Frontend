/* --------------------------------------------------------------------------
 *  런타임 값 검증기
 *
 *  서버 응답은 타입 선언을 지켜준다는 보장이 없습니다.
 *  normalizeMonthlyReport 가 이 함수들로 필드 하나하나를 검사합니다.
 * ------------------------------------------------------------------------ */

export const isFiniteNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

/** 0 이상의 정수 (개수 필드용) */
export const isCount = (v: unknown): v is number =>
  isFiniteNumber(v) && Number.isInteger(v) && v >= 0;

/** 1~12 정수 */
export const isMonth = (v: unknown): v is number =>
  isFiniteNumber(v) && Number.isInteger(v) && v >= 1 && v <= 12;

/** 1900~2999 정수 */
export const isYear = (v: unknown): v is number =>
  isFiniteNumber(v) && Number.isInteger(v) && v >= 1900 && v <= 2999;

/** 비어 있지 않은 문자열 */
export const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

/** "#RRGGBB" 6자리 hex. 3자리 축약과 색 이름은 거부합니다 */
export const isHexColor = (v: unknown): v is string =>
  typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);

/** "YYYY-MM-DD" 형식이고 실제 존재하는 날짜인지 (2026-02-30 같은 값 차단) */
export const isIsoDate = (v: unknown): v is string => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1) return false;
  // new Date(y, m, 0) 은 m월의 마지막 날 (월이 1-based 로 들어가는 점에 주의)
  return d <= new Date(y, m, 0).getDate();
};

/** 순수 객체인지 (배열과 null 제외) */
export const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** 문자열이면 그대로, 아니면 fallback */
export const toStringOr = (v: unknown, fallback: string): string =>
  isNonEmptyString(v) ? v : fallback;

/** 0 이상 정수면 그대로, 아니면 fallback */
export const toCountOr = (v: unknown, fallback: number): number =>
  isCount(v) ? v : fallback;

/** boolean 이면 그대로, 아니면 fallback */
export const toBooleanOr = (v: unknown, fallback: boolean): boolean =>
  typeof v === 'boolean' ? v : fallback;

/** hex 색이면 그대로, 아니면 fallback */
export const toHexOr = (v: unknown, fallback: string): string =>
  isHexColor(v) ? v : fallback;

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Date -> "YYYY-MM-DD" (로컬 기준. toISOString 은 UTC 라 날짜가 밀립니다) */
export const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export { pad2 };
