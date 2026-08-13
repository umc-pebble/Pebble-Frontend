import { useEffect, useState } from "react";
import CloseIcon from "@/assets/icons/Close.svg?react";
import { ModalBackdrop } from "@/components/ui/ModalBackdrop";
import { type Category } from "@/types";

type DeleteCategoryModalProps = {
  isOpen: boolean;
  category: Category;
  onClose: () => void;
  onDelete: () => void;
};

export const DeleteCategoryModal = ({
  isOpen,
  category,
  onClose,
  onDelete,
}: DeleteCategoryModalProps) => {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatched = confirmText === category.title;

  return (
    <ModalBackdrop layerClassName="z-[60]">
      <div className="relative flex w-[655px] flex-col gap-5 rounded-[32px] bg-fill-inverse p-8 shadow-shadow-m max-sm:max-h-[calc(100dvh-32px)] max-sm:w-full max-sm:overflow-y-auto max-sm:rounded-token-m max-sm:p-4 dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]">
        
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="pt-2">
            <h2 className="text-title-02-sb text-text-strong">
              ‘{category.title}’ 카테고리를 삭제하시겠어요?
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-text-secondary hover:bg-fill-surface transition-colors dark:text-btn-secondary"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 확인 입력 영역 */}
        <div className="w-full flex flex-col gap-3">
          <p className="text-body-01-m text-text-strong">
            동의하시면 하단에 카테고리 이름을 적어주세요!
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={category.title}
            className="w-full p-3 bg-fill-inverse border border-border-default rounded-xl text-body-02-m text-text-strong placeholder:text-text-quaternary focus:outline-none focus:border-text-strong transition-colors dark:border-border-secondary dark:text-text-primary dark:focus:border-border-primary"
          />
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-token-s bg-btn-quaternary font-medium text-text-strong transition-colors hover:bg-btn-pressed dark:hover:bg-[#373737]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              if (isMatched) onDelete();
            }}
            disabled={!isMatched}
            className={`flex-1 h-11 rounded-token-s font-medium transition-all flex items-center justify-center ${
              isMatched 
                ? "bg-fill-danger text-text-onFill hover:opacity-90" 
                : "bg-fill-danger opacity-50 text-text-onFill cursor-not-allowed"
            }`}
          >
            삭제
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};
