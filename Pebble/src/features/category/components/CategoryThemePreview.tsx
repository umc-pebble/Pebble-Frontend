import type { CategoryColorTheme } from "@/utils/categoryColorTheme";

type CategoryThemePreviewProps = {
  theme: CategoryColorTheme;
};

export const CategoryThemePreview = ({
  theme,
}: CategoryThemePreviewProps): JSX.Element => (
  <div className="flex w-full flex-col gap-2 rounded-token-s">
    <p className="text-body-02-m text-text-teritary">자동 적용 미리보기</p>
    <div className="flex h-10 w-full gap-2 overflow-hidden">
      <div
        className="h-full w-10 shrink-0 rounded-token-s shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]"
        style={{ backgroundColor: theme.themeBase }}
      />
      <div
        className="flex h-full flex-1 items-center justify-center rounded-token-s shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]"
        style={{ backgroundColor: theme.themeMid }}
      >
        <span
          className="text-body-03-r"
          style={{ color: theme.themeTextOnMid }}
        >
          마일스톤
        </span>
      </div>
      <div
        className="flex h-full flex-1 items-center justify-center rounded-token-s shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]"
        style={{ backgroundColor: theme.themeLight }}
      >
        <span
          className="text-body-03-r"
          style={{ color: theme.themeTextOnLight }}
        >
          태스크
        </span>
      </div>
    </div>
  </div>
);
