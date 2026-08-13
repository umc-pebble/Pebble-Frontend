import type { SharedFriend, SharedFriends } from '../types/report';
import { EmptyState } from '../components/EmptyState';
import defaultProfile from '@/assets/profiles/profile1.png';

interface SharedFriendsSectionProps {
  /** 서버 값: sharedFriends */
  sharedFriends: SharedFriends;
  /** 서버 값: reportMonth — 제목 "6월의 친구들이에요" */
  month: number;
  darkTheme?: boolean;
}

const MAX_DETAIL_FRIENDS = 3;
const MAX_AVATAR_FRIENDS = 7;

function FriendAvatar({ friend }: { friend: SharedFriend }) {
  const avatarSrc = friend.avatarUrl || defaultProfile;

  return (
    <img
      src={avatarSrc}
      alt={`${friend.nickname} 프로필`}
      crossOrigin={friend.avatarUrl ? 'anonymous' : undefined}
      className="h-[40px] w-[40px] shrink-0 rounded-full border-[0.5px] border-[#D4D4D4] object-cover"
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = defaultProfile;
      }}
    />
  );
}

/** 친구 한 줄 */
function FriendRow({
  friend,
  darkTheme = false,
}: {
  friend: SharedFriend;
  darkTheme?: boolean;
}) {
  return (
    <li
      className={`flex h-[56px] items-center overflow-hidden rounded-[12px] bg-white p-[8px] ${
        darkTheme ? 'dark:bg-fill-inverse' : ''
      }`}
    >
      {/* 프로필 이미지 — 서버 값(avatarUrl).
          crossOrigin 이 있어야 R007 이미지 저장에서 아바타가 함께 구워집니다.
          CDN 이 Access-Control-Allow-Origin 을 내려주지 않으면 빈 칸으로 저장됩니다. */}
      <FriendAvatar friend={friend} />

      <span className="ml-[12px] flex min-w-0 flex-1 flex-col justify-center leading-[150%]">
        {/* 공유 카테고리 이름 — 서버 값(categoryName) */}
        {friend.categoryName && (
          <span
            className={`truncate text-[14px] font-medium tracking-[-0.14px] text-[#A3A3A3] ${
              darkTheme ? 'dark:text-text-teritary' : ''
            }`}
          >
            {friend.categoryName}
          </span>
        )}
        {/* 닉네임 — 서버 값(nickname) */}
        <span
          className={`truncate text-[18px] font-medium tracking-[-0.18px] text-[#171717] ${
            darkTheme ? 'dark:text-text-strong' : ''
          }`}
        >
          {friend.nickname}
        </span>
      </span>
    </li>
  );
}

/** R006 — 공유 카테고리를 함께한 친구들 */
export function SharedFriendsSection({
  sharedFriends,
  month,
  darkTheme = false,
}: SharedFriendsSectionProps) {
  const { sharedCategoryCount, friends } = sharedFriends;
  // 서버가 공유 카테고리 중첩 수와 수락 순서 기준으로 정렬한 순서를 보존합니다.
  const detailFriends = friends.slice(0, MAX_DETAIL_FRIENDS);
  // 상세 카드 3명을 제외한 다음 친구부터 프로필 이미지로 최대 7명 표시합니다.
  const avatarFriends = friends.slice(
    MAX_DETAIL_FRIENDS,
    MAX_DETAIL_FRIENDS + MAX_AVATAR_FRIENDS,
  );
  const visibleFriendCount = detailFriends.length + avatarFriends.length;
  const hiddenFriendCount = friends.length - visibleFriendCount;
  const hasAvatarSummary = friends.length >= 4;

  return (
    <div className="flex h-full w-full flex-col gap-[20px]">
      <div className="flex flex-col gap-[8px]">
        <p
          className={`text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3] ${
            darkTheme ? 'dark:text-text-teritary' : ''
          }`}
        >
          공유 카테고리를 함께한
        </p>

        {/* 월 — 서버 값(reportMonth) */}
        <h2
          className={`text-[40px] font-bold leading-[150%] tracking-[-0.4px] text-[#404040] ${
            darkTheme ? 'dark:text-text-primary' : ''
          }`}
        >
          {month}월의 친구들이에요
        </h2>
      </div>

      {/* 공유 카테고리 수 — 서버 값(sharedCategoryCount) */}
      <p
        className={`flex h-[40px] w-full items-center rounded-[999px] bg-[#FAFAFA] px-[20px] text-[16px] font-semibold leading-[150%] tracking-[-0.16px] text-[#A3A3A3] ${
          darkTheme
            ? 'dark:bg-[rgba(23,23,23,0.7)] dark:text-text-teritary'
            : ''
        }`}
      >
        공유 카테고리 {sharedCategoryCount.toLocaleString('ko-KR')}개
      </p>

      {friends.length === 0 ? (
        <EmptyState
          className="flex-1"
          message="저번 달에는 함께한 친구가 없어요."
          darkTheme={darkTheme}
        />
      ) : (
        <ul className="flex min-h-0 flex-col gap-[12px]">
          {detailFriends.map((friend) => (
            <FriendRow
              key={friend.id}
              friend={friend}
              darkTheme={darkTheme}
            />
          ))}

          {hasAvatarSummary ? (
            <li className="flex h-[40px] w-full items-center justify-between gap-[12px] rounded-[999px]">
              <span className="flex min-w-0 items-center">
                {avatarFriends.map((friend, index) => (
                  <span
                    key={friend.id}
                    className={index === 0 ? '' : '-ml-[4px]'}
                  >
                    <FriendAvatar friend={friend} />
                  </span>
                ))}
              </span>

              {hiddenFriendCount > 0 ? (
                <span
                  className={`shrink-0 text-[16px] font-semibold leading-[150%] tracking-[-0.16px] text-[#A3A3A3] ${
                    darkTheme ? 'dark:text-text-teritary' : ''
                  }`}
                >
                  + {hiddenFriendCount.toLocaleString('ko-KR')}명
                </span>
              ) : null}
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
