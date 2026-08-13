import { ScheduleDatePicker } from '@/components/ui/ScheduleDatePicker';
import {
  CategorySelect,
  MilestoneSelect,
} from '@/features/calendar/components/ScheduleRelationSelects';
import { ScheduleFormModalFrame } from '@/features/calendar/components/ScheduleFormModalFrame';
import { ScheduleNameInput } from '@/features/calendar/components/ScheduleNameInput';
import {
  useTaskFormState,
  type TaskFormSubmitInput,
} from '@/features/task/hooks/useTaskFormState';
import type { Category, ScheduleItem } from '@/types';

export type { TaskFormSubmitInput } from '@/features/task/hooks/useTaskFormState';

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  defaultCategoryId?: string | null;
  defaultMilestoneId?: string | null;
  task?: ScheduleItem | null;
  mode?: 'create' | 'edit';
  onSubmit?: (
    input: TaskFormSubmitInput,
  ) => void | Promise<void>;
  onRequestDelete?: () => void | Promise<void>;
};

export const TaskFormModal = ({
  isOpen,
  onClose,
  categories,
  defaultCategoryId = null,
  defaultMilestoneId = null,
  task = null,
  mode = 'create',
  onSubmit,
  onRequestDelete,
}: TaskFormModalProps) => {
  const {
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
  } = useTaskFormState({
    categories,
    defaultCategoryId,
    defaultMilestoneId,
    isOpen,
    task,
    onClose,
    onSubmit,
    onRequestDelete,
  });

  if (!isOpen) return null;

  return (
    <ScheduleFormModalFrame
      title={mode === 'edit' ? '태스크 편집' : '태스크 추가하기'}
      submitLabel={mode === 'edit' ? '수정' : '추가'}
      disabled={Boolean(submitDisabledReason) || isRunning}
      disabledReason={isRunning ? undefined : submitDisabledReason}
      isBusy={isRunning}
      titleClassName="leading-[1.3]"
      onCancel={onClose}
      onSubmit={handleSubmit}
      onDelete={
        mode === 'edit' && onRequestDelete ? handleDelete : undefined
      }
    >
      <div className="mt-2 flex w-full flex-col gap-3">
        <div className="flex w-full items-center gap-3">
          <div className="flex-[1]">
            <CategorySelect
              categories={categories}
              selectedCategoryId={selectedCategory}
              isOpen={isCategoryDropdownOpen}
              allowEmpty
              onToggleOpen={toggleCategoryDropdown}
              onSelectCategory={selectCategory}
            />
          </div>

          <div className="flex-[1]">
            <MilestoneSelect
              milestones={availableMilestones}
              selectedMilestoneId={selectedMilestone}
              themeColor={activeCategory?.themeMid}
              disabled={!activeCategory}
              isOpen={isMilestoneDropdownOpen}
              onToggleOpen={toggleMilestoneDropdown}
              onSelectMilestone={selectMilestone}
            />
          </div>
        </div>

        <ScheduleNameInput
          placeholder="태스크 이름을 입력해 주세요"
          value={taskName}
          onChange={changeTaskName}
        />
      </div>

      <ScheduleDatePicker
        variant="task"
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
