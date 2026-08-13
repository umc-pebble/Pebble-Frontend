import type { FollowListItem } from "@/features/friends/api/followApi";

import { FriendDeleteButton } from "./FriendDeleteButton";
import {
  FollowRow,
  FollowSection,
  FollowStatusMessage,
} from "./FollowListPrimitives";

type FriendsListViewProps = {
  friends: FollowListItem[];
  isLoading: boolean;
  pendingRequests: FollowListItem[];
  processingId: number | null;
  sentRequests: FollowListItem[];
  onAccept: (request: FollowListItem) => Promise<void>;
  onCancel: (request: FollowListItem) => Promise<void>;
  onDelete: (friend: FollowListItem) => Promise<void>;
  onReject: (request: FollowListItem) => Promise<void>;
};

export const FriendsListView = ({
  friends,
  isLoading,
  pendingRequests,
  processingId,
  sentRequests,
  onAccept,
  onCancel,
  onDelete,
  onReject,
}: FriendsListViewProps) => {
  if (isLoading) {
    return (
      <div className="mt-14">
        <FollowStatusMessage message="친구 목록을 불러오는 중이에요..." />
      </div>
    );
  }

  return (
    <div className="mt-14">
      {pendingRequests.length > 0 ? (
        <FollowSection title="친구 요청" count={pendingRequests.length}>
          {pendingRequests.map((request) => (
            <FollowRow
              key={request.followId}
              user={request}
              secondaryText={request.bio}
            >
              <button
                type="button"
                disabled={processingId === request.followId}
                onClick={() => void onAccept(request)}
                className="h-11 min-w-[72px] rounded-token-s bg-btn-primary px-4 py-2 text-body-02-m text-text-onFill disabled:opacity-50 sm:h-12 sm:min-w-[92px] sm:px-8 sm:py-3"
              >
                수락
              </button>
              <button
                type="button"
                disabled={processingId === request.followId}
                onClick={() => void onReject(request)}
                className="h-11 min-w-[72px] rounded-token-s bg-btn-quaternary px-4 py-2 text-body-02-m text-text-strong disabled:opacity-50 sm:h-12 sm:min-w-[92px] sm:px-8 sm:py-3"
              >
                거절
              </button>
            </FollowRow>
          ))}
        </FollowSection>
      ) : null}

      {sentRequests.length > 0 ? (
        <FollowSection title="보낸 요청" count={sentRequests.length} className="mt-12">
          {sentRequests.map((request) => (
            <FollowRow
              key={request.followId}
              user={request}
              secondaryText={request.bio}
            >
              <button
                type="button"
                disabled={processingId === request.followId}
                onClick={() => void onCancel(request)}
                className="h-11 min-w-[96px] rounded-token-s bg-btn-quaternary px-4 py-2 text-body-02-m text-text-strong disabled:opacity-50 sm:h-12 sm:min-w-[116px] sm:px-8 sm:py-3"
              >
                요청 취소
              </button>
            </FollowRow>
          ))}
        </FollowSection>
      ) : null}

      <FollowSection
        title="내 친구"
        count={friends.length}
        className={
          pendingRequests.length > 0 || sentRequests.length > 0 ? "mt-12" : ""
        }
      >
        {friends.map((friend) => (
          <FollowRow
            key={friend.followId}
            user={friend}
            secondaryText={friend.bio}
          >
            <FriendDeleteButton
              nickname={friend.nickname}
              disabled={processingId === friend.followId}
              onClick={() => void onDelete(friend)}
            />
          </FollowRow>
        ))}
      </FollowSection>
    </div>
  );
};
