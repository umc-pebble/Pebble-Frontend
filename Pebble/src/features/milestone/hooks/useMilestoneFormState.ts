import { useEffect, useState } from 'react';

import type { CreateScheduleItemInput } from '@/features/calendar/types';
import { useRetryableAction } from '@/hooks/useRetryableAction';
import { useScheduleDatePicker } from '@/hooks/useScheduleDatePicker';
import type { Category, MilestoneItem } from '@/types';
import {
  getScheduleRangeFromSelection,
  parseIsoScheduleDate,
} from '@/utils/scheduleDate';

type UseMilestoneFormStateParams = {
  categories: Category[];
  defaultCategoryId: string | null;
  isOpen: boolean;
  milestone: MilestoneItem | null;
  onClose: () => void;
  onSubmit?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onRequestDelete?: () => void | Promise<void>;
};

export const useMilestoneFormState = ({
  categories,
  defaultCategoryId,
  isOpen,
  milestone,
  onClose,
  onSubmit,
  onRequestDelete,
}: UseMilestoneFormStateParams) => {
  const [milestoneName, setMilestoneName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategoryId,
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const datePicker = useScheduleDatePicker();
  const {
    reset: resetDatePicker,
    setDateRange,
    setDateType,
    setMultiDates,
    setSelectedDate,
  } = datePicker;
  const { isRunning, run } = useRetryableAction();
  const activeCategory = categories.find(
    (category) => category.id === selectedCategory,
  );
  const submitDisabledReason = !selectedCategory
    ? '카테고리를 선택해 주세요'
    : !milestoneName.trim()
      ? '제목을 입력해 주세요'
      : !datePicker.isDateSelectionComplete
        ? '날짜를 선택해 주세요'
        : undefined;

  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage('');
    setIsCategoryDropdownOpen(false);

    const availableDefaultCategoryId =
      defaultCategoryId &&
      categories.some((category) => category.id === defaultCategoryId)
        ? defaultCategoryId
        : null;

    setSelectedCategory(availableDefaultCategoryId);

    if (!milestone) {
      setMilestoneName('');
      resetDatePicker();
      return;
    }

    setMilestoneName(milestone.title);

    if (milestone.dates && milestone.dates.length > 0) {
      setDateType('다중');
      setMultiDates(
        milestone.dates
          .map(parseIsoScheduleDate)
          .filter((date): date is Date => Boolean(date)),
      );
      return;
    }

    if (milestone.end) {
      setDateType('기간');
      setDateRange({
        start: parseIsoScheduleDate(milestone.start),
        end: parseIsoScheduleDate(milestone.end),
      });
      return;
    }

    setDateType('하루');
    setSelectedDate(parseIsoScheduleDate(milestone.start));
  }, [
    categories,
    defaultCategoryId,
    isOpen,
    milestone,
    resetDatePicker,
    setDateRange,
    setDateType,
    setMultiDates,
    setSelectedDate,
  ]);

  const changeMilestoneName = (name: string) => {
    setMilestoneName(name);
    setErrorMessage('');
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsCategoryDropdownOpen(false);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    const scheduleRange = getScheduleRangeFromSelection(datePicker);
    const trimmedName = milestoneName.trim();

    if (!selectedCategory || !trimmedName || !scheduleRange || isRunning) {
      return;
    }

    setErrorMessage('');

    const categoryIdSnapshot = selectedCategory;
    const inputSnapshot: CreateScheduleItemInput = {
      title: trimmedName,
      start: scheduleRange.start,
      end: scheduleRange.end,
      dates: scheduleRange.dates,
      accent: activeCategory?.accent ?? '#171717',
    };

    await run(
      async () => {
        await onSubmit?.(categoryIdSnapshot, inputSnapshot);
        setMilestoneName('');
        onClose();
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '마일스톤을 저장하지 못했어요.',
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
              : '마일스톤을 삭제하지 못했어요.',
          );
        },
      },
    );
  };

  return {
    activeCategory,
    changeMilestoneName,
    datePicker,
    errorMessage,
    handleDelete,
    handleSubmit,
    isCategoryDropdownOpen,
    isRunning,
    milestoneName,
    selectCategory,
    selectedCategory,
    submitDisabledReason,
    toggleCategoryDropdown: () =>
      setIsCategoryDropdownOpen((previousValue) => !previousValue),
  };
};
