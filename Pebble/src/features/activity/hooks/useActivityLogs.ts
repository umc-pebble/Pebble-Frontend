import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiRequestError } from '@/services/api';

import { getActivityLogs } from '../api/activityLogsApi';
import type {
  ActivityLogsErrorState,
  NormalizedActivityLogs,
} from '../types/activityLogs';
import { getRecentSevenDates, getSeoulBaseDate } from '../utils/activityDate';
import { subscribeActivityLogChanges } from '../utils/activityLogInvalidation';
import { normalizeActivityLogsResponse } from '../utils/normalizeActivityLogs';

const ACTIVITY_LOG_REFETCH_DEBOUNCE_MS = 350;

interface UseActivityLogsParams {
  userId?: number | null;
  baseDate?: string;
  enabled?: boolean;
}

function getErrorType(status?: number): ActivityLogsErrorState['type'] {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'notFound';
  if (typeof status === 'number' && status >= 500) return 'server';

  return 'unknown';
}

function normalizeError(error: unknown): ActivityLogsErrorState {
  if (error instanceof ApiRequestError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      type: getErrorType(error.status),
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      type: 'unknown',
    };
  }

  return {
    message: '징검다리 기록을 불러오지 못했어요.',
    type: 'unknown',
  };
}

function hasOverlappingDate({
  baseDate,
  affectedDates,
}: {
  baseDate: string;
  affectedDates?: string[];
}) {
  if (!affectedDates || affectedDates.length === 0) {
    return true;
  }

  const visibleDates = new Set(getRecentSevenDates(baseDate));

  return affectedDates.some((date) => visibleDates.has(date));
}

export function useActivityLogs({
  userId,
  baseDate,
  enabled = true,
}: UseActivityLogsParams) {
  const normalizedBaseDate = baseDate ?? getSeoulBaseDate();

  const [data, setData] = useState<NormalizedActivityLogs | null>(null);
  const [error, setError] = useState<ActivityLogsErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const loadActivityLogs = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!enabled || !userId) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getActivityLogs({
        userId,
        baseDate: normalizedBaseDate,
      });

      if (requestId !== requestIdRef.current) return;

      setData(normalizeActivityLogsResponse(response));
    } catch (requestError) {
      if (requestId !== requestIdRef.current) return;

      setData(null);
      setError(normalizeError(requestError));
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, normalizedBaseDate, userId]);

  const scheduleRefetch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      void loadActivityLogs();
    }, ACTIVITY_LOG_REFETCH_DEBOUNCE_MS);
  }, [loadActivityLogs]);

  useEffect(() => {
    void loadActivityLogs();
  }, [loadActivityLogs]);

  useEffect(() => {
    if (!enabled || !userId) return undefined;

    return subscribeActivityLogChanges((event) => {
      if (
        hasOverlappingDate({
          baseDate: normalizedBaseDate,
          affectedDates: event.affectedDates,
        })
      ) {
        scheduleRefetch();
      }
    });
  }, [enabled, normalizedBaseDate, scheduleRefetch, userId]);

  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      requestIdRef.current += 1;
    },
    [],
  );

  return {
    data,
    userId: data?.userId,
    nickname: data?.nickname,
    activityColor: data?.activityColor,
    baseDate: data?.baseDate,
    logs: data?.logs ?? [],
    palette: data?.palette,

    isLoading,
    isError: error !== null,
    error,
    errorType: error?.type,
    errorStatus: error?.status,
    errorCode: error?.code,

    refetch: loadActivityLogs,
  };
}