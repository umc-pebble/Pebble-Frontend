// src/features/landing/constants/bridgeSectionData.ts

export interface BridgePebbleItem {
  id: number;
  color: string;
  className?: string;
}

export interface BridgeBackgroundImage {
  id: string;
  src: string;
  className: string;
}

export const BRIDGE_SECTION_COPY = {
  title: '하루의 조약돌이 모여 나만의 흐름이 돼요',
  description: '완료한 태스크가 차곡차곡 쌓여 나만의 징검다리를 만들어가요',
  label: '최근 7일의 징검다리',
} as const;

export const BRIDGE_PEBBLES: BridgePebbleItem[] = [
  {
    id: 1,
    color: '#E5E5E5',
  },
  {
    id: 2,
    color: '#E5E5E5',
  },
  {
    id: 3,
    color: '#A3A3A3',
  },
  {
    id: 4,
    color: '#E5E5E5',
  },
  {
    id: 5,
    color: '#171717',
    className: 'border border-[#D4D4D4]',
  },
  {
    id: 6,
    color: '#A3A3A3',
  },
  {
    id: 7,
    color: '#FAFAFA',
    className: 'border border-[#D4D4D4]',
  },
];