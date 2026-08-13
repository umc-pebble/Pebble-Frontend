import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import type { Category, MilestoneItem } from "@/types";

type SelectButtonVariant = "surface" | "inverse";

type CategorySelectProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  isOpen: boolean;
  placeholder?: string;
  variant?: SelectButtonVariant;
  allowEmpty?: boolean;
  onToggleOpen: () => void;
  onSelectCategory: (categoryId: string | null) => void;
};

type MilestoneSelectProps = {
  milestones: MilestoneItem[];
  selectedMilestoneId: string | null;
  themeColor?: string;
  disabled?: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectMilestone: (milestoneId: string | null) => void;
};

type DropdownOptionRowProps = {
  label: string;
  barColor: string;
  isSelected?: boolean;
  onClick: () => void;
};

const getButtonClassName = (variant: SelectButtonVariant, isOpen: boolean) =>
  [
    "flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-token-s border pl-5 pr-3",
    isOpen || variant === "inverse"
      ? "border-border-primary bg-fill-inverse"
      : "border-border-secondary bg-fill-surface",
  ].join(" ");

const dropdownMenuClassName =
  "absolute left-0 top-14 z-20 flex max-h-[600px] w-full flex-col gap-2 overflow-y-auto rounded-token-s border border-border-teritory bg-fill-inverse p-3 shadow-[0px_2px_10px_0px_rgba(23,23,23,0.1)]";

const DropdownOptionRow = ({
  label,
  barColor,
  isSelected = false,
  onClick,
}: DropdownOptionRowProps) => (
  <button
    type="button"
    className={`relative flex h-12 w-full cursor-pointer items-start overflow-hidden rounded-token-s p-2 text-left transition-colors hover:bg-[rgba(23,23,23,0.05)] ${
      isSelected ? "bg-[rgba(23,23,23,0.1)]" : ""
    }`}
    onClick={onClick}
  >
    <div className="relative flex w-full min-w-0 items-center gap-2">
      <div
        className="h-8 w-[6px] shrink-0 rounded-token-xs"
        style={{ backgroundColor: barColor }}
      />
      <span className="min-w-0 truncate text-body-02-m text-text-strong">
        {label}
      </span>
    </div>
  </button>
);

const DropdownIconArea = () => (
  <span className="flex size-11 shrink-0 items-center justify-center rounded-token-s text-text-strong">
    <ChevronDownIcon className="size-6" />
  </span>
);

export const CategorySelect = ({
  categories,
  selectedCategoryId,
  isOpen,
  placeholder = "카테고리",
  variant = "surface",
  allowEmpty = false,
  onToggleOpen,
  onSelectCategory,
}: CategorySelectProps) => {
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    null;

  return (
    <div className="relative">
      <button
        type="button"
        className={getButtonClassName(variant, isOpen)}
        onClick={onToggleOpen}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {selectedCategory ? (
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="h-8 w-[6px] shrink-0 rounded-token-xs"
                style={{
                  backgroundColor: selectedCategory.themeBase || "#171717",
                }}
              />
              <span className="truncate text-body-02-m text-text-strong">
                {selectedCategory.title}
              </span>
            </div>
          ) : (
            <span className="truncate text-body-02-m text-text-strong">
              {placeholder}
            </span>
          )}
        </div>
        <DropdownIconArea />
      </button>

      {isOpen && (
        <div className={dropdownMenuClassName}>
          {allowEmpty && (
            <DropdownOptionRow
              label="선택 안 함"
              barColor="#171717"
              isSelected={selectedCategoryId === null}
              onClick={() => onSelectCategory(null)}
            />
          )}
          {categories.map((category) => (
            <DropdownOptionRow
              key={category.id}
              label={category.title}
              barColor={category.themeBase || "#171717"}
              isSelected={category.id === selectedCategoryId}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const MilestoneSelect = ({
  milestones,
  selectedMilestoneId,
  themeColor = "rgba(23,23,23,0.5)",
  disabled = false,
  isOpen,
  onToggleOpen,
  onSelectMilestone,
}: MilestoneSelectProps) => {
  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedMilestoneId) ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        className={getButtonClassName("surface", isOpen)}
        onClick={onToggleOpen}
        disabled={disabled}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {selectedMilestone ? (
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="h-8 w-[6px] shrink-0 rounded-token-xs"
                style={{ backgroundColor: themeColor }}
              />
              <span className="truncate text-body-02-m text-text-strong">
                {selectedMilestone.title}
              </span>
            </div>
          ) : (
            <span className="truncate text-body-02-m text-text-strong">
              마일스톤
            </span>
          )}
        </div>
        <DropdownIconArea />
      </button>

      {isOpen && (
        <div className={dropdownMenuClassName}>
          <DropdownOptionRow
            label="선택 안 함"
            barColor="#171717"
            isSelected={selectedMilestoneId === null}
            onClick={() => onSelectMilestone(null)}
          />
          {milestones.length > 0 ? (
            milestones.map((milestone) => (
              <DropdownOptionRow
                key={milestone.id}
                label={milestone.title}
                barColor={themeColor}
                isSelected={milestone.id === selectedMilestoneId}
                onClick={() => onSelectMilestone(milestone.id)}
              />
            ))
          ) : (
            <div className="p-2 text-center text-sm text-text-teritary">
              마일스톤이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
