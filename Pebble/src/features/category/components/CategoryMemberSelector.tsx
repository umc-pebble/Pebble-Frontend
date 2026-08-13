import type { Friend } from "@/features/category/types";

type CategoryMemberSelectorProps = {
  selectedMembers: Friend[];
  filteredFriends: Friend[];
  searchQuery: string;
  isDropdownOpen: boolean;
  showSelectedMembersInInput?: boolean;
  onSearchChange: (query: string) => void;
  onDropdownOpenChange: (isOpen: boolean) => void;
  onToggleMember: (member: Friend) => void;
};

export const CategoryMemberSelector = ({
  selectedMembers,
  filteredFriends,
  searchQuery,
  isDropdownOpen,
  showSelectedMembersInInput = true,
  onSearchChange,
  onDropdownOpenChange,
  onToggleMember,
}: CategoryMemberSelectorProps) => {
  const hasSelectedMembersInInput =
    showSelectedMembersInInput && selectedMembers.length > 0;
  const inputPlaceholder = hasSelectedMembersInInput
    ? ""
    : "닉네임 또는 이메일을 입력해 주세요";
  const getMemberLabel = (member: Friend) =>
    member.uniqueTag ? `${member.name}#${member.uniqueTag}` : member.name;

  return (
    <div
      className={[
        "relative flex w-full flex-col gap-2",
        isDropdownOpen ? "z-30" : "z-0",
      ].join(" ")}
    >
      <div
        className={[
          "flex min-h-12 w-full flex-wrap items-center gap-token-m rounded-token-s border py-token-m",
          hasSelectedMembersInInput ? "px-token-l" : "px-token-m",
          searchQuery
            ? "border-border-primary bg-fill-inverse"
            : isDropdownOpen
              ? "border-border-primary bg-fill-inverse"
              : "border-border-secondary bg-fill-surface dark:bg-fill-inverse",
        ].join(" ")}
      >
        {showSelectedMembersInInput && selectedMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-token-m rounded-token-infinite bg-fill-teritory p-token-s shadow-shadow-s dark:shadow-[0px_0px_4px_0px_rgba(23,23,23,0.1)]"
          >
            <div className="flex items-center gap-token-s">
              {member.profileImageUrl ? (
                <img
                  src={member.profileImageUrl}
                  alt=""
                  className="size-9 shrink-0 rounded-token-infinite border border-border-secondary object-cover"
                />
              ) : (
                <div className="size-9 shrink-0 rounded-token-infinite border border-border-secondary bg-border-default" />
              )}
              <span className="text-body-01-m tracking-[-0.18px] text-text-strong">
                {getMemberLabel(member)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleMember(member)}
              className="flex size-9 items-center justify-center rounded-token-s text-text-secondary transition-colors hover:bg-black/5 dark:text-btn-secondary"
              aria-label={`${member.name} 구성원 제거`}
            >
              <span className="text-title-03-m leading-none" aria-hidden="true">
                ×
              </span>
            </button>
          </div>
        ))}

        <div
          className={[
            "relative flex-1",
            hasSelectedMembersInInput ? "min-w-0" : "min-w-[220px]",
          ].join(" ")}
        >
          <input
            type="text"
            placeholder={inputPlaceholder}
            className="w-full bg-transparent text-body-02-m text-text-primary outline-none placeholder:text-text-quaternary"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            onFocus={() => onDropdownOpenChange(true)}
            onBlur={() => setTimeout(() => onDropdownOpenChange(false), 200)}
          />
        </div>
      </div>

      {isDropdownOpen && filteredFriends.length > 0 && (
        <div className="absolute top-full z-50 mt-2 flex max-h-48 w-full flex-col gap-token-m overflow-y-auto rounded-token-s border border-border-teritory bg-fill-inverse p-token-s shadow-[0px_2px_10px_0px_rgba(23,23,23,0.1)] dark:border-border-secondary">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex min-h-[60px] w-full items-center justify-between gap-token-l overflow-hidden rounded-token-s p-token-s transition-colors hover:bg-btn-pressed"
            >
              <button
                type="button"
                onClick={() => onToggleMember(friend)}
                className="flex min-w-0 flex-1 items-center gap-token-s text-left"
              >
                {friend.profileImageUrl ? (
                  <img
                    src={friend.profileImageUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-token-infinite border border-border-secondary object-cover"
                  />
                ) : (
                  <div className="size-10 shrink-0 rounded-token-infinite border border-border-secondary bg-border-default" />
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-body-01-m tracking-[-0.18px] text-text-strong">
                    {getMemberLabel(friend)}
                  </span>
                  {friend.email && (
                    <span className="truncate text-body-03-r text-text-teritary">
                      {friend.email}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onToggleMember(friend)}
                className="flex h-11 shrink-0 items-center justify-center rounded-token-s bg-btn-quaternary px-token-xl py-token-m text-body-02-m tracking-[-0.16px] text-text-secondary transition-colors hover:bg-btn-pressed"
                aria-label={`${friend.name} 구성원 추가`}
              >
                추가
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
