// src/features/landing/components/BridgePebbleRow.tsx

import { BRIDGE_PEBBLES } from '@/features/landing/constants/bridgeSectionData';

import '../styles/bridgeAnimation.css';

export function BridgePebbleRow() {
  return (
    <div
      role="img"
      aria-label="최근 7일의 징검다리 미리보기"
      className="absolute left-1/2 top-[571px] z-10 h-[195px] w-[max(1440px,100vw)] -translate-x-1/2 overflow-hidden"
    >
      <div className="landing-bridge-marquee absolute left-[-58px] top-0 flex w-max gap-[32px]">
        {[0, 1].map((groupIndex) => (
          <div
            key={groupIndex}
            aria-hidden={groupIndex === 1}
            className="flex shrink-0 gap-[32px]"
          >
            {BRIDGE_PEBBLES.map((pebble) => (
              <div
                key={`${groupIndex}-${pebble.id}`}
                className={[
                  'h-[195px] w-[215px] shrink-0 rounded-[32px]',
                  pebble.className ?? '',
                ].join(' ')}
                style={{
                  backgroundColor: pebble.color,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
