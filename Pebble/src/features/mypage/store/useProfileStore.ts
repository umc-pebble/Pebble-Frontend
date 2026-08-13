import { create } from "zustand";
import {
  getMyProfile,
  updateMyProfile,
  type UpdateMyProfileRequest,
} from "@/features/mypage/api/profileApi";
import { uploadImageDataUrl } from "@/features/category/api/uploadImageApi";
import { AUTH_SESSION_CLEARED_EVENT } from "@/services/api/authToken";
import type {
  EditableProfile,
  Profile,
} from "@/features/mypage/types/profile";

type ProfileStore = {
  profile: Profile;
  isLoaded: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  pendingImageUrl: string | null;
  resetProfile: () => void;
  loadProfile: () => Promise<void>;
  updateProfile: (profile: EditableProfile) => Promise<void>;
  updateProfileImage: (imageUrl: string) => Promise<void>;
};

const EMPTY_PROFILE: Profile = {
  id: 0,
  email: "",
  nickname: "",
  bio: "",
  imageUrl: null,
  lastNicknameChangedAt: null,
  nicknameChangeableAfter: null,
};

let profileSessionVersion = 0;

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: EMPTY_PROFILE,
  isLoaded: false,
  isLoading: false,
  isSaving: false,
  error: null,
  pendingImageUrl: null,
  resetProfile: () => {
    profileSessionVersion += 1;
    set({
      profile: EMPTY_PROFILE,
      isLoaded: false,
      isLoading: false,
      isSaving: false,
      error: null,
      pendingImageUrl: null,
    });
  },
  loadProfile: async () => {
    if (useProfileStore.getState().isLoading) {
      return;
    }

    const requestedSessionVersion = profileSessionVersion;

    set({ isLoading: true, error: null });

    try {
      const profile = await getMyProfile();

      // 로그아웃 뒤 늦게 완료된 이전 계정 요청이 새 상태를 덮어쓰지 않게 합니다.
      if (requestedSessionVersion !== profileSessionVersion) {
        return;
      }

      set({ profile, isLoaded: true, isLoading: false });
    } catch (error) {
      if (requestedSessionVersion !== profileSessionVersion) {
        return;
      }

      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "프로필 정보를 불러오지 못했어요.",
      });
    }
  },
  updateProfileImage: async (imageUrl) => {
    set({ pendingImageUrl: imageUrl, isSaving: true, error: null });

    try {
      const uploadedImageUrl = await uploadImageDataUrl(
        imageUrl,
        "profile-image.jpg",
      );

      if (!uploadedImageUrl) {
        throw new Error("프로필 이미지를 업로드하지 못했어요.");
      }

      await updateMyProfile({ profileImageUrl: uploadedImageUrl });
      const profile = await getMyProfile();

      set({
        profile,
        pendingImageUrl: null,
        isSaving: false,
      });
    } catch (error) {
      set({
        pendingImageUrl: null,
        isSaving: false,
        error:
          error instanceof Error
            ? error.message
            : "프로필 이미지를 저장하지 못했어요.",
      });
      throw error;
    }
  },
  updateProfile: async (updatedProfile) => {
    set({ isSaving: true, error: null });

    try {
      const currentProfile = useProfileStore.getState().profile;
      const pendingImageUrl = useProfileStore.getState().pendingImageUrl;
      const changes: UpdateMyProfileRequest = {};

      if (updatedProfile.nickname !== currentProfile.nickname) {
        changes.nickname = updatedProfile.nickname;
      }

      if (updatedProfile.bio !== currentProfile.bio) {
        changes.bio = updatedProfile.bio;
      }

      if (pendingImageUrl) {
        const uploadedImageUrl = await uploadImageDataUrl(
          pendingImageUrl,
          "profile-image.jpg",
        );

        if (!uploadedImageUrl) {
          throw new Error("프로필 이미지를 업로드하지 못했어요.");
        }

        changes.profileImageUrl = uploadedImageUrl;
      }

      await updateMyProfile(changes);

      // 수정 응답을 추측하지 않고 서버가 계산한 닉네임 변경 가능 시점을 다시 받습니다.
      const profile = await getMyProfile();

      set({
        profile,
        isSaving: false,
        pendingImageUrl: null,
      });
    } catch (error) {
      set({
        isSaving: false,
        error:
          error instanceof Error
            ? error.message
            : "프로필을 저장하지 못했어요.",
      });
      throw error;
    }
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener(AUTH_SESSION_CLEARED_EVENT, () => {
    useProfileStore.getState().resetProfile();
  });
}
