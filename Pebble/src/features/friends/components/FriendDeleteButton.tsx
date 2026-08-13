import { Trash2 } from "lucide-react";

export const FriendDeleteButton = ({
  nickname,
  disabled,
  onClick,
}: {
  nickname: string;
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="relative flex size-11 items-center justify-center overflow-hidden rounded-token-s bg-fill-danger text-text-onFill transition-colors before:pointer-events-none before:absolute before:inset-0 before:transition-colors hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)] disabled:opacity-50 dark:bg-fill-danger dark:text-[#242424] dark:before:bg-[rgba(23,23,23,0.7)] dark:hover:before:bg-[rgba(23,23,23,0.7)] dark:active:before:bg-[rgba(23,23,23,0.7)]"
    aria-label={`${nickname} 친구 삭제`}
  >
    <Trash2 className="relative z-10 size-5" strokeWidth={2} />
  </button>
);
