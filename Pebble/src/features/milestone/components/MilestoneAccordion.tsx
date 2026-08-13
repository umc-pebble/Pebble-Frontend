import { MilestoneAccordionContent } from './milestone-accordion/MilestoneAccordionContent';
import { MilestoneAccordionHeader } from './milestone-accordion/MilestoneAccordionHeader';
import type { MilestoneAccordionProps } from './milestone-accordion/types';

export const MilestoneAccordion = ({
  category,
  expanded,
  onToggleExpanded,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onEditMilestone,
  onEditCategoryTask,
  onEditTask,
  onAddSchedule,
  onSelectCategory,
  onToggleVisibility,
  isSelected = false,
}: MilestoneAccordionProps) => (
  <section
    className={`relative flex w-[352px] shrink-0 flex-col items-center justify-center overflow-visible rounded-token-m bg-fill-inverse shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] dark:bg-[#222222] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)] ${
      isSelected
        ? "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-token-m after:border-2 after:border-border-selected after:content-['']"
        : ''
    }`}
  >
    <MilestoneAccordionHeader
      category={category}
      expanded={expanded}
      onSelectCategory={onSelectCategory}
      onToggleExpanded={onToggleExpanded}
      onToggleVisibility={onToggleVisibility}
    />

    {expanded ? (
      <MilestoneAccordionContent
        category={category}
        onAddSchedule={onAddSchedule}
        onEditCategoryTask={onEditCategoryTask}
        onEditMilestone={onEditMilestone}
        onEditTask={onEditTask}
        onToggleCategoryTaskCompleted={onToggleCategoryTaskCompleted}
        onToggleMilestoneCompleted={onToggleMilestoneCompleted}
        onToggleTaskCompleted={onToggleTaskCompleted}
      />
    ) : null}
  </section>
);
