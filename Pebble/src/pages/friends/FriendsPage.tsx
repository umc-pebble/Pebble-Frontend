import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { Toast } from "@/components/ui/Toast";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { FriendsListView } from "@/features/friends/components/FriendsListView";
import { FriendSearchView } from "@/features/friends/components/FriendSearchView";
import { useFriendsPage } from "@/features/friends/hooks/useFriendsPage";

export default function FriendsPage(): JSX.Element {
  const { isSidebarOpen } = useCalendarLayoutContext();
  const {
    acceptRequest,
    activeTab,
    cancelRequest,
    deleteFriend,
    errorMessage,
    friends,
    isListLoading,
    isSearching,
    isToastVisible,
    normalizedSearchQuery,
    pendingRequests,
    processingId,
    rejectRequest,
    searchQuery,
    searchResults,
    sendFollow,
    sentRequests,
    setActiveTab,
    setSearchQuery,
    toastMessage,
  } = useFriendsPage();

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      } max-xl:h-[calc(100vh-116px)] max-xl:w-full max-xl:min-h-[560px]`}
    >
      <button
        type="button"
        onClick={() => window.history.back()}
        className="absolute left-3 top-5 z-20 flex size-11 items-center justify-center rounded-token-s text-text-strong transition-colors hover:bg-fill-surface sm:left-6 sm:top-10"
        aria-label="이전 페이지로 돌아가기"
      >
        <ChevronLeftIcon className="size-6" />
      </button>

      <div className="h-full overflow-y-auto px-4 pb-8 sm:px-8 sm:pb-12 lg:px-[72px] custom-scrollbar">
        <div className="mx-auto w-full max-w-[780px] pt-5 sm:pt-10">
          <div className="relative flex h-12 items-center justify-center">
            <div className="grid h-12 w-64 grid-cols-2 gap-1 rounded-token-s bg-btn-quaternary p-1">
              {(["friends", "search"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-[9px] px-3 py-2 text-body-02-m transition-colors ${
                    activeTab === tab
                      ? "bg-fill-inverse text-text-primary shadow-[0px_0px_4px_rgba(23,23,23,0.1)]"
                      : "text-text-teritary"
                  }`}
                >
                  {tab === "friends" ? "모든 친구" : "친구 찾기"}
                </button>
              ))}
            </div>
          </div>

          {errorMessage ? (
            <p
              role="alert"
              className="mx-auto mt-6 rounded-token-s bg-fill-surface px-4 py-3 text-body-03-r text-fill-danger"
            >
              {errorMessage}
            </p>
          ) : null}

          {activeTab === "friends" ? (
            <FriendsListView
              friends={friends}
              isLoading={isListLoading}
              pendingRequests={pendingRequests}
              processingId={processingId}
              sentRequests={sentRequests}
              onAccept={acceptRequest}
              onCancel={cancelRequest}
              onDelete={deleteFriend}
              onReject={rejectRequest}
            />
          ) : (
            <FriendSearchView
              friends={friends}
              isSearching={isSearching}
              normalizedSearchQuery={normalizedSearchQuery}
              processingId={processingId}
              searchQuery={searchQuery}
              searchResults={searchResults}
              onDelete={deleteFriend}
              onSearchQueryChange={setSearchQuery}
              onSendFollow={sendFollow}
            />
          )}
        </div>
      </div>

      <Toast
        message={toastMessage}
        open={isToastVisible}
        className="absolute bottom-6 right-6 z-20"
      />
    </section>
  );
}
