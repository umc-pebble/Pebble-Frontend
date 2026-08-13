export type FeaturePanelId = 'category' | 'taskColor' | 'calendar';

export interface FeaturePanelData {
  id: FeaturePanelId;
  title: string;
  description: string;
}

export const FEATURE_PANEL_DATA: FeaturePanelData[] = [
  {
    id: 'category',
    title: '큰 목표부터 오늘의 한 칸까지',
    description:
      '카테고리, 마일스톤, 태스크로 계획의 크기를 나눠 차근차근 실행해요',
  },
  {
    id: 'taskColor',
    title: '계획을 나만의 방식으로',
    description:
      '카테고리마다 원하는 색을 직접 골라, 일정을 한눈에 구분해요',
  },
  {
    id: 'calendar',
    title: '달력 위에서 바로 이해하는 한 달',
    description: '여러 일정을 한눈에 확인해요',
  },
];