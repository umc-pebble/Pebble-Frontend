import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  deleteAlarm,
  getAlarms,
  readAlarm,
} from "@/features/alarm/api/alarmApi";
import {
  groupScheduleDueAlarms,
  mapNotificationToAlarm,
} from "@/features/alarm/utils/alarmMapper";
import {
  acceptFollowRequest,
  deleteFollow,
  getAllFollows,
} from "@/features/friends/api/followApi";
import { respondCategoryInvite } from "@/features/category/api/sharedCategoryApi";
import { notifyCalendarUpdated } from "@/features/calendar/utils/calendarSync";
import { ApiRequestError } from "@/services/api";
import type {
  Alarm,
  CategoryInviteAction,
  FollowRequestAction,
} from "@/features/alarm/types/alarm";
import {
  notifyFollowUpdated,
} from "@/features/friends/utils/followSync";

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const followStateSignatureRef = useRef<string | null>(null);

  const refreshAlarms = useCallback(async () => {
    const [notificationResponse, pendingResponse, friendsResponse] =
      await Promise.all([
        getAlarms(),
        getAllFollows("pending"),
        getAllFollows("friends"),
      ]);
    const nextFollowStateSignature = JSON.stringify({
      pending: pendingResponse.map(({ followId }) => followId).sort(),
      friends: friendsResponse.map(({ followId }) => followId).sort(),
    });

    if (
      followStateSignatureRef.current !== null &&
      followStateSignatureRef.current !== nextFollowStateSignature
    ) {
      notifyFollowUpdated();
    }

    followStateSignatureRef.current = nextFollowStateSignature;

    setAlarms(
      groupScheduleDueAlarms(notificationResponse.notifications.map((notification) =>
        mapNotificationToAlarm(
          notification,
          pendingResponse,
          friendsResponse,
        ),
      )),
    );
    setUnreadCount(notificationResponse.unreadCount);
  }, []);

  useEffect(() => {
    void refreshAlarms().catch(() => undefined);
  }, [refreshAlarms]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void refreshAlarms().catch(() => undefined);
      }
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshAlarms]);

  const handleReadVisibleUnreadAlarms = useCallback(async () => {
    const alarmsToRead = alarms.filter((alarm) => {
      const isPendingFollowRequest =
        alarm.type === "FOLLOW_REQUEST" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";
      const isPendingCategoryInvite =
        alarm.type === "CATEGORY_INVITE" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";

      return (
        !alarm.isRead &&
        !isPendingFollowRequest &&
        !isPendingCategoryInvite
      );
    });

    if (!alarmsToRead.length) {
      return;
    }

    const notificationIdsToRead = alarmsToRead.flatMap(
      ({ unreadNotificationIds }) => unreadNotificationIds,
    );

    await Promise.all(notificationIdsToRead.map(readAlarm));

    const readIds = new Set(alarmsToRead.map(({ id }) => id));
    setAlarms((previous) =>
      previous.map((alarm) =>
        readIds.has(alarm.id)
          ? { ...alarm, isRead: true, unreadNotificationIds: [] }
          : alarm,
      ),
    );
    setUnreadCount((previous) =>
      Math.max(0, previous - notificationIdsToRead.length),
    );
  }, [alarms]);

  const handleDeleteAlarm = async (alarmId: number) => {
    const alarm = alarms.find(({ id }) => id === alarmId);
    const isPendingFollowRequest =
      alarm?.type === "FOLLOW_REQUEST" &&
      (alarm.followStatus ?? "PENDING") === "PENDING";
    const isPendingCategoryInvite =
      alarm?.type === "CATEGORY_INVITE" &&
      (alarm.followStatus ?? "PENDING") === "PENDING";

    if (!alarm || isPendingFollowRequest || isPendingCategoryInvite) {
      return;
    }

    await Promise.all(alarm.notificationIds.map(deleteAlarm));
    setAlarms((previous) =>
      previous.filter(({ id }) => id !== alarmId),
    );

    if (!alarm.isRead) {
      setUnreadCount((previous) =>
        Math.max(0, previous - alarm.unreadNotificationIds.length),
      );
    }
  };

  const handleDeleteAllAlarms = async () => {
    const alarmsToDelete = alarms.filter((alarm) => {
      const isPendingFollowRequest =
        alarm.type === "FOLLOW_REQUEST" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";
      const isPendingCategoryInvite =
        alarm.type === "CATEGORY_INVITE" &&
        (alarm.followStatus ?? "PENDING") === "PENDING";

      return (
        !isPendingFollowRequest &&
        !isPendingCategoryInvite
      );
    });

    if (!alarmsToDelete.length) {
      return;
    }

    await Promise.all(
      alarmsToDelete.flatMap((alarm) =>
        alarm.notificationIds.map(deleteAlarm),
      ),
    );

    const deletedIds = new Set(alarmsToDelete.map(({ id }) => id));
    setAlarms((previous) =>
      previous.filter(({ id }) => !deletedIds.has(id)),
    );
    const deletedUnreadCount = alarmsToDelete.reduce(
      (count, alarm) => count + alarm.unreadNotificationIds.length,
      0,
    );
    setUnreadCount((previous) =>
      Math.max(0, previous - deletedUnreadCount),
    );
  };

  const handleRespondFollowRequest = async (
    alarmId: number,
    action: FollowRequestAction,
  ) => {
    const alarm = alarms.find(({ id }) => id === alarmId);
    const followId = alarm?.friendRequestId;

    if (!alarm || !followId) {
      return;
    }

    if (action === "ACCEPT") {
      await acceptFollowRequest(followId);
    } else {
      await deleteFollow(followId);
    }

    notifyFollowUpdated();

    if (!alarm.isRead) {
      await readAlarm(alarmId);
      setUnreadCount((previous) => Math.max(0, previous - 1));
    }

    setAlarms((previous) =>
      previous.map((item) =>
        item.id === alarmId
          ? {
              ...item,
              isRead: true,
              unreadNotificationIds: [],
              followStatus:
                action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
              content:
                action === "ACCEPT"
                  ? `${item.user?.nickname ?? "상대"}님의 팔로우 요청을 수락했어요`
                  : `${item.user?.nickname ?? "상대"}님의 팔로우 요청을 거절했어요`,
            }
          : item,
      ),
    );
  };

  const handleRespondCategoryInvite = async (
    alarmId: number,
    action: CategoryInviteAction,
  ) => {
    const alarm = alarms.find(({ id }) => id === alarmId);
    const categoryId = alarm?.relatedId;

    if (!alarm || !categoryId) {
      return;
    }

    let wasAlreadyHandled = false;

    try {
      await respondCategoryInvite(String(categoryId), action);
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        error.code === "COMMON_NOT_FOUND"
      ) {
        wasAlreadyHandled = true;
      } else {
        throw error;
      }
    }

    if (action === "ACCEPT") {
      notifyCalendarUpdated();
    }

    setAlarms((previous) =>
      previous.map((item) =>
        item.id === alarmId
          ? {
              ...item,
              isRead: true,
              unreadNotificationIds: [],
              followStatus:
                action === "ACCEPT" ? "ACCEPTED" : "REJECTED",
              content: wasAlreadyHandled
                ? "공유 카테고리 초대가 이미 처리되었어요"
                : action === "ACCEPT"
                  ? "공유 카테고리 초대를 수락했어요"
                  : "공유 카테고리 초대를 거절했어요",
            }
          : item,
      ),
    );

    if (!alarm.isRead) {
      setUnreadCount((previous) =>
        Math.max(0, previous - alarm.unreadNotificationIds.length),
      );
    }

    await Promise.all(alarm.notificationIds.map(readAlarm)).catch(
      () => undefined,
    );
  };

  return {
    alarms,
    unreadCount,
    refreshAlarms,
    handleReadVisibleUnreadAlarms,
    handleDeleteAlarm,
    handleDeleteAllAlarms,
    handleRespondFollowRequest,
    handleRespondCategoryInvite,
  };
};
