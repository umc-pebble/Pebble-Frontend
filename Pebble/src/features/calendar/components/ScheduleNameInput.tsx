type ScheduleNameInputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
};

export const ScheduleNameInput = ({
  value,
  placeholder,
  onChange,
  className = "bg-fill-inverse font-medium placeholder:text-text-quaternary",
}: ScheduleNameInputProps) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={`w-full h-[48px] border border-border-default rounded-[12px] px-4 text-[16px] text-text-strong outline-none focus:border-border-primary transition-colors ${className}`}
  />
);
