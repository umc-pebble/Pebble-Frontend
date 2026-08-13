import { Header } from "../components/Header";
import { SignUpCompleteContainer } from "../containers/SignUpCompleteContainer";

export const SignUpCompletePage = (): JSX.Element => {
  return (
    <main className="w-full h-dvh bg-fill-inverse flex flex-col overflow-hidden [font-family:'Pretendard',sans-serif]" data-id="signup-complete-screen" data-theme="light">
      <Header />
      <div className="flex-1 min-h-0 w-full flex justify-center items-start pt-[195px] px-[16px] overflow-hidden [@media(max-height:850px)]:pt-[24px]">
        <SignUpCompleteContainer />
      </div>
    </main>
  );
};
