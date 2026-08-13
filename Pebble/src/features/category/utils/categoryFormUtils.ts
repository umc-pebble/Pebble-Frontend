import type { Friend } from '@/features/category/types';
import type { UpdateCategoryInput } from '@/features/calendar/types';
import type { Category } from '@/types';
import type { CategoryColorTheme } from '@/utils/categoryColorTheme';

export const CATEGORY_IMAGE_ASPECT_RATIO = 175 / 234;

export const getEditableCategoryMembers = (members: Friend[]) =>
  members.filter((member) => member.role !== 'OWNER');

const normalizeImageUrl = (imageUrl: string | undefined) =>
  imageUrl ?? undefined;

const getMemberIdsKey = (members: Friend[] = []) =>
  getEditableCategoryMembers(members)
    .map((member) => member.id)
    .sort((left, right) => left - right)
    .join(',');

export const buildChangedCategoryInput = ({
  category,
  categoryName,
  selectedTheme,
  imageUrl,
  isPublic,
  isCompleted,
  isShared,
  selectedMembers,
  initialMembers,
}: {
  category: Category;
  categoryName: string;
  selectedTheme: CategoryColorTheme;
  imageUrl?: string;
  isPublic: boolean;
  isCompleted: boolean;
  isShared: boolean;
  selectedMembers: Friend[];
  initialMembers: Friend[];
}): UpdateCategoryInput => {
  const input: UpdateCategoryInput = {};
  const nextTitle = categoryName.trim();
  const nextImageUrl = normalizeImageUrl(imageUrl);
  const previousImageUrl = normalizeImageUrl(category.imageUrl);
  const nextMembers = isShared
    ? getEditableCategoryMembers(selectedMembers)
    : [];
  const hasMemberChanges =
    getMemberIdsKey(initialMembers) !== getMemberIdsKey(nextMembers);

  if (nextTitle !== category.title) {
    input.title = nextTitle;
  }

  if (selectedTheme.accent !== category.accent) {
    input.accent = selectedTheme.accent;
    input.themeBase = selectedTheme.themeBase;
    input.themeMid = selectedTheme.themeMid;
    input.themeLight = selectedTheme.themeLight;
    input.themeTextOnMid = selectedTheme.themeTextOnMid;
    input.themeTextOnLight = selectedTheme.themeTextOnLight;
  }

  if (nextImageUrl !== previousImageUrl) {
    input.imageUrl = nextImageUrl;
  }

  if (isPublic !== Boolean(category.isPublic ?? true)) {
    input.isPublic = isPublic;
  }

  if (isCompleted !== Boolean(category.isCompleted ?? false)) {
    input.isCompleted = isCompleted;
  }

  if (isShared !== Boolean(category.isShared ?? false)) {
    input.isShared = isShared;
  }

  if (isShared && hasMemberChanges) {
    input.isShared = true;
    input.members = nextMembers;
    input.previousMembers = initialMembers;
  }

  return input;
};

export const mapProfileToCategoryMember = (
  profile: {
    id: number;
    nickname: string;
    uniqueTag?: string;
    imageUrl?: string | null;
    profileImageUrl?: string | null;
  },
  role?: Friend['role'],
): Friend => ({
  id: profile.id,
  name: profile.nickname,
  role,
  uniqueTag: profile.uniqueTag,
  profileImageUrl: profile.profileImageUrl ?? profile.imageUrl ?? null,
});

export const filterAvailableCategoryFriends = ({
  friends,
  selectedMembers,
  searchQuery,
}: {
  friends: Friend[];
  selectedMembers: Friend[];
  searchQuery: string;
}) =>
  friends.filter(
    (friend) =>
      [friend.name, friend.uniqueTag, friend.email]
        .filter(Boolean)
        .some((value) => value?.includes(searchQuery)) &&
      !selectedMembers.some((member) => member.id === friend.id),
  );
