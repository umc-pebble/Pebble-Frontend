
import type { RefObject } from 'react';

import { useLockedStepScroll } from './useLockedStepScroll';

interface UseFeaturePanelsScrollParams {
  sectionRef: RefObject<HTMLElement>;
  stepCount: number;
  stepScrollDistance: number;
}

/*
 * 미리보기 애니메이션은 delay를 포함해 약 1380ms입니다.
 * 끝나기 약 180ms 전부터 다음 스크롤 입력을 허용합니다.
 */
const FEATURE_PANEL_TRANSITION_LOCK_DURATION =
  800;

export function useFeaturePanelsScroll({
  sectionRef,
  stepCount,
  stepScrollDistance,
}: UseFeaturePanelsScrollParams) {
  return useLockedStepScroll({
    sectionRef,
    stepCount,
    stepScrollDistance,
    transitionDuration: FEATURE_PANEL_TRANSITION_LOCK_DURATION,
  });
}