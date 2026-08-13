import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category } from "@/types";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  updateCategory as updateCategoryApi,
} from "@/features/category/api/categoryApi";
import {
  inviteCategoryMember,
  removeCategoryMember,
  shareCategory,
} from "@/features/category/api/sharedCategoryApi";
import {
  replaceCategoryList,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarCategoryActionsParams = {
  categories: Category[];
  reloadCalendarData: () => Promise<void>;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
};

export const useCalendarCategoryActions = ({
  categories,
  reloadCalendarData,
  setCategories,
  setSelectedCategoryId,
}: UseCalendarCategoryActionsParams) => {
  const syncSharedCategoryMembers = useCallback(
    async (
      categoryId: string,
      previousMembers: Category["members"] = [],
      nextMembers: Category["members"] = [],
      wasShared = false,
      shouldBeShared = false,
    ) => {
      if (!shouldBeShared) {
        return;
      }

      const previousEditableMembers = previousMembers.filter(
        (member) => member.role !== "OWNER",
      );
      const nextEditableMembers = nextMembers.filter(
        (member) => member.role !== "OWNER",
      );
      const membersToAdd = nextEditableMembers.filter(
        (nextMember) =>
          !previousEditableMembers.some(
            (previousMember) => previousMember.id === nextMember.id,
          ),
      );
      const membersToRemove = previousEditableMembers.filter(
        (previousMember) =>
          !nextEditableMembers.some(
            (nextMember) => nextMember.id === previousMember.id,
          ),
      );

      if (!wasShared) {
        await shareCategory(categoryId, nextEditableMembers);
        return;
      }

      await Promise.all([
        ...membersToAdd.map((member) => inviteCategoryMember(categoryId, member)),
        ...membersToRemove.map((member) =>
          removeCategoryMember(categoryId, member.id),
        ),
      ]);
    },
    [],
  );

  const replaceCategories = useCallback(
    (nextCategories: Category[]) => {
      setCategories(replaceCategoryList(nextCategories));
      setSelectedCategoryId(null);
    },
    [setCategories, setSelectedCategoryId],
  );

  const selectCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
    },
    [setSelectedCategoryId],
  );

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategoryId(null);
  }, [setSelectedCategoryId]);

  const createCategory = useCallback(
    async (input: CreateCategoryInput) => {
      const category = await createCategoryApi(input);

      if (!category) {
        throw new Error("카테고리 생성 응답을 확인하지 못했어요.");
      }

      setSelectedCategoryId(null);
      await reloadCalendarData();

      return category;
    },
    [reloadCalendarData, setSelectedCategoryId],
  );

  const updateCategory = useCallback(
    async (categoryId: string, input: UpdateCategoryInput) => {
      const previousCategory = categories.find(
        (category) => category.id === categoryId,
      );
      await updateCategoryApi(categoryId, input);
      const nextMembers = input.isShared ? input.members ?? [] : [];

      await syncSharedCategoryMembers(
        categoryId,
        input.previousMembers ?? previousCategory?.members,
        nextMembers,
        Boolean(previousCategory?.isShared),
        Boolean(input.isShared),
      );

      await reloadCalendarData();
    },
    [categories, reloadCalendarData, syncSharedCategoryMembers],
  );

  const toggleCategoryVisibility = useCallback(
    async (categoryId: string) => {
      const category = categories.find((category) => category.id === categoryId);

      if (!category) {
        return;
      }

      setCategories((previousCategories) =>
        previousCategories.map((previousCategory) =>
          previousCategory.id === categoryId
            ? { ...previousCategory, isHidden: !previousCategory.isHidden }
            : previousCategory,
        ),
      );
    },
    [categories, setCategories],
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      await deleteCategoryApi(categoryId);

      setSelectedCategoryId((previousSelectedCategoryId) =>
        previousSelectedCategoryId === categoryId
          ? null
          : previousSelectedCategoryId,
      );
      await reloadCalendarData();
    },
    [reloadCalendarData, setSelectedCategoryId],
  );

  return {
    replaceCategories,
    selectCategory,
    clearSelectedCategory,
    createCategory,
    updateCategory,
    toggleCategoryVisibility,
    deleteCategory,
  };
};
