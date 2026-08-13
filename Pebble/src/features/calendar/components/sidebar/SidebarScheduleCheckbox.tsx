import CheckIcon from "@/assets/icons/Check.svg?react";

type SidebarScheduleCheckboxProps = {
  checked: boolean;
  ariaLabel: string;
  onChange: () => void;
  stopPropagation?: boolean;
};

export const SidebarScheduleCheckbox = ({
  checked,
  ariaLabel,
  onChange,
  stopPropagation = false,
}: SidebarScheduleCheckboxProps) => (
  <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
    <input
      type="checkbox"
      aria-label={ariaLabel}
      checked={checked}
      onClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }
      }}
      onChange={(event) => {
        if (stopPropagation) {
          event.stopPropagation();
        }

        onChange();
      }}
      className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
    />
    <span
      className={`flex size-6 items-center justify-center overflow-hidden rounded-token-xs ${
        checked
          ? "border-2 border-fill-inverse bg-btn-primary dark:border-fill-inverse"
          : "border border-border-secondary bg-fill-inverse dark:border-border-secondary dark:bg-fill-inverse"
      }`}
      aria-hidden="true"
    >
      {checked && <CheckIcon className="size-5 text-text-onFill" />}
    </span>
  </span>
);
