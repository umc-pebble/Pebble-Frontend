import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { showGlobalErrorToast } from '@/components/feedback/globalErrorToastStore';
import {
  isCommonRetryableApiError,
  TEMPORARY_ERROR_MESSAGE,
} from '@/services/api';

interface RetryableActionOptions {
  onError?: (error: unknown) => void;
  enableRetry?: boolean;
}

type RetryableActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: unknown;
    };

export function useRetryableAction() {
  const isMountedRef = useRef(false);
  const isRunningRef = useRef(false);

  const retryActionRef = useRef<
    (() => Promise<void>) | null
  >(null);

  const [isRunning, setIsRunning] =
    useState(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      isRunningRef.current = false;
      retryActionRef.current = null;
    };
  }, []);

  const updateRunningState = useCallback(
    (nextIsRunning: boolean) => {
      isRunningRef.current =
        nextIsRunning;

      if (isMountedRef.current) {
        setIsRunning(nextIsRunning);
      }
    },
    [],
  );

  const run = useCallback(
    async <T,>(
      action: () => Promise<T>,
      {
        onError,
        enableRetry = true,
      }: RetryableActionOptions = {},
    ): Promise<RetryableActionResult<T>> => {
      if (isRunningRef.current) {
        return {
          success: false,
          error: new Error(
            '이미 요청을 처리하고 있어요.',
          ),
        };
      }

      updateRunningState(true);

      /*
       * 동일한 입력값을 사용하는 재시도 함수를
       * 다시 등록합니다.
       */
      const registerRetryAction = (
        currentError: unknown,
      ) => {
        retryActionRef.current =
          async () => {
            if (
              !isMountedRef.current ||
              isRunningRef.current
            ) {
              return;
            }

            updateRunningState(true);

            try {
              await action();
              retryActionRef.current =
                null;
            } catch (retryError) {
              onError?.(retryError);

              /*
               * 재시도가 다시 실패해도 버튼과
               * 동일한 요청값을 유지합니다.
               */
              registerRetryAction(
                retryError,
              );

              throw retryError;
            } finally {
              updateRunningState(false);
            }
          };

        showGlobalErrorToast({
          message:
            currentError instanceof Error
              ? currentError.message
              : TEMPORARY_ERROR_MESSAGE,
          retry: async () => {
            const retryAction =
              retryActionRef.current;

            if (!retryAction) return;

            await retryAction();
          },
        });
      };

      try {
        const data = await action();

        retryActionRef.current = null;

        return {
          success: true,
          data,
        };
      } catch (error) {
        onError?.(error);

        if (
          enableRetry &&
          isCommonRetryableApiError(error)
        ) {
          registerRetryAction(error);
        }

        return {
          success: false,
          error,
        };
      } finally {
        updateRunningState(false);
      }
    },
    [updateRunningState],
  );

  return {
    isRunning,
    run,
  };
}