import React from "react";
import PlusIcon from "@/assets/icons/Plus.svg?react";

type AddButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  showIcon?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const AddButton = ({
  label,
  variant = "primary",
  className = "",
  showIcon = true,
  onClick,
}: AddButtonProps) => {
  const baseClass = "h-12 flex items-center justify-center rounded-token-s shrink-0 transition-all";
  
  const variantClass = 
    variant === "primary"
      ? "bg-fill-primary hover:opacity-90 text-text-onFill dark:hover:opacity-95"
      : "bg-btn-quaternary hover:bg-btn-pressed text-text-secondary dark:text-text-secondary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${className}`}
      aria-label={label}
    >
      {variant === "primary" && showIcon && (
        <PlusIcon className="w-4 h-4 text-text-onFill mr-2" />
      )}
      <span className={variant === "primary" ? "text-body-02-m" : "text-body-02-m"}>
        {label}
      </span>
    </button>
  );
};
