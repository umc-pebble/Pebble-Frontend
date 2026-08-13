import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import {
  getBridgeColorByCompletedTaskCount,
  type DailyBridgeActivity,
} from "@/features/settings/utils/bridgeActivity";
import { getBridgePaletteByActivityColor } from "@/features/settings/constants/bridgeColorPalettes";

type HomeOverviewCardsProps = {
  profile: {
    nickname: string;
    bio: string;
    imageUrl: string | null;
  };
  profileLabel: "나" | "친구";
  activityColor: string;
  activities: DailyBridgeActivity[];
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getRecentActivities = (activities: DailyBridgeActivity[]) => {
  const activityMap = new Map(
    activities.map((activity) => [activity.date.slice(0, 10), activity]),
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = toDateKey(date);

    return (
      activityMap.get(dateKey) ?? {
        date: dateKey,
        completedTaskCount: 0,
      }
    );
  });
};

export const HomeOverviewCards = ({
  profile,
  profileLabel,
  activityColor,
  activities,
}: HomeOverviewCardsProps): JSX.Element => {
  const palette = getBridgePaletteByActivityColor(activityColor);
  const recentActivities = getRecentActivities(activities);

  return (
    <div className="grid grid-cols-1 gap-token-m lg:h-[140px] lg:grid-cols-[383px_minmax(0,1fr)]">
      <section className="flex h-[140px] items-center gap-token-l rounded-token-m bg-fill-inverse px-6 py-[34px] shadow-shadow-m max-sm:h-auto max-sm:min-h-[140px] max-sm:gap-token-m max-sm:px-4 max-sm:py-6">
        <div className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-token-infinite bg-fill-teritory text-text-secondary">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={`${profile.nickname}님의 프로필`}
              className="size-full object-cover"
            />
          ) : (
            <MySolidIcon className="size-9" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-token-s">
            <span className="rounded-token-l border border-border-default bg-btn-quaternary px-token-m py-token-xs text-body-02-sb text-text-secondary">
              {profileLabel}
            </span>
            <h1 className="truncate text-title-03-sb text-text-strong">
              {profile.nickname || "사용자"}
            </h1>
          </div>
          <p className="mt-token-xs truncate text-body-03-r text-text-teritary">
            {profile.bio ||
              (profileLabel === "나"
                ? "한 줄 소개를 작성해보세요."
                : "작성한 한 줄 소개가 없어요.")}
          </p>
        </div>
      </section>

      <section className="flex h-[140px] flex-col justify-center rounded-token-m bg-fill-inverse p-token-l shadow-shadow-m">
        <h2 className="text-title-03-sb text-text-strong">
          최근 7일의 징검다리
        </h2>

        <div className="mt-token-s flex min-h-0 flex-1 flex-col gap-token-xs">
          <div className="flex min-h-0 flex-1 gap-token-s">
            {recentActivities.map((activity) => (
              <span
                key={activity.date}
                className="min-w-0 flex-1 rounded-token-s border border-transparent"
                style={{
                  backgroundColor: getBridgeColorByCompletedTaskCount({
                    completedTaskCount: activity.completedTaskCount,
                    palette,
                  }),
                  borderColor:
                    activity.completedTaskCount === 0 ? "#D4D4D4" : undefined,
                }}
                title={`${activity.date}: 완료 ${activity.completedTaskCount}개`}
              />
            ))}
          </div>
          <div className="flex h-6 justify-between text-body-03-r text-text-teritary">
            <span>7일 전</span>
            <span>오늘</span>
          </div>
        </div>
      </section>
    </div>
  );
};
