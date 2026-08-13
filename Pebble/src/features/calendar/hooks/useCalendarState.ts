import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { reportInitialNetworkFailure } from '@/components/feedback/networkRecoveryStore';
import { useCalendarCategoryActions } from '@/features/calendar/hooks/useCalendarCategoryActions';
import { useCalendarScheduleActions } from '@/features/calendar/hooks/useCalendarScheduleActions';
import {
  isInitialCalendarNetworkError,
  loadCalendarDataSnapshot,
} from '@/features/calendar/services/calendarDataLoader';
import type { CalendarStateModel } from '@/features/calendar/types';
import { getAccessToken } from '@/services/api';
import type { Category, TaskItem } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';

export type {
  CalendarActions,
  CalendarState,
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';

type UseCalendarStateParams = {
  currentYear: number;
  currentMonth: number;
  viewedUserId?: number | null;
};

export const useCalendarState = ({
  currentYear,
  currentMonth,
  viewedUserId,
}: UseCalendarStateParams): CalendarStateModel => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [standaloneTasks, setStandaloneTasks] = useState<TaskItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [loadedViewedUserId, setLoadedViewedUserId] = useState<number | null>(
    null,
  );
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarErrorMessage, setCalendarErrorMessage] = useState<
    string | null
  >(null);

  const hasCompletedInitialLoadRef = useRef(false);
  const retryCalendarLoadRef = useRef<(() => Promise<boolean>) | null>(null);
  const currentUserIdRef = useRef<number | null>(null);

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const resetCalendarState = useCallback(() => {
    currentUserIdRef.current = null;
    setCurrentUserId(null);
    setCategories([]);
    setStandaloneTasks([]);
    setSelectedCategoryId(null);
    setLoadedViewedUserId(null);
    setCalendarErrorMessage(null);
    setIsCalendarLoading(false);
  }, []);

  const loadCalendarData = useCallback(
    async (
      canUpdate: () => boolean = () => true,
    ): Promise<boolean> => {
      if (!getAccessToken()) {
        if (canUpdate()) {
          resetCalendarState();
        }

        return true;
      }

      if (canUpdate()) {
        setCalendarErrorMessage(null);
        setIsCalendarLoading(true);
        setLoadedViewedUserId(null);
      }

      try {
        const nextCalendarState = await loadCalendarDataSnapshot({
          currentMonth,
          currentYear,
          knownCurrentUserId: currentUserIdRef.current,
          viewedUserId,
        });

        if (canUpdate()) {
          currentUserIdRef.current = nextCalendarState.currentUserId;
          setCurrentUserId(nextCalendarState.currentUserId);
          setCategories(nextCalendarState.categories);
          setStandaloneTasks(nextCalendarState.standaloneTasks);
          setLoadedViewedUserId(nextCalendarState.loadedViewedUserId);
          setCalendarErrorMessage(null);

          if (nextCalendarState.loadedViewedUserId !== null) {
            setSelectedCategoryId(null);
          }
        }

        hasCompletedInitialLoadRef.current = true;
        return true;
      } catch (error) {
        if (canUpdate()) {
          if (viewedUserId !== undefined && viewedUserId !== null) {
            setCategories([]);
            setStandaloneTasks([]);
            setSelectedCategoryId(null);
          }

          setCalendarErrorMessage(
            getErrorMessage(error, '캘린더 정보를 불러오지 못했어요.'),
          );
        }

        if (
          !hasCompletedInitialLoadRef.current &&
          isInitialCalendarNetworkError(error)
        ) {
          reportInitialNetworkFailure(async () => {
            const retryLoad = retryCalendarLoadRef.current;

            if (!retryLoad) {
              throw new Error('초기 데이터를 다시 요청할 수 없어요.');
            }

            const succeeded = await retryLoad();

            if (!succeeded) {
              throw new Error('초기 데이터를 불러오지 못했어요.');
            }
          });
        }

        return false;
      } finally {
        if (canUpdate()) {
          setIsCalendarLoading(false);
        }
      }
    },
    [currentMonth, currentYear, resetCalendarState, viewedUserId],
  );

  useEffect(() => {
    retryCalendarLoadRef.current = () => loadCalendarData();

    return () => {
      retryCalendarLoadRef.current = null;
    };
  }, [loadCalendarData]);

  useEffect(() => {
    let isActive = true;

    void loadCalendarData(() => isActive);

    return () => {
      isActive = false;
    };
  }, [loadCalendarData]);

  const reloadCalendarData = useCallback(async () => {
    await loadCalendarData();
  }, [loadCalendarData]);

  const categoryActions = useCalendarCategoryActions({
    categories,
    reloadCalendarData,
    setCategories,
    setSelectedCategoryId,
  });

  const scheduleActions = useCalendarScheduleActions({
    categories,
    reloadCalendarData,
    setCategories,
    standaloneTasks,
  });

  return {
    currentUserId,
    categories,
    standaloneTasks,
    selectedCategory,
    selectedCategoryId,
    loadedViewedUserId,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
    ...categoryActions,
    ...scheduleActions,
  };
};
