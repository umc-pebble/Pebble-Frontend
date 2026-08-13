import { useLocation, useNavigate } from "react-router-dom";
import profile1 from "@/assets/profiles/profile1.png";
import { SignUpCompleteContent } from "../components/SignUpCompleteContent";

interface SignUpCompleteLocationState {
  nickname?: string;
  profileSrc?: string;
}

export const SignUpCompleteContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SignUpCompleteLocationState | null;

  // 직접 URL로 접근한 경우에도 화면이 깨지지 않도록 기본값을 제공합니다.
  const nickname = state?.nickname?.trim() || "닉네임";
  const profileSrc = state?.profileSrc || profile1;

  return (
    <SignUpCompleteContent
      nickname={nickname}
      profileSrc={profileSrc}
      onGoToSchedule={() => navigate("/calendar", { replace: true })}
    />
  );
};
