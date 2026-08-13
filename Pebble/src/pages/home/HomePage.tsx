import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { HomeOverviewCards } from "@/features/home/components/HomeOverviewCards";
import { HomeProfileStrip } from "@/features/home/components/HomeProfileStrip";
import { useHomeOverview } from "@/features/home/hooks/useHomeOverview";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const viewedRequestUserIdsRef = useRef<Set<number>>(new Set());
  const {
    isSidebarOpen,
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    selectedCalendarDate,
    onSelectCalendarDate,
    onClearSelectedCalendarDate,
    categories,
    currentUserId,
    standaloneTasks,
    viewedUserId,
    loadedViewedUserId,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
  } = useCalendarLayoutContext();
  const { profile, friends, pendingCount, activity, markScheduleViewed } =
    useHomeOverview(viewedUserId);
  const selectedUserId = viewedUserId ?? currentUserId ?? profile.id;
  const isFriendCalendarView = viewedUserId !== null;
  const selectedFriend = isFriendCalendarView
    ? friends.find((friend) => friend.userId === viewedUserId)
    : null;
  const overviewProfile = isFriendCalendarView
    ? {
        nickname: selectedFriend?.nickname ?? "친구",
        bio: selectedFriend?.bio ?? "",
        imageUrl: selectedFriend?.profileImageUrl ?? null,
      }
    : {
        nickname: profile.nickname,
        bio: profile.bio,
        imageUrl: profile.imageUrl,
      };

  useEffect(() => {
    if (
      viewedUserId === null ||
      loadedViewedUserId !== viewedUserId ||
      viewedRequestUserIdsRef.current.has(viewedUserId)
    ) {
      return;
    }

    const viewedFriend = friends.find(
      (friend) => friend.userId === viewedUserId,
    );

    if (!viewedFriend?.hasUnviewedSchedule) {
      return;
    }

    viewedRequestUserIdsRef.current.add(viewedUserId);

    void markScheduleViewed(viewedUserId).catch(() => {
      viewedRequestUserIdsRef.current.delete(viewedUserId);
    });
  }, [friends, loadedViewedUserId, markScheduleViewed, viewedUserId]);

  const handleOpenFriendCalendar = (friendId: number) => {
    navigate(`/?friendId=${friendId}`);
  };

  return (
    <section
      className={`flex w-full shrink-0 flex-col transition-all duration-300 xl:h-[1000px] ${
        isSidebarOpen ? "xl:w-[924px]" : "xl:w-[1316px]"
      }`}
    >
      <HomeProfileStrip
        profile={profile}
        friends={friends}
        pendingCount={pendingCount}
        selectedUserId={selectedUserId}
        isMyCalendarSelected={!isFriendCalendarView}
        onOpenMyCalendar={() => navigate("/")}
        onOpenFriends={() => navigate("/friends")}
        onOpenFriendCalendar={(friend) => handleOpenFriendCalendar(friend.userId)}
      />

      <div className="mt-4 sm:mt-6">
        <HomeOverviewCards
          profile={overviewProfile}
          profileLabel={isFriendCalendarView ? "친구" : "나"}
          activityColor={activity.color}
          activities={activity.logs}
        />
      </div>

      <div className="mt-4 min-w-0">
        <CalendarBoard
          variant="home"
          isSidebarOpen={isSidebarOpen}
          categories={categories}
          standaloneTasks={standaloneTasks}
          currentYear={currentYear}
          currentMonth={currentMonth}
          onChangeCalendarMonth={onChangeCalendarMonth}
          selectedDate={selectedCalendarDate}
          onSelectDate={onSelectCalendarDate}
          onClearSelectedDate={onClearSelectedCalendarDate}
          isLoading={isCalendarLoading}
          errorMessage={calendarErrorMessage}
          emptyTitle={
            isFriendCalendarView
              ? "아직 친구가 일정을 생성하지 않았어요."
              : undefined
          }
          onRetry={reloadCalendarData}
        />
      </div>
    </section>
  );
};

export default HomePage;
