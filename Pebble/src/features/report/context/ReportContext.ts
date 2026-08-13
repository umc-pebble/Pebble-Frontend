import { createContext, useContext } from 'react';

import type { MonthlyReportResponse } from '../types/report';

export interface ReportContextValue {
  /** 정규화가 끝난 리포트 데이터 */
  report: MonthlyReportResponse;
  /** 누락/오류로 기본값을 채웠는지 */
  usedFallback: boolean;
  /** 로딩 중인지 */
  isLoading: boolean;
  /** 다시 불러오기 */
  refetch: () => void;
}

const ReportContext = createContext<ReportContextValue | null>(null);

export const ReportProvider = ReportContext.Provider;

/**
 * 리포트 데이터에 접근합니다.
 *
 * 각 단계가 개별로 API를 호출하지 않도록, ReportLayout 이 한 번 받아서
 * 이 컨텍스트로 내려줍니다. 단계를 넘겨도 재요청이 나가지 않습니다.
 */
export function useReport(): ReportContextValue {
  const value = useContext(ReportContext);
  if (!value) {
    throw new Error('useReport 는 ReportLayout 안에서만 사용할 수 있습니다.');
  }
  return value;
}
