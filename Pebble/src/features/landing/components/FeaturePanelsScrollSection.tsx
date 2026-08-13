import { useRef } from 'react';

import { FEATURE_PANEL_DATA } from '@/features/landing/constants/featurePanelData';
import { useFeaturePanelsScroll } from '@/features/landing/hooks/useFeaturePanelsScroll';
import { useInView } from '@/features/landing/hooks/useInView';
import { useLandingScale } from '@/features/landing/hooks/useLandingScale';

import { FeaturePanelsSection } from './FeaturePanelsSection';

const FIGMA_WIDTH = 1440;
const FIGMA_HEIGHT = 1024;

/*
 * 화면 너비에 따라 줄어드는 scale을 스크롤 거리에 적용하지 않습니다.
 * 모든 화면에서 단계별 전환 거리를 동일하게 유지합니다.
 */
const STEP_SCROLL_DISTANCE = 360;
const LAST_STEP_HOLD_DISTANCE = 120;

export function FeaturePanelsScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scale = useLandingScale();

  const stepCount = FEATURE_PANEL_DATA.length;
  const stepScrollDistance = STEP_SCROLL_DISTANCE;

  /*
   * sticky 화면 한 개 높이와 패널 전환용 스크롤 공간을 확보합니다.
   * 마지막 패널도 바로 다음 섹션으로 넘어가지 않고 일정 거리 동안 유지됩니다.
   */
  // 수정
const transitionCount = Math.max(stepCount - 1, 0);

const scrollSectionHeight = `calc(
  100vh + ${
    stepScrollDistance * transitionCount +
    LAST_STEP_HOLD_DISTANCE
  }px
)`;

  const activeStep = useFeaturePanelsScroll({
    sectionRef,
    stepCount,
    stepScrollDistance,
  });

  const isSectionVisible = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-fill-inverse"
      style={{
        height: scrollSectionHeight,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: FIGMA_WIDTH,
            height: FIGMA_HEIGHT,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          <FeaturePanelsSection
            activeStep={activeStep}
            isSectionVisible={isSectionVisible}
          />
        </div>
      </div>
    </section>
  );
}