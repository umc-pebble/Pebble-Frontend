type ProgressBarProps = {
  progress: number;
  themeBaseColor?: string;
  className?: string;
};

export const ProgressBar = ({
  progress,
  themeBaseColor = "#171717",
  className = "",
}: ProgressBarProps) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex items-end gap-2">
        <span className="text-body-02-sb text-text-strong">현재 진행률</span>
        <span
          className="text-[14px] font-medium leading-5"
          style={{ color: themeBaseColor }}
        >
          {safeProgress}%
        </span>
      </div>
      <div className="w-full h-2 bg-fill-teritory rounded-token-infinite overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${safeProgress}%`,
            backgroundColor: themeBaseColor,
          }}
        />
      </div>
    </div>
  );
};
