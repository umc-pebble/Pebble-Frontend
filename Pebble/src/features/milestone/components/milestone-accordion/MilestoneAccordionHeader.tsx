import ChevronUpIcon from '@/assets/icons/chevron-up.svg?react';
import EyeOffIcon from '@/assets/icons/eye-off.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';
import type { Category } from '@/types';

type MilestoneAccordionHeaderProps = {
  category: Category;
  expanded: boolean;
  onSelectCategory?: (categoryId: string) => void;
  onToggleExpanded: () => void;
  onToggleVisibility?: (categoryId: string) => void | Promise<void>;
};

export const MilestoneAccordionHeader = ({
  category,
  expanded,
  onSelectCategory,
  onToggleExpanded,
  onToggleVisibility,
}: MilestoneAccordionHeaderProps) => {
  const isVisible = !category.isHidden;

  return (
    <div
      className="relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-token-m bg-fill-inverse py-3 pl-5 pr-3 transition-colors hover:bg-fill-surface dark:bg-[#222222]"
      onClick={() => onSelectCategory?.(category.id)}
    >
      <div className="relative flex w-[232px] min-w-0 items-center gap-3">
        <div
          className="relative h-10 w-2 rounded"
          style={{ backgroundColor: category.accent }}
        />
        <h2 className="min-w-0 truncate text-title-03-sb text-text-strong">
          {category.title}
        </h2>
      </div>

      <div className="inline-flex items-center justify-end">
        <button
          type="button"
          aria-label={`${category.title} 접기`}
          aria-expanded={expanded}
          onClick={(event) => {
            event.stopPropagation();
            onToggleExpanded();
          }}
          className="relative flex h-11 w-11 items-center justify-center rounded-token-s transition-colors hover:bg-fill-surface-hover"
        >
          <ChevronUpIcon
            className={`h-6 w-6 text-text-secondary transition-transform ${
              expanded ? '' : 'rotate-180'
            }`}
          />
        </button>

        {onToggleVisibility ? (
          <button
            type="button"
            aria-label={`${category.title} ${isVisible ? '숨기기' : '보이기'}`}
            aria-pressed={!isVisible}
            onClick={(event) => {
              event.stopPropagation();
              void onToggleVisibility(category.id);
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-token-s transition-colors hover:bg-fill-surface-hover"
          >
            {isVisible ? (
              <EyeOnIcon className="h-6 w-6 text-text-secondary" />
            ) : (
              <EyeOffIcon className="h-6 w-6 text-text-secondary dark:text-btn-secondary" />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
};
