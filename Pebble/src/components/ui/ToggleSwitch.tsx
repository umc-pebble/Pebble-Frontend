import type { ButtonHTMLAttributes } from "react";

type ToggleSwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "role" | "onChange" | "onToggle"
> & {
  checked: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
  checkedClassName?: string;
  uncheckedClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
  onToggle?: () => void;
};

export const ToggleSwitch = ({
  checked,
  checkedLabel,
  uncheckedLabel,
  checkedClassName = "bg-btn-primary",
  uncheckedClassName = "bg-border-default",
  disabled = false,
  className = "",
  type = "button",
  onCheckedChange,
  onToggle,
  ...props
}: ToggleSwitchProps): JSX.Element => (
  <div className="flex items-center gap-2">
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }

        onCheckedChange?.(!checked);
        onToggle?.();
      }}
      className={[
        "relative h-[30px] w-[52px] shrink-0 overflow-hidden rounded-token-infinite",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        checked
          ? checkedClassName
          : `${uncheckedClassName} dark:bg-[#5C5C5C]`,
        className,
      ].join(" ")}
      {...props}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute left-[3px] top-[3px] h-6 w-6 rounded-token-infinite",
          "transition-[background-color,transform]",
          checked
            ? "translate-x-[22px] bg-fill-inverse dark:bg-fill-surface"
            : "translate-x-0 bg-fill-inverse dark:bg-fill-inverse",
        ].join(" ")}
      />
    </button>
    {checkedLabel && uncheckedLabel && (
      <span className="text-body-02-m text-text-secondary">
        {checked ? checkedLabel : uncheckedLabel}
      </span>
    )}
  </div>
);
