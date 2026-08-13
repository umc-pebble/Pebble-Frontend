import { getAllFollows } from "@/features/friends/api/followApi";
import type { Friend } from "@/features/category/types";

export async function getFollowingFriends(): Promise<Friend[]> {
  const follows = await getAllFollows("friends");

  return follows.map((follow) => ({
    id: follow.userId,
    name: follow.nickname,
    uniqueTag: follow.uniqueTag,
    profileImageUrl: follow.profileImageUrl,
  }));
}
