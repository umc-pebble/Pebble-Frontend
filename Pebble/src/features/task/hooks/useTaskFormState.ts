import { useEffect, useState } from 'react';

import { useScheduleFormDateInitializer } from '@/features/calendar/hooks/useScheduleFormDateInitializer';
import type { CreateScheduleItemInput } from '@/features/calendar/types';
import { useRetryableAction } from '@/hooks/useRetryableAction';
import { useScheduleDatePicker } from '@/hooks/useScheduleDatePicker';
import type { Category, ScheduleItem } from '@/types';
import { getScheduleRangeFromSelection } from '@/utils/scheduleDate';

export type TaskFormSubmitInput = {
  categoryId: string | null;
  milestoneId: string | null;
  task: CreateScheduleItemInput;
};

type UseTaskFormStateParams = {
  categories: Category[];
  defaultCategoryId: string | null;
  defaultMilestoneId: string | null;
  isOpen: boolean;
  task: ScheduleItem | null;
  onClose: () => void;
  onSubmit?: (
    input: TaskFormSubmitInput,
  ) => void | Promise<void>;
  onRequestDelete?: () => void | Promise<void>;
};

export const useTaskFormState = ({
  categories,
  defaultCategoryId,
  defaultMilestoneId,
  isOpen,
  task,
  onClose,
  onSubmit,
  onRequestDelete,
}: UseTaskFormStateParams) => {
  const [taskName, setTaskName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategoryId,
  );
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(
    defaultMilestoneId,
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMilestoneDropdownOpen, setIsMilestoneDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const datePicker = useScheduleDatePicker();
  const { isRunning, run } = useRetryableAction();

  useScheduleFormDateInitializer({
    isOpen,
    task,
    datePicker,
  });

  useEffect(() => {
    if (!isOpen) return;

    const nextCategory = defaultCategoryId
      ? categories.find(
          (category) =>
            category.id === defaultCategoryId && !category.isHidden,
        )
      : undefined;
    const nextCategoryId = nextCategory?.id ?? null;
    const nextMilestoneId =
      nextCategory &&
      defaultMilestoneId &&
      nextCategory.items.some(
        (milestone) => milestone.id === defaultMilestoneId,
      )
        ? defaultMilestoneId
        : null;

    setSelectedCategory(nextCategoryId);
    setSelectedMilestone(nextMilestoneId);
    setTaskName(task?.title ?? '');
    setErrorMessage('');
    setIsCategoryDropdownOpen(false);
    setIsMilestoneDropdownOpen(false);
  }, [
    categories,
    defaultCategoryId,
    defaultMilestoneId,
    isOpen,
    task,
  ]);

  const activeCategory = categories.find(
    (category) => category.id === selectedCategory && !category.isHidden,
  );
  const availableMilestones = activeCategory?.items ?? [];
  const submitDisabledReason = !taskName.trim()
    ? '제목을 입력해 주세요'
    : !datePicker.isDateSelectionComplete
      ? '날짜를 선택해 주세요'
      : undefined;

  const changeTaskName = (name: string) => {
    setTaskName(name);
    setErrorMessage('');
  };

  const selectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedMilestone(null);
    setIsCategoryDropdownOpen(false);
    setErrorMessage('');
  };

  const selectMilestone = (milestoneId: string | null) => {
    setSelectedMilestone(milestoneId);
    setIsMilestoneDropdownOpen(false);
    setErrorMessage('');
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen((value) => !value);
    setIsMilestoneDropdownOpen(false);
  };

  const toggleMilestoneDropdown = () => {
    if (activeCategory) {
      setIsMilestoneDropdownOpen((value) => !value);
    }

    setIsCategoryDropdownOpen(false);
  };

  const handleSubmit = async () => {
    const scheduleRange = getScheduleRangeFromSelection(datePicker);
    const trimmedName = taskName.trim();

    if (!trimmedName || !scheduleRange || isRunning) return;

    setErrorMessage('');

    const inputSnapshot: TaskFormSubmitInput = {
      categoryId: selectedCategory,
      milestoneId: selectedCategory ? selectedMilestone : null,
      task: {
        title: trimmedName,
        start: scheduleRange.start,
        end: scheduleRange.end,
        dates: scheduleRange.dates,
        accent: activeCategory?.accent ?? '#171717',
      },
    };

    await run(
      async () => {
        await onSubmit?.(inputSnapshot);
        setTaskName('');
        onClose();
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '태스크를 저장하지 못했어요.',
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
            error instanceof Error
              ? error.message
              : '태스크를 삭제하지 못했어요.',
          );
        },
      },
    );
  };

  return {
    activeCategory,
    availableMilestones,
    changeTaskName,
    datePicker,
    errorMessage,
    handleDelete,
    handleSubmit,
    isCategoryDropdownOpen,
    isMilestoneDropdownOpen,
    isRunning,
    selectCategory,
    selectMilestone,
    selectedCategory,
    selectedMilestone,
    submitDisabledReason,
    taskName,
    toggleCategoryDropdown,
    toggleMilestoneDropdown,
  };
};
