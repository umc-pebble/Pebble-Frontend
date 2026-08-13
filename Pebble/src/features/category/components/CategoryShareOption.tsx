import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

type CategoryShareOptionProps = {
  isShared: boolean;
  disabled?: boolean;
  onToggleShared: () => void;
};

export const CategoryShareOption = ({
  isShared,
  disabled = false,
  onToggleShared,
}: CategoryShareOptionProps): JSX.Element => (
  <div className="flex w-full items-center justify-between rounded-token-s border border-border-default bg-fill-inverse px-5 py-3 dark:border-border-secondary">
    <div className="flex flex-col items-start gap-1">
      <p className="text-body-01-sb text-text-primary">친구와 함께하기</p>
      <p className="text-caption-01 text-text-teritary">
        초대한 친구와 공유 카테고리를 함께 채워요
      </p>
    </div>
    <ToggleSwitch
      checked={isShared}
      aria-label="친구와 함께하기"
      disabled={disabled}
      onToggle={onToggleShared}
    />
  </div>
);
