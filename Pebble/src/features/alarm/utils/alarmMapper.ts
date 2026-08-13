import type { NotificationResponse } from "@/features/alarm/api/alarmApi";
import type { Alarm, AlarmType } from "@/features/alarm/types/alarm";
import type { FollowListItem } from "@/features/friends/api/followApi";

const getAlarmContent = (type: AlarmType) => {
  switch (type) {
    case "TASK_DUE":
      return "마감 예정인 태스크가 있어요";
    case "MILESTONE_DUE":
      return "마감 예정인 마일스톤이 있어요";
    case "REPORT":
      return "월말 리포트가 도착했어요!";
    case "CATEGORY_INVITE":
      return "공유 카테고리 초대가 도착했어요";
    case "CATEGORY_DELETED":
      return "공유 카테고리가 삭제되었어요";
    case "CATEGORY_ACCEPTED":
      return "공유 카테고리 초대가 수락되었어요";
    case "FOLLOW_REQUEST":
      return "팔로우 요청이 도착했어요";
    case "FOLLOW_ACCEPTED":
      return "팔로우 요청이 수락되었어요";
  }
};

const formatRelativeTime = (createdAt: string) => {
  const elapsedMs = Date.now() - new Date(createdAt).getTime();

  if (!Number.isFinite(elapsedMs) || elapsedMs < 60_000) {
    return "방금";
  }

  const minutes = Math.floor(elapsedMs / 60_000);

  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}시간 전`;
  }

  return `${Math.floor(hours / 24)}일 전`;
};

const findFollow = (
  notification: NotificationResponse,
  pendingRequests: FollowListItem[],
  friends: FollowListItem[],
) => {
  if (notification.relatedId === null) {
    return undefined;
  }

  if (notification.type === "FOLLOW_REQUEST") {
    return (
      pendingRequests.find(
        ({ followId }) => followId === notification.relatedId,
      ) ?? friends.find(({ followId }) => followId === notification.relatedId)
    );
  }

  if (notification.type === "FOLLOW_ACCEPTED") {
    return friends.find(({ followId }) => followId === notification.relatedId);
  }

  return undefined;
};

export const mapNotificationToAlarm = (
  notification: NotificationResponse,
  pendingRequests: FollowListItem[],
  friends: FollowListItem[],
): Alarm => {
  const follow = findFollow(notification, pendingRequests, friends);

  return {
    id: notification.id,
    notificationIds: [notification.id],
    unreadNotificationIds: notification.isRead ? [] : [notification.id],
    type: notification.type,
    relatedId: notification.relatedId,
    expiresAt: notification.expiresAt,
    content: getAlarmContent(notification.type),
    isRead: notification.isRead,
    createdAt: formatRelativeTime(notification.createdAt),
    createdAtIso: notification.createdAt,
    friendRequestId:
      notification.type === "FOLLOW_REQUEST"
        ? notification.relatedId ?? undefined
        : undefined,
    followStatus:
      notification.type === "FOLLOW_REQUEST"
        ? follow && pendingRequests.includes(follow)
          ? "PENDING"
          : "ACCEPTED"
        : notification.type === "CATEGORY_INVITE" && !notification.isRead
          ? "PENDING"
          : undefined,
    user: follow
      ? {
          id: follow.userId,
          nickname: follow.nickname,
          profileImageUrl: follow.profileImageUrl,
        }
      : undefined,
  };
};

const isScheduleDueAlarm = (alarm: Alarm) =>
  alarm.type === "TASK_DUE" || alarm.type === "MILESTONE_DUE";

const getKstDateKey = (createdAt: string) => {
  const date = new Date(createdAt);

  if (!Number.isFinite(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const groupScheduleDueAlarms = (alarms: Alarm[]) => {
  const scheduleGroups = new Map<string, Alarm>();
  const result: Alarm[] = [];

  alarms.forEach((alarm) => {
    if (!isScheduleDueAlarm(alarm)) {
      result.push(alarm);
      return;
    }

    const dateKey = getKstDateKey(alarm.createdAtIso);
    const existingGroup = scheduleGroups.get(dateKey);

    if (!existingGroup) {
      const scheduleAlarm = {
        ...alarm,
        content: "오늘 1개의 일정이 있어요",
      };

      scheduleGroups.set(dateKey, scheduleAlarm);
      result.push(scheduleAlarm);
      return;
    }

    existingGroup.notificationIds.push(...alarm.notificationIds);
    existingGroup.unreadNotificationIds.push(...alarm.unreadNotificationIds);
    existingGroup.isRead = existingGroup.unreadNotificationIds.length === 0;
    existingGroup.content = `오늘 ${existingGroup.notificationIds.length}개의 일정이 있어요`;
  });

  return result;
};
