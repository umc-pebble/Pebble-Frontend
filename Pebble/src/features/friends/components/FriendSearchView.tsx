import ClearIcon from "@/assets/icons/Close.svg?react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import type {
  FollowListItem,
  SearchedUser,
} from "@/features/friends/api/followApi";

import { FriendDeleteButton } from "./FriendDeleteButton";
import { FollowRow, FollowStatusMessage } from "./FollowListPrimitives";

type FriendSearchViewProps = {
  friends: FollowListItem[];
  isSearching: boolean;
  normalizedSearchQuery: string;
  processingId: number | null;
  searchQuery: string;
  searchResults: SearchedUser[];
  onDelete: (friend: FollowListItem) => Promise<void>;
  onSearchQueryChange: (query: string) => void;
  onSendFollow: (user: SearchedUser) => Promise<void>;
};

export const FriendSearchView = ({
  friends,
  isSearching,
  normalizedSearchQuery,
  processingId,
  searchQuery,
  searchResults,
  onDelete,
  onSearchQueryChange,
  onSendFollow,
}: FriendSearchViewProps) => (
  <section className="mt-14" aria-labelledby="friend-search-heading">
    <h2 id="friend-search-heading" className="sr-only">
      친구 찾기
    </h2>
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder="닉네임 또는 이메일로 찾을 수 있어요"
        className="h-14 w-full rounded-token-s border border-border-default bg-fill-inverse pl-12 pr-12 text-body-02-m text-text-strong outline-none transition-colors placeholder:text-text-teritary focus:border-text-secondary"
        aria-label="친구 닉네임 또는 이메일 검색"
      />
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-text-teritary" />
      {searchQuery ? (
        <button
          type="button"
          onClick={() => onSearchQueryChange("")}
          className="absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-text-teritary text-text-onFill hover:bg-text-secondary"
          aria-label="검색어 지우기"
        >
          <ClearIcon className="size-3" />
        </button>
      ) : null}
    </div>

    {!normalizedSearchQuery ? (
      <FollowStatusMessage
        title="친구를 검색해 보세요"
        message="닉네임 또는 이메일로 찾을 수 있어요"
      />
    ) : isSearching ? (
      <FollowStatusMessage message="사용자를 검색하는 중이에요..." />
    ) : searchResults.length > 0 ? (
      <div className="mt-10 flex flex-col gap-5" aria-live="polite">
        <p className="text-body-02-m text-text-teritary">
          검색 결과 ({searchResults.length})
        </p>
        {searchResults.map((user) => {
          const friend = friends.find(({ userId }) => userId === user.userId);

          return (
            <FollowRow key={user.userId} user={user}>
              {user.followStatus === "NONE" ? (
                <button
                  type="button"
                  disabled={processingId === user.userId}
                  onClick={() => void onSendFollow(user)}
                  className="h-11 rounded-token-s bg-btn-primary px-4 py-2 text-body-02-m text-text-onFill disabled:opacity-50 sm:h-12 sm:px-8 sm:py-3"
                >
                  친구 신청
                </button>
              ) : null}
              {user.followStatus === "PENDING" ? (
                <button
                  type="button"
                  disabled
                  className="h-11 min-w-[80px] rounded-token-s bg-btn-quaternary px-4 py-2 text-body-02-m text-text-strong sm:h-12 sm:min-w-[96px] sm:px-8 sm:py-3"
                >
                  요청 중
                </button>
              ) : null}
              {user.followStatus === "ACCEPTED" && friend ? (
                <FriendDeleteButton
                  nickname={user.nickname}
                  disabled={processingId === friend.followId}
                  onClick={() => void onDelete(friend)}
                />
              ) : null}
            </FollowRow>
          );
        })}
      </div>
    ) : (
      <FollowStatusMessage
        title="검색 결과가 없어요"
        message="닉네임 또는 이메일로 찾을 수 있어요"
      />
    )}
  </section>
);
