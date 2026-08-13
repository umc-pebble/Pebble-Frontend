import { useState, type MouseEvent } from 'react';

import CalendarIcon from '@/assets/icons/calendar-outline.svg?react';
import ReportIcon from '@/assets/icons/memo-outline.svg?react';

import type {
  Alarm,
  CategoryInviteAction,
  FollowRequestAction,
} from '../types/alarm';

interface AlarmItemProps {
  alarm: Alarm;
  onDelete: (alarmId: number) => void;
  onFollowRequestResponse?: (
    alarm: Alarm,
    action: FollowRequestAction,
  ) => Promise<void>;
  onCategoryInviteResponse?: (
    alarm: Alarm,
    action: CategoryInviteAction,
  ) => Promise<void>;
}

const getAlarmIcon = (type: Alarm['type']) => {
  switch (type) {
    case 'TASK_DUE':
    case 'MILESTONE_DUE':
      return <CalendarIcon className="size-5" />;
    case 'REPORT':
      return <ReportIcon className="size-5" />;
    default:
      return null;
  }
};

const getFollowMessageSuffix = (alarm: Alarm) => {
  if (alarm.type === 'FOLLOW_REQUEST') {
    if (alarm.followStatus === 'ACCEPTED') {
      return '님의 팔로우 요청을 수락했어요';
    }

    if (alarm.followStatus === 'REJECTED') {
      return '님의 팔로우 요청을 거절했어요';
    }

    return '님이 팔로우를 요청했어요';
  }

  if (alarm.type === 'FOLLOW_ACCEPTED') {
    return '님이 팔로우를 수락했어요';
  }

  return '';
};

export const AlarmItem = ({
  alarm,
  onDelete,
  onFollowRequestResponse,
  onCategoryInviteResponse,
}: AlarmItemProps) => {
  const [isResponding, setIsResponding] = useState(false);
  const isPendingFollowRequest =
    alarm.type === 'FOLLOW_REQUEST' &&
    (alarm.followStatus ?? 'PENDING') === 'PENDING';

  const isPendingCategoryInvite =
    alarm.type === 'CATEGORY_INVITE' &&
    (alarm.followStatus ?? 'PENDING') === 'PENDING';

  const shouldShowActiveBackground =
    alarm.type === 'FOLLOW_REQUEST'
      ? isPendingFollowRequest
      : alarm.type === 'CATEGORY_INVITE'
        ? isPendingCategoryInvite
        : !alarm.isRead;

  const hasUserImage =
    alarm.type === 'FOLLOW_REQUEST' || alarm.type === 'FOLLOW_ACCEPTED';

  const isActionableAlarm = isPendingFollowRequest || isPendingCategoryInvite;

  const overlayClass = shouldShowActiveBackground
    ? 'before:bg-[rgba(48,89,255,0.05)] hover:before:bg-[rgba(23,23,23,0.05)] dark:hover:before:bg-[rgba(250,250,250,0.08)]'
    : 'before:bg-transparent hover:before:bg-[rgba(23,23,23,0.05)] dark:hover:before:bg-[rgba(250,250,250,0.08)]';

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(alarm.id);
  };

  const handleAccept = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isResponding) return;

    setIsResponding(true);

    try {
      if (isPendingCategoryInvite) {
        await onCategoryInviteResponse?.(alarm, 'ACCEPT');
        return;
      }

      await onFollowRequestResponse?.(alarm, 'ACCEPT');
    } finally {
      setIsResponding(false);
    }
  };

  const handleReject = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isResponding) return;

    setIsResponding(true);

    try {
      if (isPendingCategoryInvite) {
        await onCategoryInviteResponse?.(alarm, 'REJECT');
        return;
      }

      await onFollowRequestResponse?.(alarm, 'REJECT');
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div
      className={[
        'relative mt-3 min-h-[81px] w-[376px] overflow-hidden rounded-token-s bg-fill-inverse px-3 py-5 transition-colors duration-150',
        'before:pointer-events-none before:absolute before:inset-0 before:transition-colors',
        overlayClass,
        isActionableAlarm ? 'min-h-[118px]' : '',
      ].join(' ')}
    >
      <div className="relative z-10 flex items-start gap-3">
        <div
          className={[
            'size-10 shrink-0 overflow-hidden rounded-full',
            hasUserImage
              ? 'border-[0.5px] border-border-secondary bg-fill-inverse'
              : 'bg-btn-quaternary',
          ].join(' ')}
        >
          {hasUserImage && alarm.user?.profileImageUrl ? (
            <img
              src={alarm.user.profileImageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-[14px] font-medium text-text-strong">
              {hasUserImage
                ? alarm.user?.nickname.slice(0, 1)
                : getAlarmIcon(alarm.type)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {hasUserImage && alarm.user ? (
            <p className="text-body-02-m text-text-strong">
              <span className="font-semibold">{alarm.user.nickname}</span>
              <span className="font-medium">
                {getFollowMessageSuffix(alarm)}
              </span>
            </p>
          ) : (
            <p className="text-body-02-m text-text-strong">
              {alarm.content}
            </p>
          )}

          <p className="mt-0.5 text-[13px] font-normal leading-[1.3] text-text-teritary">
            {alarm.createdAt}
          </p>

          {isActionableAlarm && (
            <div className="mt-2 flex gap-[7px]">
              <button
                type="button"
                onClick={(event) => void handleAccept(event)}
                disabled={isResponding}
                className="h-[29px] min-w-[49px] rounded-[4px] bg-btn-primary px-3 py-1 text-[14px] font-medium leading-[1.5] tracking-[-0.14px] text-text-onFill transition-[filter,opacity] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                수락
              </button>

              <button
                type="button"
                onClick={(event) => void handleReject(event)}
                disabled={isResponding}
                className="h-[29px] min-w-[49px] rounded-[4px] bg-btn-quaternary px-3 py-1 text-[14px] font-medium leading-[1.5] tracking-[-0.14px] text-text-strong transition-[background-color,opacity] hover:bg-btn-pressed disabled:cursor-not-allowed disabled:opacity-50"
              >
                거절
              </button>
            </div>
          )}
        </div>

        {!isActionableAlarm && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex size-6 shrink-0 items-center justify-center text-[22px] leading-none text-text-teritary transition-colors hover:text-text-strong"
            aria-label="알림 삭제"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
