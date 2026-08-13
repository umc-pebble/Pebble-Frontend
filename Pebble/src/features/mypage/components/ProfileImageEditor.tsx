import { useState } from "react";

import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import EditIcon from "@/assets/icons/newedit.svg?react";
import { ImageCropModal } from "@/components/ui/image-crop/ImageCropModal";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";

export const ProfileImageEditor = (): JSX.Element => {
  const imageUrl = useProfileStore(
    (state) => state.pendingImageUrl ?? state.profile.imageUrl,
  );
  const updateProfileImage = useProfileStore(
    (state) => state.updateProfileImage,
  );
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  return (
    <>
      <div className="relative size-32">
        <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-theme-2-base text-text-strong">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="프로필 이미지"
              className="size-full object-cover"
            />
          ) : (
            <MySolidIcon className="size-16" />
          )}
        </div>

        <button
          type="button"
          className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border border-border-default bg-fill-inverse text-text-secondary shadow-shadow-s transition-colors hover:bg-fill-surface hover:text-text-strong"
          aria-label="프로필 이미지 변경"
          onClick={() => setIsCropModalOpen(true)}
        >
          <EditIcon className="size-5" />
        </button>
      </div>

      <ImageCropModal
        isOpen={isCropModalOpen}
        imageUrl={imageUrl ?? null}
        title="프로필 사진 편집"
        description="이미지를 드래그하고 확대해서 원형 프로필 영역을 맞춰보세요."
        closeLabel="프로필 사진 편집 닫기"
        applyLabel="저장"
        changeImageLabel="이미지 다시 선택"
        cropShape="round"
        onClose={() => setIsCropModalOpen(false)}
        onChangeImage={(croppedImageUrl) => {
          setIsCropModalOpen(false);
          void updateProfileImage(croppedImageUrl).catch(() => undefined);
        }}
      />
    </>
  );
};
