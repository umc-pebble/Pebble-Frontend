import { ModalBackdrop } from '@/components/ui/ModalBackdrop';

type AddMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'global' | 'category';
  onSelectCategory?: () => void;
  onSelectMilestone: () => void;
  onSelectTask: () => void;
};

export const AddMenuModal = ({
  isOpen,
  onClose,
  variant = 'global',
  onSelectCategory,
  onSelectMilestone,
  onSelectTask,
}: AddMenuModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <div className="relative flex w-[359px] flex-col gap-[20px] rounded-[32px] bg-fill-inverse p-[32px] shadow-shadow-m dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]">
        <header className="flex items-center justify-between">
          <h2 className="text-title-02-sb text-text-strong">추가하기</h2>

          <button
            type="button"
            aria-label="추가하기 모달 닫기"
            onClick={onClose}
            className="text-text-strong transition-opacity hover:opacity-70"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </header>

        <div className="flex flex-col gap-[12px]">
          {variant === 'global' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectCategory?.();
              }}
              className="flex h-[44px] w-full items-center justify-center rounded-[12px] bg-btn-quaternary px-[20px] text-[16px] font-medium text-text-strong transition-colors hover:bg-btn-pressed"
            >
              카테고리
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectMilestone();
            }}
            className="flex h-[44px] w-full items-center justify-center rounded-[12px] bg-btn-quaternary px-[20px] text-[16px] font-medium text-text-strong transition-colors hover:bg-btn-pressed"
          >
            마일스톤
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectTask();
            }}
            className="flex h-[44px] w-full items-center justify-center rounded-[12px] bg-btn-quaternary px-[20px] text-[16px] font-medium text-text-strong transition-colors hover:bg-btn-pressed"
          >
            태스크
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};
