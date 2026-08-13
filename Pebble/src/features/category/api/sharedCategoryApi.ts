import { apiRequest } from "@/services/api";
import type { CategoryMember } from "@/types";

export type SharedCategoryMemberResponse = {
  id: number;
  categoryId: number;
  userId: number;
  role: "OWNER" | "MEMBER";
  status: "PENDING" | "ACCEPTED";
  createdAt?: string;
  updatedAt?: string;
};

type UserProfileResponse = {
  id: number;
  nickname: string;
  uniqueTag?: string;
  profileImageUrl?: string | null;
};

type CategoryInviteTarget =
  | {
      nickname: string;
    }
  | {
      email: string;
    };

const mapMemberToInviteTarget = (
  member: CategoryMember,
): CategoryInviteTarget => {
  if (member.email) {
    return { email: member.email };
  }

  return {
    nickname: member.uniqueTag ? `${member.name}#${member.uniqueTag}` : member.name,
  };
};

export async function shareCategory(
  categoryId: string,
  members: CategoryMember[],
): Promise<SharedCategoryMemberResponse[] | null> {
  if (!members.length) {
    return null;
  }

  return apiRequest<SharedCategoryMemberResponse[]>({
    method: "POST",
    url: `/categories/${categoryId}/share`,
    data: {
      invites: members.map(mapMemberToInviteTarget),
    },
  });
}

export async function inviteCategoryMember(
  categoryId: string,
  member: CategoryMember,
): Promise<SharedCategoryMemberResponse | null> {
  return apiRequest<SharedCategoryMemberResponse>({
    method: "POST",
    url: `/categories/${categoryId}/members`,
    data: mapMemberToInviteTarget(member),
  });
}

export async function getCategoryMembers(
  categoryId: string,
): Promise<SharedCategoryMemberResponse[]> {
  const members = await apiRequest<SharedCategoryMemberResponse[]>({
    method: "GET",
    url: `/categories/${categoryId}/members`,
  });

  return members ?? [];
}

export async function getSharedCategoryUserProfile(
  userId: number,
): Promise<CategoryMember | null> {
  const user = await apiRequest<UserProfileResponse>({
    method: "GET",
    url: `/users/${userId}`,
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.nickname,
    uniqueTag: user.uniqueTag,
    profileImageUrl: user.profileImageUrl ?? null,
  };
}

export async function removeCategoryMember(
  categoryId: string,
  userId: number,
): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/categories/${categoryId}/members/${userId}`,
  });
}

export async function leaveSharedCategory(categoryId: string): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/categories/${categoryId}/members/me`,
  });
}

export async function respondCategoryInvite(
  categoryId: string,
  action: "ACCEPT" | "REJECT",
): Promise<void> {
  await apiRequest({
    method: "PATCH",
    url: `/categories/${categoryId}/members/me`,
    data: { action },
    skipGlobalErrorToast: true,
  });
}
