import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Toast } from '@/components/ui/Toast';

import type {
  Alarm,
  CategoryInviteAction,
  FollowRequestAction,
} from '../types/alarm';
import { AlarmItem } from './AlarmItem';

interface AlarmPopoverProps {
  top: number;
  left: number;
  alarms: Alarm[];
  onDelete: (alarmId: number) => Promise<void>;
  onDeleteAll: () => Promise<void>;
  onRespondFollowRequest: (
    alarmId: number,
    action: FollowRequestAction,
  ) => Promise<void>;
  onRespondCategoryInvite: (
    alarmId: number,
    action: CategoryInviteAction,
  ) => Promise<void>;
}

export const AlarmPopover = ({
  top,
  left,
  alarms,
  onDelete,
  onDeleteAll,
  onRespondFollowRequest,
  onRespondCategoryInvite,
}: AlarmPopoverProps) => {
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const handleFollowRequestResponse = async (
    alarm: Alarm,
    action: FollowRequestAction,
  ) => {
    try {
      await onRespondFollowRequest(alarm.id, action);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '요청을 처리하지 못했어요.',
      );
      return;
    }

    const nickname = alarm.user?.nickname ?? '상대';

    showToast(
      action === 'ACCEPT'
        ? `${nickname}님과 친구가 되었어요`
        : `${nickname}님의 요청을 거절했어요`,
    );
  };

  const handleCategoryInviteResponse = async (
    alarm: Alarm,
    action: CategoryInviteAction,
  ) => {
    try {
      await onRespondCategoryInvite(alarm.id, action);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '요청을 처리하지 못했어요.',
      );
      return;
    }

    showToast(
      action === 'ACCEPT'
        ? '공유 카테고리 초대를 수락했어요'
        : '공유 카테고리 초대를 거절했어요',
    );
  };

  return createPortal(
    <div
      data-alarm-popover
      className="relative z-[9999] flex h-[600px] w-[400px] flex-col rounded-[24px] bg-fill-inverse px-3 py-4 shadow-shadow-m animate-[popover-in_450ms_ease-in-out] dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.06)]"
      style={{
        position: 'fixed',
        top,
        left,
      }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <h2 className="text-[18px] font-semibold leading-[25px] text-text-strong">
          알림
        </h2>

        {alarms.length > 0 && (
          <button
            type="button"
            onClick={() => void onDeleteAll()}
            className="text-[14px] font-normal text-text-secondary hover:text-text-strong"
          >
            전체 삭제
          </button>
        )}
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto overscroll-contain pr-1 pt-3">
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <AlarmItem
              key={alarm.id}
              alarm={alarm}
              onDelete={(alarmId) => void onDelete(alarmId)}
              onFollowRequestResponse={handleFollowRequestResponse}
              onCategoryInviteResponse={handleCategoryInviteResponse}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-body-s text-text-teritary">
            알림이 없습니다.
          </div>
        )}
      </div>

      <Toast
        message={toastMessage}
        open={isToastVisible}
        className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
      />
    </div>,
    document.body,
  );
};