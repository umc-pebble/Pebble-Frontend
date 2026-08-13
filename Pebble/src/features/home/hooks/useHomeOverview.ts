import { useCallback, useEffect, useState } from "react";

import {
  getAllFollows,
  markFriendScheduleViewed,
  type FollowListItem,
} from "@/features/friends/api/followApi";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";
import {
  getActivityLogs,
  normalizeActivityLogsResponse,
  type ActivityLogItem,
} from "@/features/activity";
import { getMySettings } from "@/features/settings/api/settingsApi";

type HomeActivity = {
  color: string;
  logs: ActivityLogItem[];
};

const DEFAULT_ACTIVITY: HomeActivity = {
  color: "#A3A3A3",
  logs: [],
};

export const useHomeOverview = (viewedUserId: number | null) => {
  const profile = useProfileStore((state) => state.profile);
  const isProfileLoaded = useProfileStore((state) => state.isLoaded);
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const [friends, setFriends] = useState<FollowListItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [activity, setActivity] = useState<HomeActivity>(DEFAULT_ACTIVITY);

  useEffect(() => {
    if (!isProfileLoaded) {
      void loadProfile();
    }
  }, [isProfileLoaded, loadProfile]);

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getAllFollows("friends"),
      getAllFollows("pending"),
    ])
      .then(([friendList, pendingList]) => {
        if (!isActive) return;

        setFriends(friendList);
        setPendingCount(pendingList.length);
      })
      .catch(() => {
        if (!isActive) return;

        setFriends([]);
        setPendingCount(0);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const activityUserId = viewedUserId ?? profile.id;

    if (!activityUserId) return;

    let isActive = true;

    setActivity(DEFAULT_ACTIVITY);

    void Promise.allSettled([
      getActivityLogs({ userId: activityUserId }),
      viewedUserId === null ? getMySettings() : Promise.resolve(null),
    ]).then(([activityResult, settingsResult]) => {
      if (!isActive) return;

      const normalizedActivity =
        activityResult.status === "fulfilled"
          ? normalizeActivityLogsResponse(activityResult.value)
          : null;

      setActivity({
        color:
          viewedUserId === null &&
          settingsResult.status === "fulfilled" &&
          settingsResult.value
            ? settingsResult.value.activityColor
            : normalizedActivity
              ? normalizedActivity.activityColor
              : DEFAULT_ACTIVITY.color,
        logs: normalizedActivity?.logs ?? DEFAULT_ACTIVITY.logs,
      });
    });

    return () => {
      isActive = false;
    };
  }, [profile.id, viewedUserId]);

  const markScheduleViewed = useCallback(async (userId: number) => {
    await markFriendScheduleViewed(userId);
    setFriends((currentFriends) =>
      currentFriends.map((friend) =>
        friend.userId === userId
          ? { ...friend, hasUnviewedSchedule: false }
          : friend,
      ),
    );
  }, []);

  return {
    profile,
    friends,
    pendingCount,
    activity,
    markScheduleViewed,
  };
};
