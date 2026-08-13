import { apiRequest } from "@/services/api";
import type { EditableProfile, Profile } from "@/features/mypage/types/profile";

export type UpdateMyProfileRequest = Partial<EditableProfile> & {
  profileImageUrl?: string | null;
};

type MyProfileResponse = {
  id: number;
  email: string;
  nickname: string;
  uniqueTag: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  lastNicknameChangedAt?: string | null;
  nicknameChangeableAfter?: string | null;
  createdAt: string;
};

type MyProfileStatsResponse = {
  pebble: number;
};

export async function getMyProfile(): Promise<Profile> {
  const data = await apiRequest<MyProfileResponse>({
    method: "GET",
    url: "/users/me",
  });

  if (!data) {
    throw new Error("프로필 정보를 불러오지 못했어요.");
  }

  return {
    id: data.id,
    email: data.email,
    nickname: data.nickname,
    uniqueTag: data.uniqueTag,
    bio: data.bio ?? "",
    imageUrl: data.profileImageUrl ?? null,
    lastNicknameChangedAt: data.lastNicknameChangedAt ?? null,
    nicknameChangeableAfter: data.nicknameChangeableAfter ?? null,
  };
}

export async function getMyProfileStats(): Promise<MyProfileStatsResponse> {
  const data = await apiRequest<MyProfileStatsResponse>({
    method: "GET",
    url: "/users/me/stats",
  });

  if (!data) {
    throw new Error("프로필 통계를 불러오지 못했어요.");
  }

  return data;
}

export async function updateMyProfile(
  profile: UpdateMyProfileRequest,
): Promise<void> {
  await apiRequest({
    method: "PATCH",
    url: "/users/me",
    data: profile,
  });
}
