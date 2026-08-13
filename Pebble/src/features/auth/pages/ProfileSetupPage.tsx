import { Header } from "../components/Header";
import { ProfileSetupContainer } from "../containers/ProfileSetupContainer";

export const ProfileSetupPage = (): JSX.Element => {
  return (
    <main className="w-full h-dvh bg-fill-inverse flex flex-col overflow-hidden [font-family:'Pretendard',sans-serif]" data-id="profile-setup-screen" data-theme="light">
      <Header />
      <div className="flex-1 min-h-0 w-full flex justify-center items-start pt-[38px] px-[16px] overflow-hidden [@media(max-height:850px)]:pt-[12px]">
        <ProfileSetupContainer />
      </div>
    </main>
  );
};
