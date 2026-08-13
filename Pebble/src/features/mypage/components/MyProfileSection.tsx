import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";

type MyProfileSectionProps = {
  isCompact: boolean;
  pebbleCount: number;
  completedCategoryCount: number;
  onEditProfile: () => void;
};

export const MyProfileSection = ({
  isCompact,
  pebbleCount,
  completedCategoryCount,
  onEditProfile,
}: MyProfileSectionProps): JSX.Element => {
  const profile = useProfileStore((state) => state.profile);

  return (
    <header
      className={`sticky top-0 z-40 bg-fill-inverse transition-[height] duration-[220ms] ease-out ${
        isCompact ? "h-[220px]" : "h-[340px]"
      }`}
    >
      <div
        className={`absolute inset-0 transition-[opacity,transform] duration-[220ms] ease-out ${
          isCompact
            ? "pointer-events-none -translate-y-2 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
        aria-hidden={isCompact}
      >
        <div className="absolute left-1/2 top-[110px] flex size-40 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-theme-2-base text-text-strong">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={`${profile.nickname}님의 프로필`}
              className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
            />
          ) : (
            <MySolidIcon className="size-20" />
          )}
        </div>

        <div className="absolute left-0 top-[286px] w-full text-center">
          <h1 className="text-title-03-sb text-text-strong">
            {profile.nickname}
          </h1>
          <p className="mt-1 text-body-02-m text-text-teritary">
            {profile.bio}
          </p>
        </div>

        <div className="absolute left-1/2 top-6 w-full max-w-[640px] -translate-x-1/2 sm:top-[110px]">
          <button
            type="button"
            onClick={onEditProfile}
            className="absolute right-0 h-12 rounded-token-s border border-border-default px-5 text-body-02-m text-text-secondary hover:bg-fill-surface"
          >
            프로필 편집
          </button>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 top-[110px] transition-[opacity,transform] duration-[220ms] ease-out ${
          isCompact
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        aria-hidden={!isCompact}
      >
        <div className="mx-auto flex w-full max-w-[640px] items-center">
          <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-theme-2-base text-text-strong">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={`${profile.nickname}님의 프로필`}
                className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
              />
            ) : (
              <MySolidIcon className="size-14" />
            )}
          </div>

          <div className="ml-4 min-w-0 flex-1 text-left">
            <h1 className="text-title-02-sb text-text-strong">
              {profile.nickname}
            </h1>
            <p className="mt-1 truncate text-body-01-m text-text-teritary">
              {profile.bio}
            </p>
          </div>

          <div className="ml-3 hidden h-16 shrink-0 items-center rounded-[20px] bg-btn-quaternary px-4 shadow-shadow-m sm:flex lg:ml-6 lg:px-6">
            <div className="flex items-center gap-2">
              <span className="text-body-02-m text-text-secondary">조약돌</span>
              <strong className="text-title-03-sb text-text-strong">
                {pebbleCount}
              </strong>
            </div>
            <div
              className="mx-4 h-8 w-px bg-border-default"
              aria-hidden="true"
            />
            <div className="flex items-center gap-2">
              <span className="text-body-02-m text-text-secondary">카테고리</span>
              <strong className="text-title-03-sb text-text-strong">
                {completedCategoryCount}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
