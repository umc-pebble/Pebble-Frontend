import type { Friend } from "@/features/category/types";

type CategoryMemberListProps = {
  members: Friend[];
  currentUserId?: number | null;
  onRemoveMember: (member: Friend) => void;
  onLeaveCategory?: () => void | Promise<void>;
};

export const CategoryMemberList = ({
  members,
  currentUserId,
  onRemoveMember,
  onLeaveCategory,
}: CategoryMemberListProps) => {
  const getMemberLabel = (member: Friend) =>
    member.uniqueTag ? `${member.name}#${member.uniqueTag}` : member.name;

  if (members.length === 0) {
    return null;
  }

  return (
    <div className="flex max-h-40 w-full flex-col items-start overflow-y-auto overflow-x-hidden rounded-token-s border border-border-secondary bg-fill-surface px-token-m py-token-s dark:bg-[#17171766]">
      {members.map((member) => {
        const canRemoveMember = member.role !== "OWNER";
        const isCurrentUser = currentUserId === member.id;

        return (
          <div
            key={member.id}
            className="flex h-14 w-full shrink-0 items-center gap-5 overflow-hidden rounded-token-s px-token-s py-token-xs"
          >
          <div className="flex min-w-0 flex-1 items-center gap-token-s overflow-hidden rounded-token-s">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt=""
                className="size-10 shrink-0 rounded-token-infinite border border-border-secondary object-cover"
              />
            ) : (
              <div className="size-10 shrink-0 rounded-token-infinite border border-border-secondary bg-border-default" />
            )}

            <span className="min-w-0 flex-1 truncate text-body-01-m tracking-[-0.18px] text-text-strong">
              {getMemberLabel(member)}
            </span>
          </div>

            {canRemoveMember && (
              <button
                type="button"
                className="flex h-12 shrink-0 items-center justify-center rounded-token-s bg-fill-danger-bg px-token-xl py-token-m text-body-02-m tracking-[-0.16px] text-fill-danger"
                onClick={() => {
                  if (isCurrentUser && onLeaveCategory) {
                    void onLeaveCategory();
                    return;
                  }

                  onRemoveMember(member);
                }}
                aria-label={`${member.name} 구성원 탈퇴`}
              >
                탈퇴
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
