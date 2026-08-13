import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import profile1 from "@/assets/profiles/profile1.png";
import profile2 from "@/assets/profiles/profile2.png";
import profile3 from "@/assets/profiles/profile3.png";
import profile4 from "@/assets/profiles/profile4.png";
import profile5 from "@/assets/profiles/profile5.png";
import { uploadImageFile } from "@/features/category/api/uploadImageApi";
import { signUp, updateProfile } from "@/features/auth/api/authApi";
import { ApiRequestError, getAccessToken, setAuthTokens } from "@/services/api";
import { ProfileSetupForm } from "../components/ProfileSetupForm";
import type { ProfileSetupLocationState } from "../types/authNavigation";

const DEFAULT_PROFILES = [
  { id: "profile-1", src: profile1, alt: "기본 프로필 1" },
  { id: "profile-2", src: profile2, alt: "기본 프로필 2" },
  { id: "profile-3", src: profile3, alt: "기본 프로필 3" },
  { id: "profile-4", src: profile4, alt: "기본 프로필 4" },
  { id: "profile-5", src: profile5, alt: "기본 프로필 5" },
];

export const ProfileSetupContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as ProfileSetupLocationState | null;
  const [selectedProfileId, setSelectedProfileId] = useState(DEFAULT_PROFILES[0].id);
  const [uploadedProfileSrc, setUploadedProfileSrc] = useState<string | null>(null);
  const [uploadedProfileFile, setUploadedProfileFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!locationState) {
      navigate("/signup", { replace: true });
      return;
    }

    if (locationState.mode === "social" && !getAccessToken()) {
      navigate("/login", { replace: true });
    }
  }, [locationState, navigate]);

  const selectedProfileSrc = useMemo(() => {
    if (selectedProfileId === "upload" && uploadedProfileSrc) return uploadedProfileSrc;
    return DEFAULT_PROFILES.find((profile) => profile.id === selectedProfileId)?.src ?? DEFAULT_PROFILES[0].src;
  }, [selectedProfileId, uploadedProfileSrc]);

  // 닉네임은 공백을 제외한 문자가 하나 이상 있을 때 유효합니다.
  const isFormValid = nickname.trim().length > 0;

  const handleUploadProfile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setUploadedProfileSrc(reader.result);
      setUploadedProfileFile(file);
      setSelectedProfileId("upload");
    };
    reader.readAsDataURL(file);
  };

  const createProfileImageFile = async () => {
    if (selectedProfileId === "upload" && uploadedProfileFile) {
      return uploadedProfileFile;
    }

    const response = await fetch(selectedProfileSrc);
    const blob = await response.blob();
    return new File([blob], `${selectedProfileId}.png`, {
      type: blob.type || "image/png",
    });
  };

  const uploadSelectedProfile = async () => {
    const file = await createProfileImageFile();
    return uploadImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid || !locationState || isSubmitting) return;

    const trimmedNickname = nickname.trim();
    const trimmedIntroduction = introduction.trim();
    let emailAccountCreated = false;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (locationState.mode === "email") {
        const response = await signUp({
          ...locationState.signUpDraft,
          nickname: trimmedNickname,
          bio: trimmedIntroduction || null,
          profileImageUrl: null,
        });
        setAuthTokens(response.accessToken, response.refreshToken);
        emailAccountCreated = true;
      }

      const profileImageUrl = await uploadSelectedProfile();

      await updateProfile({
        ...(locationState.mode === "social"
          ? {
              nickname: trimmedNickname,
              bio: trimmedIntroduction || null,
            }
          : {}),
        profileImageUrl,
      });

      navigate("/signup-complete", {
        replace: true,
        state: {
          nickname: trimmedNickname,
          profileSrc: selectedProfileSrc,
        },
      });
    } catch (error) {
      if (emailAccountCreated) {
        // 가입 자체가 끝난 뒤 이미지 업로드만 실패한 경우 기본 이미지로 계속 진행합니다.
        navigate("/signup-complete", {
          replace: true,
          state: {
            nickname: trimmedNickname,
            profileSrc: selectedProfileSrc,
          },
        });
        return;
      }

      if (
        locationState.mode === "email" &&
        error instanceof ApiRequestError &&
        error.code === "AUTH_EMAIL_DUPLICATED"
      ) {
        navigate("/signup", {
          replace: true,
          state: {
            draft: locationState.signUpDraft,
            serverError: "이미 가입된 이메일이에요",
          },
        });
        return;
      }

      setErrorMessage(
        error instanceof ApiRequestError
          ? error.message
          : "프로필을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (locationState?.mode === "email") {
      navigate("/signup", {
        state: { draft: locationState.signUpDraft },
      });
      return;
    }

    navigate("/login");
  };

  return (
    <ProfileSetupForm
      profiles={DEFAULT_PROFILES}
      selectedProfileId={selectedProfileId}
      selectedProfileSrc={selectedProfileSrc}
      nickname={nickname}
      introduction={introduction}
      isFormValid={isFormValid}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onSelectProfile={setSelectedProfileId}
      onUploadProfile={handleUploadProfile}
      onNicknameChange={(value) => {
        setNickname(value);
        setErrorMessage(null);
      }}
      onIntroductionChange={(value) => {
        setIntroduction(value);
        setErrorMessage(null);
      }}
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  );
};
