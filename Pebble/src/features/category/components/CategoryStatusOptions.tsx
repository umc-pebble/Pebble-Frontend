import { InfoBadge } from "@/components/ui/InfoBadge";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

type CategoryStatusOptionsProps = {
  isPublic: boolean;
  isCompleted: boolean;
  onTogglePublic: () => void;
  onToggleCompleted: () => void;
};

export const CategoryStatusOptions = ({
  isPublic,
  isCompleted,
  onTogglePublic,
  onToggleCompleted,
}: CategoryStatusOptionsProps): JSX.Element => (
  <div className="flex w-full items-start rounded-token-s bg-fill-surface px-token-l py-token-m dark:bg-[#17171766]">
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="text-body-01-sb text-text-primary">공개 설정</span>
        <InfoBadge description="비공개 시 팔로잉 유저에게 카테고리, 마일스톤, 태스크 전부 미노출" />
      </div>
      <ToggleSwitch
        checked={isPublic}
        checkedLabel="공개"
        uncheckedLabel="비공개"
        aria-label="공개 설정"
        onToggle={onTogglePublic}
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="text-body-01-sb text-text-primary">완료 여부</span>
        <InfoBadge description="완료 처리 시 완료된 카테고리로 분류됩니다" />
      </div>
      <ToggleSwitch
        checked={isCompleted}
        checkedLabel="완료"
        uncheckedLabel="미완료"
        aria-label="완료 여부"
        onToggle={onToggleCompleted}
      />
    </div>
  </div>
);
