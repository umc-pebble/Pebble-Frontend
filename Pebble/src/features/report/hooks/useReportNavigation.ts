import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  FIRST_STEP_PATH,
  REPORT_BASE_PATH,
  REPORT_STEPS,
  findStepIndex,
} from '../constants/reportSteps';

interface UseReportNavigationResult {
  /** 현재 단계 인덱스 (0-based). 매칭 실패 시 0 */
  currentIndex: number;
  /** 마지막 단계인지 */
  isLast: boolean;
  /** 첫 단계인지 */
  isFirst: boolean;
  /** 총 단계 수 */
  totalSteps: number;
  /** 다음 단계로. 마지막이면 아무 일도 하지 않습니다 */
  goNext: () => void;
  /** 이전 단계로. 첫 단계면 아무 일도 하지 않습니다 */
  goPrev: () => void;
  /** 첫 단계로 (R007 "처음부터 다시 보기") */
  goFirst: () => void;
}

/**
 * URL 을 기준으로 이전/다음 단계를 계산합니다.
 *
 * 단계 순서는 constants/reportSteps.ts 한 곳에서만 관리됩니다.
 * 화면을 추가하려면 그 배열에 항목을 넣고 라우트에 element 만 달면 됩니다.
 *
 * navigate 에 replace 를 쓰지 않는 이유: 브라우저 뒤로가기가 "이전 단계"로
 * 동작하는 게 이 흐름에서 자연스럽기 때문입니다.
 */
export function useReportNavigation(): UseReportNavigationResult {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentIndex = useMemo(() => {
    const segment = pathname.split('/').filter(Boolean).pop() ?? '';
    const index = findStepIndex(segment);
    return index === -1 ? 0 : index;
  }, [pathname]);

  const go = useCallback(
    (index: number) => {
      const step = REPORT_STEPS[index];
      if (step) navigate(`${REPORT_BASE_PATH}/${step.path}`);
    },
    [navigate],
  );

  return {
    currentIndex,
    isFirst: currentIndex === 0,
    isLast: currentIndex === REPORT_STEPS.length - 1,
    totalSteps: REPORT_STEPS.length,
    goNext: useCallback(() => go(currentIndex + 1), [go, currentIndex]),
    goPrev: useCallback(() => go(currentIndex - 1), [go, currentIndex]),
    goFirst: useCallback(
      () => navigate(`${REPORT_BASE_PATH}/${FIRST_STEP_PATH}`),
      [navigate],
    ),
  };
}
