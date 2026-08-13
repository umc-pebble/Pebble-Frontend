
import type { RefObject } from 'react';

import { useLockedStepScroll } from './useLockedStepScroll';

interface UseStepStructureScrollParams {
  sectionRef: RefObject<HTMLElement>;
  stepCount: number;
  stepScrollDistance: number;
}

/*
 * 카드 전환은 800ms지만 끝나기 약 150ms 전부터
 * 다음 스크롤 입력을 받을 수 있도록 합니다.
*/
const STEP_TRANSITION_LOCK_DURATION = 650;

export function useStepStructureScroll({
  sectionRef,
  stepCount,
  stepScrollDistance,
}: UseStepStructureScrollParams) {
  return useLockedStepScroll({
    sectionRef,
    stepCount,
    stepScrollDistance,
    transitionDuration: STEP_TRANSITION_LOCK_DURATION,
  });
}