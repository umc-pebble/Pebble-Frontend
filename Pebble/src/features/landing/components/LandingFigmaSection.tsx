import type { ReactNode } from 'react';

import { useLandingScale } from '@/features/landing/hooks/useLandingScale';

const FIGMA_WIDTH = 1440;

interface LandingFigmaSectionProps {
  children: ReactNode;
  height: number;
  className?: string;
}

export function LandingFigmaSection({
  children,
  height,
  className = '',
}: LandingFigmaSectionProps) {
  const scale = useLandingScale();

  return (
    <section
      style={{
        height: height * scale,
      }}
      className={['relative w-full overflow-hidden', className].join(' ')}
    >
      <div
        style={{
          width: FIGMA_WIDTH,
          height,
          transform: `translateX(-50%) scale(${scale})`,
        }}
        className="absolute left-1/2 top-0 origin-top"
      >
        {children}
      </div>
    </section>
  );
}