import { useRef } from 'react';

import { STEP_STRUCTURE_STAGES } from '@/features/landing/constants/stepStructureData';
import { useInView } from '@/features/landing/hooks/useInView';
import { useLandingScale } from '@/features/landing/hooks/useLandingScale';
import { useStepStructureScroll } from '@/features/landing/hooks/useStepStructureScroll';

import { StepStructureSection } from './StepStructureSection';

const FIGMA_WIDTH = 1440;
const FIGMA_HEIGHT = 1024;

/*
 * 화면 축소 비율과 관계없이 동일한 스크롤 거리를 사용합니다.
 * scale은 Figma UI의 시각적 크기 조절에만 사용합니다.
 */
const STEP_SCROLL_DISTANCE = 360;

export function StepStructureScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scale = useLandingScale();

  const stepCount = STEP_STRUCTURE_STAGES.length;
  const stepScrollDistance = STEP_SCROLL_DISTANCE;

  /*
   * sticky 화면 한 개 높이와 각 단계가 유지될 스크롤 공간을 더합니다.
   *
   * 0 ~ 359px: CATEGORY
   * 360 ~ 719px: MILESTONE
   * 720px 이상: TASK
   *
   * 마지막 단계도 일정 거리 동안 화면에 유지되도록
   * stepCount 전체를 높이에 반영합니다.
   */
  const scrollSectionHeight = `calc(
    100vh + ${stepScrollDistance * stepCount}px
  )`;

  const activeStep = useStepStructureScroll({
    sectionRef,
    stepCount,
    stepScrollDistance,
  });

  const isSectionVisible = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[linear-gradient(116.82deg,#FFFFFF_0%,#FAFAFA_100%)]"
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
          <StepStructureSection
            activeStep={activeStep}
            isTextVisible={isSectionVisible}
          />
        </div>
      </div>
    </section>
  );
}
