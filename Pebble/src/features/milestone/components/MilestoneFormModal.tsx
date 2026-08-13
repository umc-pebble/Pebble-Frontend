import { ScheduleDatePicker } from '@/components/ui/ScheduleDatePicker';
import { CategorySelect } from '@/features/calendar/components/ScheduleRelationSelects';
import { ScheduleFormModalFrame } from '@/features/calendar/components/ScheduleFormModalFrame';
import { ScheduleNameInput } from '@/features/calendar/components/ScheduleNameInput';
import type { CreateScheduleItemInput } from '@/features/calendar/types';
import { useMilestoneFormState } from '@/features/milestone/hooks/useMilestoneFormState';
import type { Category, MilestoneItem } from '@/types';

type MilestoneFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  mode?: 'create' | 'edit';
  milestone?: MilestoneItem | null;
  defaultCategoryId?: string | null;
  onSubmit?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onRequestDelete?: () => void | Promise<void>;
};

export const MilestoneFormModal = ({
  isOpen,
  onClose,
  categories,
  mode = 'create',
  milestone = null,
  defaultCategoryId = null,
  onSubmit,
  onRequestDelete,
}: MilestoneFormModalProps) => {
  const {
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
    toggleCategoryDropdown,
  } = useMilestoneFormState({
    categories,
    defaultCategoryId,
    isOpen,
    milestone,
    onClose,
    onSubmit,
    onRequestDelete,
  });

  if (!isOpen) return null;

  return (
    <ScheduleFormModalFrame
      title={
        mode === 'edit' ? '마일스톤 수정하기' : '마일스톤 추가하기'
      }
      submitLabel={mode === 'edit' ? '수정' : '추가'}
      disabled={Boolean(submitDisabledReason)}
      isBusy={isRunning}
      disabledReason={submitDisabledReason}
      gapClassName="gap-10"
      onCancel={onClose}
      onSubmit={handleSubmit}
      onDelete={
        mode === 'edit' && onRequestDelete ? handleDelete : undefined
      }
    >
      <div className="flex w-full items-center gap-4">
        <div className="relative flex-[4]">
          <CategorySelect
            categories={categories}
            selectedCategoryId={selectedCategory}
            isOpen={isCategoryDropdownOpen}
            onToggleOpen={toggleCategoryDropdown}
            onSelectCategory={selectCategory}
          />
        </div>

        <div className="flex-[6]">
          <ScheduleNameInput
            placeholder="마일스톤 이름을 입력해 주세요"
            value={milestoneName}
            onChange={changeMilestoneName}
            className="bg-transparent placeholder:text-text-teritary"
          />
        </div>
      </div>

      <ScheduleDatePicker
        variant="milestone"
        disabled={!selectedCategory}
        dateType={datePicker.dateType}
        onDateTypeChange={datePicker.setDateType}
        currentYear={datePicker.currentYear}
        currentMonth={datePicker.currentMonth}
        daysInMonth={datePicker.daysInMonth}
        firstDay={datePicker.firstDay}
        onPrevMonth={datePicker.handlePrevMonth}
        onNextMonth={datePicker.handleNextMonth}
        onDateClick={datePicker.handleDateClick}
        getDayStatus={datePicker.getDayStatus}
        themeBaseColor={activeCategory?.themeBase}
        themeMidColor={activeCategory?.themeMid}
        themeLightColor={activeCategory?.themeLight}
      />

      {errorMessage ? (
        <p role="alert" className="text-caption-01 text-fill-danger">
          {errorMessage}
        </p>
      ) : null}
    </ScheduleFormModalFrame>
  );
};
