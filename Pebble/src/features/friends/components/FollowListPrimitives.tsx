import type { ReactNode } from "react";

import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import type { FollowUser } from "@/features/friends/api/followApi";

export const FollowSection = ({
  title,
  count,
  className = "",
  children,
}: {
  title: string;
  count: number;
  className?: string;
  children: ReactNode;
}) => (
  <section className={className}>
    <h2 className="text-body-02-m text-text-teritary">
      {title} ({count})
    </h2>
    <div className="mt-5 flex flex-col gap-5">{children}</div>
  </section>
);

export const FollowRow = ({
  user,
  secondaryText,
  children,
}: {
  user: FollowUser;
  secondaryText?: string | null;
  children?: ReactNode;
}) => (
  <div className="group relative flex min-h-[88px] w-full flex-col items-stretch gap-3 overflow-hidden rounded-token-m p-3 transition-colors hover:bg-[rgba(23,23,23,0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-0">
    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5 sm:pr-5">
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-teritory bg-fill-surface text-text-secondary sm:size-16">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={`${user.nickname}님의 프로필`}
            className="size-full object-cover"
          />
        ) : (
          <MySolidIcon className="size-6 sm:size-8" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-body-01-sb text-text-strong">{user.nickname}</p>
        {secondaryText ? (
          <p className="mt-1 text-body-03-r text-text-teritary">
            {secondaryText}
          </p>
        ) : null}
      </div>
    </div>
    <div className="ml-auto flex shrink-0 gap-2 sm:gap-3">{children}</div>
  </div>
);

export const FollowStatusMessage = ({
  title,
  message,
}: {
  title?: string;
  message: string;
}) => (
  <div
    className="flex h-[500px] flex-col items-center justify-center text-center"
    aria-live="polite"
  >
    <SearchIcon className="size-16 text-border-default" />
    {title ? (
      <p className="mt-6 text-title-03-sb text-text-secondary">{title}</p>
    ) : null}
    <p
      className={`${title ? "mt-2" : "mt-6"} text-body-02-r text-text-teritary`}
    >
      {message}
    </p>
  </div>
);
