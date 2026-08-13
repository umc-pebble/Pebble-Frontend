import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { ProfileEditForm } from "@/features/mypage/components/ProfileEditForm";
import { ProfileImageEditor } from "@/features/mypage/components/ProfileImageEditor";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { isSidebarOpen } = useCalendarLayoutContext();
  const profile = useProfileStore((state) => state.profile);
  const isLoaded = useProfileStore((state) => state.isLoaded);
  const loadProfile = useProfileStore((state) => state.loadProfile);

  useEffect(() => {
    if (!isLoaded) {
      void loadProfile();
    }
  }, [isLoaded, loadProfile]);

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      } max-xl:h-[calc(100vh-116px)] max-xl:w-full max-xl:min-h-[600px]`}
    >
      <button
        type="button"
        onClick={() => navigate("/my")}
        className="absolute left-3 top-4 z-20 flex h-11 items-center gap-2 rounded-token-s px-2 text-body-02-m text-text-strong transition-colors hover:bg-fill-surface sm:left-6 sm:top-8 sm:text-title-03-m"
        aria-label="마이페이지로 돌아가기"
      >
        <ChevronLeftIcon className="size-6" />
        <span>마이페이지</span>
      </button>

      <div className="h-full overflow-y-auto px-4 pb-8 sm:px-8 sm:pb-12 lg:px-[72px] custom-scrollbar">
        <div className="mx-auto flex w-full max-w-[780px] flex-col items-center">
          <header className="relative h-[316px] w-full shrink-0 bg-fill-inverse">
            <div className="absolute left-[326px] top-[110px] max-xl:left-1/2 max-xl:-translate-x-1/2">
              <ProfileImageEditor />
            </div>

            <div className="absolute left-0 top-[258px] w-full text-center">
              <h1 className="text-title-03-sb text-text-strong">
                {profile.nickname}
              </h1>
              <p className="mt-2 text-body-02-m text-text-teritary">
                {profile.bio}
              </p>
            </div>
          </header>

          <ProfileEditForm />
        </div>
      </div>
    </section>
  );
}
