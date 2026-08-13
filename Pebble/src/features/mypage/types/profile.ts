export type Profile = {
  id: number;
  email: string;
  nickname: string;
  uniqueTag?: string;
  bio: string;
  imageUrl: string | null;
  lastNicknameChangedAt: string | null;
  nicknameChangeableAfter: string | null;
};

export type EditableProfile = Pick<Profile, "nickname" | "bio">;
