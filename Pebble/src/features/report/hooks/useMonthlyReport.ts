import { useCallback, useEffect, useMemo, useState } from 'react';

import { getLatestReport } from '../api/reportApi';
import { adaptLatestReport } from '../utils/adaptLatestReport';
import { normalizeMonthlyReport } from '../utils/normalizeMonthlyReport';
import type { MonthlyReportResponse } from '../types/report';

interface UseMonthlyReportResult {
  report: MonthlyReportResponse;
  usedFallback: boolean;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * 월말 리포트 조회.
 *
 * GET /reports는 로그인 사용자의 만료되지 않은 최신 리포트를 반환합니다.
 * 조회는 ReportLayout 진입 시 한 번만 실행되므로 단계를 이동해도 재요청하지 않습니다.
 */
export function useMonthlyReport(
  year: number,
  month: number,
): UseMonthlyReportResult {
  const [raw, setRaw] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;
    setIsLoading(true);

    getLatestReport(controller.signal)
      .then((dto) => {
        if (!isActive) return;

        if (!dto) {
          // 아직 생성된 리포트가 없는 정상 응답은 오류 안내 없이 0건으로 표시합니다.
          const recentMonths = [2, 1, 0].map((offset) => {
            const date = new Date(year, month - 1 - offset, 1);
            return {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              count: 0,
            };
          });
          const endDate = new Date(year, month, 0);
          const monthText = String(month).padStart(2, '0');
          setRaw({
            reportId: null,
            reportImageUrl: null,
            reportYear: year,
            reportMonth: month,
            monthlyPebbleCount: 0,
            recentMonths,
            totalPebbleCount: 0,
            recordStartDate: `${year}-${monthText}-01`,
            recordEndDate: `${year}-${monthText}-${String(endDate.getDate()).padStart(2, '0')}`,
            busiestCategory: null,
            busiestDay: null,
            sharedFriends: { sharedCategoryCount: 0, friends: [] },
          });
          return;
        }

        setRaw(adaptLatestReport(dto) ?? undefined);
      })
      .catch(() => {
        if (!isActive || controller.signal.aborted) return;
        // 실패해도 던지지 않습니다. 정규화가 기본값으로 채우고
        // 화면에 "불러오지 못했어요" 안내가 뜹니다.
        setRaw(undefined);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [year, month, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  const { data: report, usedFallback, fallbackFields } = useMemo(
    () => normalizeMonthlyReport(raw),
    [raw],
  );

  useEffect(() => {
    if (!isLoading && usedFallback) {
      console.warn('[MonthlyReport] 기본값으로 채운 필드:', fallbackFields);
    }
  }, [isLoading, usedFallback, fallbackFields]);

  return { report, usedFallback, isLoading, refetch };
}
