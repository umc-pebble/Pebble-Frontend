import type { Category } from "@/types";
import { createCategoryColorTheme } from "@/utils/categoryColorTheme";
import type {
  CategoryMemberResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./categoryApi.types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

const mapImageUrlToRequest = (imageUrl: string | undefined) =>
  imageUrl?.startsWith("http://") || imageUrl?.startsWith("https://")
    ? imageUrl
    : null;

const getCategoryMemberResponses = (category: CategoryResponse) =>
  category.members ??
  category.categoryMembers ??
  category.invitedUsers ??
  category.users ??
  [];

const mapCategoryMemberResponse = (member: CategoryMemberResponse) => {
  const id = member.userId ?? member.id;
  const name = member.nickname ?? member.name;

  if (id === undefined || !name) {
    return null;
  }

  return {
    id,
    name,
    role: member.role,
    uniqueTag: member.uniqueTag,
    email: member.email,
    profileImageUrl: member.profileImageUrl ?? null,
  };
};

export function mapCategoryResponseToCategory(
  category: CategoryResponse,
): Category {
  const theme = createCategoryColorTheme(category.color);

  return {
    id: String(category.id),
    userId: category.userId,
    title: category.name,
    accent: theme.accent,
    themeBase: theme.themeBase,
    themeMid: theme.themeMid,
    themeLight: theme.themeLight,
    themeTextOnMid: theme.themeTextOnMid,
    themeTextOnLight: theme.themeTextOnLight,
    imageUrl: category.imageUrl ?? undefined,
    isHidden: category.isHidden,
    isPublic: category.isPublic,
    isCompleted: category.isCompleted,
    isShared: category.isShared,
    milestoneCount: category.milestoneCount,
    taskCount: category.taskCount,
    sharedTaskCount: category.sharedTaskCount,
    hasSchedules: category.hasSchedules,
    taskTotalCount: category.taskTotalCount,
    taskCompletedCount: category.taskCompletedCount,
    progressRate: category.progressRate,
    members: getCategoryMemberResponses(category)
      .map(mapCategoryMemberResponse)
      .filter((member): member is NonNullable<typeof member> => member !== null),
    displayOrder: category.displayOrder,
    items: [],
    tasks: [],
  };
}

export function mapCreateCategoryInputToRequest(
  input: CreateCategoryInput,
): CreateCategoryRequest {
  const inviteUserIds =
    input.isShared && input.members?.length
      ? input.members.map((member) => member.id)
      : undefined;

  return {
    name: input.title,
    color: input.accent,
    imageUrl: mapImageUrlToRequest(input.imageUrl),
    isPublic: input.isPublic,
    isCompleted: input.isCompleted,
    inviteUserIds,
  };
}

export function mapUpdateCategoryInputToRequest(
  input: UpdateCategoryInput,
): UpdateCategoryRequest {
  const request: UpdateCategoryRequest = {};

  if (input.title !== undefined) {
    request.name = input.title;
  }

  if (input.accent !== undefined) {
    request.color = input.accent;
  }

  if ("imageUrl" in input) {
    request.imageUrl = mapImageUrlToRequest(input.imageUrl);
  }

  if (input.isCompleted !== undefined) {
    request.isCompleted = input.isCompleted;
  }

  if (input.isPublic !== undefined) {
    request.isPublic = input.isPublic;
  }

  if (input.isHidden !== undefined) {
    request.isHidden = input.isHidden;
  }

  return request;
}
