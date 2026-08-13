/* --------------------------------------------------------------------------
 *  리포트 화면 색상 토큰
 *
 *  Chart.js 와 html-to-image 는 Tailwind 클래스를 읽지 못하므로 hex 값이
 *  필요합니다. JSX 쪽에서도 같은 값을 arbitrary value(bg-[#F4F4F4])로 쓰고
 *  있으니, Figma 실제 값과 다르면 여기와 JSX 양쪽을 함께 바꿔주세요.
 *
 *  자주 쓰실 거면 tailwind.config 의 theme.extend.colors 로 옮기는 게 낫습니다.
 *
 *  TODO: Figma Dev Mode 연결 후 정확한 hex 로 교체
 * ------------------------------------------------------------------------ */

export const REPORT_COLORS = {
  /** 페이지 배경 (은은한 그라데이션의 밝은 쪽) */
  pageBg: '#FFFFFF',
  /** 메인 카드 배경 */
  cardBg: '#FFFFFF',
  /** 내부 서브 카드 배경 */
  subCardBg: '#F4F4F4',
  /** 더 옅은 서브 카드 (R004 태스크 카드) */
  subCardBgSoft: '#FAFAFA',
  /** 본문 진한 텍스트 */
  textPrimary: '#1A1A1A',
  /** 보조 설명 텍스트 */
  textSecondary: '#8E8E8E',
  /** 아주 옅은 라벨 */
  textTertiary: '#B4B4B4',
  /** 이번 달 개수 대형 숫자 (R003) */
  bigNumber: '#A9A9A9',
  /** 누적 개수 대형 숫자 (R003) */
  totalNumber: '#3D3D3D',
  /** 차트 라인 */
  chartLine: '#6B6B6B',
  /** 차트 영역 채움 (상단) */
  chartFillTop: 'rgba(140, 140, 140, 0.28)',
  /** 차트 영역 채움 (하단, 투명하게 사라짐) */
  chartFillBottom: 'rgba(140, 140, 140, 0)',
  /** R004 타임라인 강조 점 / "+ N개" 버튼 */
  accent: '#3B82F6',
  /** R004 타임라인 비활성 점 */
  timelineIdle: '#C9CDD2',
  /** "+ N개" 버튼 배경 */
  accentSoft: '#EAF2FE',
  /** 완료 체크 아이콘 */
  checkIcon: '#4B4B4B',
  /** 미완료 엑스 아이콘 */
  crossIcon: '#B4B4B4',
  /** 테두리 / 구분선 */
  border: '#E8E8E8',
  /** 하단 CTA 버튼 배경 */
  buttonBg: '#1A1A1A',
} as const;

/**
 * 이미지 저장 시 캔버스 배경색.
 * 투명 배경으로 저장하면 앨범/메신저에서 검게 보이는 경우가 있어 흰색으로 굽습니다.
 */
export const SAVE_IMAGE_BACKGROUND = '#FFFFFF';
