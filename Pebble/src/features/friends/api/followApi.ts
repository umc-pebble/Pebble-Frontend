import { apiClient, apiRequest, type ApiResponse } from "@/services/api";

export type FollowStatus = "NONE" | "PENDING" | "ACCEPTED";
export type FollowListType = "friends" | "pending" | "sent";

export type FollowUser = {
  userId: number;
  nickname: string;
  uniqueTag: string;
  profileImageUrl: string | null;
};

export type SearchedUser = FollowUser & {
  followStatus: FollowStatus;
};

export type FollowListItem = FollowUser & {
  followId: number;
  bio: string | null;
  hasTodaySchedule: boolean;
  hasUnviewedSchedule: boolean;
};

const inFlightFollowRequests = new Map<
  FollowListType,
  Promise<FollowListItem[]>
>();

type FollowListResponseItem = Omit<
  FollowListItem,
  "hasUnviewedSchedule"
> & {
  hasUnviewedSchedule?: boolean;
};

export type PageInfo = {
  offset: number;
  limit: number;
  total: number;
};

type PagedApiResponse<T> = ApiResponse<T[]> & {
  page?: PageInfo;
};

type FollowMutationResponse = {
  followId: number;
  status: "PENDING" | "ACCEPTED";
};

export async function searchUsers(
  keyword: string,
  signal?: AbortSignal,
): Promise<{ users: SearchedUser[]; page: PageInfo }> {
  const response = await apiClient.get<PagedApiResponse<SearchedUser>>(
    "/users/search",
    {
      params: { keyword, offset: 0, limit: 50 },
      signal,
    },
  );

  return {
    users: response.data.data ?? [],
    page: response.data.page,
  };
}

export async function getFollows(
  type: FollowListType,
  offset = 0,
  limit = 50,
): Promise<{ follows: FollowListItem[]; page: PageInfo }> {
  const response = await apiClient.get<
    PagedApiResponse<FollowListResponseItem>
  >("/follows", {
    params: { type, offset, limit },
  });
  const follows = (response.data.data ?? []).map((follow) => ({
    ...follow,
    hasUnviewedSchedule: follow.hasUnviewedSchedule ?? false,
  }));

  return {
    follows,
    page: response.data.page ?? {
      offset,
      limit,
      total: follows.length,
    },
  };
}

async function loadAllFollows(
  type: FollowListType,
): Promise<FollowListItem[]> {
  const firstPage = await getFollows(type);
  const follows = [...firstPage.follows];
  let nextOffset = firstPage.page.offset + firstPage.page.limit;

  while (nextOffset < firstPage.page.total) {
    const nextPage = await getFollows(type, nextOffset);
    follows.push(...nextPage.follows);

    if (!nextPage.follows.length) {
      break;
    }

    nextOffset += nextPage.page.limit;
  }

  return follows;
}

export function getAllFollows(
  type: FollowListType,
): Promise<FollowListItem[]> {
  const currentRequest = inFlightFollowRequests.get(type);

  if (currentRequest) {
    return currentRequest;
  }

  const request = loadAllFollows(type).finally(() => {
    inFlightFollowRequests.delete(type);
  });

  inFlightFollowRequests.set(type, request);
  return request;
}

export async function sendFollowRequest(
  targetUserId: number,
): Promise<FollowMutationResponse | null> {
  return apiRequest<FollowMutationResponse>({
    method: "POST",
    url: "/follows",
    data: { targetUserId },
  });
}

export async function acceptFollowRequest(
  followId: number,
): Promise<FollowMutationResponse | null> {
  return apiRequest<FollowMutationResponse>({
    method: "POST",
    url: `/follows/${followId}/accept`,
  });
}

export async function deleteFollow(followId: number): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/follows/${followId}`,
  });
}

export async function markFriendScheduleViewed(userId: number): Promise<void> {
  await apiRequest({
    method: "POST",
    url: `/follows/${userId}/viewed`,
  });
}
