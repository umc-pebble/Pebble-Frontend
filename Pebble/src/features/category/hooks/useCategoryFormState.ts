import { useEffect, useState } from 'react';

import { uploadImageDataUrl } from '@/features/category/api/uploadImageApi';
import { useCategoryFormMembers } from '@/features/category/hooks/useCategoryFormMembers';
import {
  buildChangedCategoryInput,
  getEditableCategoryMembers,
} from '@/features/category/utils/categoryFormUtils';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';
import { useRetryableAction } from '@/hooks/useRetryableAction';
import type { Category } from '@/types';
import {
  createCategoryColorTheme,
  DEFAULT_CATEGORY_COLOR,
} from '@/utils/categoryColorTheme';
import { getErrorMessage } from '@/utils/getErrorMessage';

type UseCategoryFormStateParams = {
  category?: Category;
  isOpen: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  onRequestDelete?: () => void | Promise<void>;
  onSubmit?: (
    input: CreateCategoryInput | UpdateCategoryInput,
  ) => void | Promise<void>;
};

export const useCategoryFormState = ({
  category,
  isOpen,
  mode,
  onClose,
  onRequestDelete,
  onSubmit,
}: UseCategoryFormStateParams) => {
  const [selectedColor, setSelectedColor] =
    useState<string>(DEFAULT_CATEGORY_COLOR);
  const [isPublic, setIsPublic] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [categoryName, setCategoryName] = useState(category?.title ?? '');
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    category?.imageUrl,
  );
  const [cropSourceImageFile, setCropSourceImageFile] =
    useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { isRunning, run } = useRetryableAction();
  const memberState = useCategoryFormMembers({
    category,
    isOpen,
    isShared,
    mode,
    onError: setErrorMessage,
  });

  const selectedTheme = createCategoryColorTheme(selectedColor);
  const canToggleShared = !(
    mode === 'edit' &&
    category?.isShared &&
    isShared
  );
  const canDeleteCategory = Boolean(onRequestDelete);
  const shouldShowMemberList =
    mode === 'edit' && memberState.selectedMembers.length > 0;
  const changedCategoryInput =
    mode === 'edit' && category
      ? buildChangedCategoryInput({
          category,
          categoryName,
          selectedTheme,
          imageUrl,
          isPublic,
          isCompleted,
          isShared,
          selectedMembers: memberState.selectedMembers,
          initialMembers: memberState.initialMembers,
        })
      : null;
  const submitDisabledReason = !categoryName.trim()
    ? '제목을 입력해 주세요'
    : mode === 'edit' &&
        changedCategoryInput &&
        Object.keys(changedCategoryInput).length === 0
      ? '변경사항을 입력해 주세요'
      : undefined;

  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage('');
    setCropSourceImageFile(null);

    if (mode === 'edit' && category) {
      setCategoryName(category.title);
      setSelectedColor(category.accent);
      setImageUrl(category.imageUrl);
      setIsPublic(category.isPublic ?? true);
      setIsCompleted(category.isCompleted ?? false);
      setIsShared(category.isShared ?? false);
      return;
    }

    setCategoryName('');
    setImageUrl(undefined);
    setSelectedColor(DEFAULT_CATEGORY_COLOR);
    setIsPublic(false);
    setIsCompleted(false);
    setIsShared(false);
  }, [category, isOpen, mode]);

  const changeCategoryName = (name: string) => {
    setCategoryName(name);
    setErrorMessage('');
  };

  const toggleShared = () => {
    if (canToggleShared) {
      setIsShared((value) => !value);
    }
  };

  const handleSubmit = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName || isRunning) return;

    setErrorMessage('');

    const inputSnapshot = {
      title: trimmedName,
      selectedColor,
      imageUrl,
      isPublic,
      isCompleted,
      isShared,
      selectedMembers: [...memberState.selectedMembers],
      initialMembers: [...memberState.initialMembers],
    };

    await run(
      async () => {
        const theme = createCategoryColorTheme(inputSnapshot.selectedColor);
        const uploadedImageUrl = inputSnapshot.imageUrl?.startsWith('data:')
          ? await uploadImageDataUrl(inputSnapshot.imageUrl)
          : inputSnapshot.imageUrl;

        if (mode === 'edit' && category) {
          const changedInput = buildChangedCategoryInput({
            category,
            categoryName: inputSnapshot.title,
            selectedTheme: theme,
            imageUrl: uploadedImageUrl,
            isPublic: inputSnapshot.isPublic,
            isCompleted: inputSnapshot.isCompleted,
            isShared: inputSnapshot.isShared,
            selectedMembers: inputSnapshot.selectedMembers,
            initialMembers: inputSnapshot.initialMembers,
          });

          if (Object.keys(changedInput).length > 0) {
            await onSubmit?.(changedInput);
          }
        } else {
          await onSubmit?.({
            title: inputSnapshot.title,
            accent: theme.accent,
            themeBase: theme.themeBase,
            themeMid: theme.themeMid,
            themeLight: theme.themeLight,
            themeTextOnMid: theme.themeTextOnMid,
            themeTextOnLight: theme.themeTextOnLight,
            imageUrl: uploadedImageUrl ?? undefined,
            isPublic: inputSnapshot.isPublic,
            isCompleted: inputSnapshot.isCompleted,
            isShared: inputSnapshot.isShared,
            members: inputSnapshot.isShared
              ? getEditableCategoryMembers(inputSnapshot.selectedMembers)
              : undefined,
          });
        }

        onClose();
      },
      {
        onError: (error) => {
          setErrorMessage(
            getErrorMessage(error, '카테고리를 저장하지 못했어요.'),
          );
        },
      },
    );
  };

  const handleDelete = async () => {
    if (!onRequestDelete || isRunning) return;

    setErrorMessage('');
    await run(
      async () => {
        await onRequestDelete();
      },
      {
        onError: (error) => {
          setErrorMessage(
            getErrorMessage(error, '카테고리를 삭제하지 못했어요.'),
          );
        },
      },
    );
  };

  return {
    ...memberState,
    canDeleteCategory,
    canToggleShared,
    categoryName,
    changeCategoryName,
    closeImageCrop: () => setCropSourceImageFile(null),
    cropSourceImageFile,
    errorMessage,
    handleDelete,
    handleSubmit,
    imageUrl,
    isCompleted,
    isPublic,
    isRunning,
    isShared,
    openImageCrop: setCropSourceImageFile,
    selectedColor,
    selectedTheme,
    setImageUrl,
    setSelectedColor,
    shouldShowMemberList,
    submitDisabledReason,
    toggleCompleted: () => setIsCompleted((value) => !value),
    togglePublic: () => setIsPublic((value) => !value),
    toggleShared,
  };
};
