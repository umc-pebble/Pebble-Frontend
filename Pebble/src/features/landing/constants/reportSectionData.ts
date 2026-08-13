// src/features/landing/constants/reportSectionData.ts

export interface ReportScheduleItem {
  id: number;
  categoryName: string;
  title: string;
  barColor: string;
}

export const REPORT_SECTION_COPY = {
  title: '조약돌을 모아, 한 달을 돌아봐요',
  description: '한 달의 성취와 활동을 리포트로 만나보세요',
} as const;

export const MONTHLY_PEBBLE_COUNT = 64;

export const BUSIEST_CATEGORY = {
  label: '이번 달 가장 바빴던 카테고리',
  name: '사이드 프로젝트',
  color: '#8B84F2',
  milestoneCount: 4,
  taskCount: 22,
} as const;

export const BUSIEST_DAY = {
  label: '이번 달 가장 바빴던 하루',
  date: '6월 8일',
  suffix: '에 일정이 가장 많았어요',
  dayOfWeek: '월요일',
  totalScheduleCount: '총 3개의 일정',
} as const;

export const REPORT_SCHEDULE_ITEMS: ReportScheduleItem[] = [
  {
    id: 1,
    categoryName: '사이드 프로젝트',
    title: '1차 MVP 완성',
    barColor: '#B9B5F7',
  },
  {
    id: 2,
    categoryName: '사이드 프로젝트 - 1차 MVP 완성',
    title: '핵심 화면 정리',
    barColor: '#DAD9FB',
  },
  {
    id: 3,
    categoryName: '자격증 시험',
    title: '학원',
    barColor: '#DAF4FF',
  },
];