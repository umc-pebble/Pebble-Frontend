/* --------------------------------------------------------------------------
 *  리포트 단계 정의 — 순서와 경로의 단일 소스
 *
 *  단계를 추가하거나 순서를 바꿀 때 이 배열만 고치면
 *  라우팅, "이전으로/다음으로" 버튼, 진행 상태가 전부 따라옵니다.
 * ------------------------------------------------------------------------ */

export interface ReportStep {
  /** 라우트 경로 조각. 최종 URL 은 /report/{path} */
  path: string;
  /** 접근성 라벨 및 문서용 이름 */
  label: string;
  /** Figma 프레임 번호 — 디자인 대조용 */
  frame: string;
}

export const REPORT_STEPS: readonly ReportStep[] = [
  { path: 'monthly', label: '저번 달 조약돌', frame: 'R003' },
  { path: 'category', label: '가장 바빴던 카테고리', frame: 'R004' },
  { path: 'day', label: '가장 바빴던 하루', frame: 'R005' },
  { path: 'friends', label: '함께한 친구들', frame: 'R006' },
  { path: 'summary', label: '전체 리포트', frame: 'R007' },
] as const;

/** 리포트 진입 시 첫 화면 */
export const FIRST_STEP_PATH = REPORT_STEPS[0].path;

/** 리포트 라우트의 베이스 경로. 앱 라우팅 구조에 맞춰 바꾸세요 */
export const REPORT_BASE_PATH = '/report';

/** 경로 조각으로 단계 인덱스 찾기. 없으면 -1 */
export const findStepIndex = (path: string): number =>
  REPORT_STEPS.findIndex((step) => step.path === path);
