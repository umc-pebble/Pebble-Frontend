import { ImageCropModal } from '@/components/ui/image-crop/ImageCropModal';
import { ModalActionBar } from '@/components/ui/ModalActionBar';
import { ModalBackdrop } from '@/components/ui/ModalBackdrop';
import { useCategoryFormState } from '@/features/category/hooks/useCategoryFormState';
import { CATEGORY_IMAGE_ASPECT_RATIO } from '@/features/category/utils/categoryFormUtils';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';
import type { Category } from '@/types';

import { CategoryColorPicker } from './CategoryColorPicker';
import { CategoryImageUploader } from './CategoryImageUploader';
import { CategoryMemberList } from './CategoryMemberList';
import { CategoryMemberSelector } from './CategoryMemberSelector';
import { CategoryShareOption } from './CategoryShareOption';
import { CategoryStatusOptions } from './CategoryStatusOptions';
import { CategoryThemePreview } from './CategoryThemePreview';

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: 'create' | 'edit';
  category?: Category;
  currentUserId?: number | null;
  onClose: () => void;
  onRequestDelete?: () => void | Promise<void>;
  onLeaveCategory?: () => void | Promise<void>;
  onSubmit?: (
    input: CreateCategoryInput | UpdateCategoryInput,
  ) => void | Promise<void>;
};

export const CategoryFormModal = ({
  isOpen,
  mode = 'create',
  category,
  currentUserId,
  onClose,
  onRequestDelete,
  onLeaveCategory,
  onSubmit,
}: CategoryFormModalProps) => {
  const {
    canDeleteCategory,
    canToggleShared,
    categoryName,
    changeCategoryName,
    closeImageCrop,
    cropSourceImageFile,
    errorMessage,
    filteredFriends,
    handleDelete,
    handleDropdownOpenChange,
    handleSubmit,
    imageUrl,
    isCompleted,
    isDropdownOpen,
    isPublic,
    isRunning,
    isShared,
    openImageCrop,
    searchQuery,
    selectedColor,
    selectedMembers,
    selectedTheme,
    setImageUrl,
    setSearchQuery,
    setSelectedColor,
    shouldShowMemberList,
    submitDisabledReason,
    toggleCompleted,
    toggleMember,
    togglePublic,
    toggleShared,
  } = useCategoryFormState({
    category,
    isOpen,
    mode,
    onClose,
    onRequestDelete,
    onSubmit,
  });

  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <div className="flex w-[607px] flex-col items-center gap-5 rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m max-sm:max-h-[calc(100dvh-32px)] max-sm:w-full max-sm:overflow-y-auto max-sm:rounded-token-m max-sm:p-4 dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]">
        <header className="flex w-full items-center justify-between">
          <h2 className="w-full text-title-02-sb text-text-strong">
            {mode === 'create'
              ? '카테고리 추가하기'
              : '카테고리 편집하기'}
          </h2>
        </header>

        <div className="flex w-full flex-col items-start gap-5">
          <div className="flex w-full items-start gap-token-xxl max-sm:flex-col max-sm:items-stretch max-sm:gap-token-l">
            <CategoryImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
              onSelectImageFile={openImageCrop}
            />

            <div className="flex w-[328px] flex-col justify-center gap-5 max-sm:w-full max-sm:min-w-0">
              <div className="flex w-full flex-col gap-2">
                <label className="flex items-center gap-1 text-body-01-sb text-text-primary">
                  카테고리 이름
                  <span className="text-body-01-sb text-fill-danger">*</span>
                </label>

                <input
                  type="text"
                  value={categoryName}
                  disabled={isRunning}
                  onChange={(event) => changeCategoryName(event.target.value)}
                  placeholder="텍스트, 특수문자, 이모티콘 가능"
                  className={[
                    'w-full rounded-token-s border border-border-default',
                    'bg-fill-inverse p-token-m',
                    'text-body-02-m text-text-primary',
                    'placeholder:text-text-quaternary',
                    'focus:border-text-strong focus:outline-none',
                    'dark:border-border-secondary dark:focus:border-border-primary',
                    'disabled:cursor-not-allowed',
                  ].join(' ')}
                />
              </div>

              <CategoryColorPicker
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
              <CategoryThemePreview theme={selectedTheme} />
            </div>
          </div>

          <CategoryStatusOptions
            isPublic={isPublic}
            isCompleted={isCompleted}
            onTogglePublic={togglePublic}
            onToggleCompleted={toggleCompleted}
          />
        </div>

        <CategoryShareOption
          isShared={isShared}
          disabled={!canToggleShared}
          onToggleShared={toggleShared}
        />

        {isShared ? (
          <div className="flex w-full flex-col gap-token-m">
            <div className="flex w-full flex-col gap-token-s">
              <h3 className="text-body-01-sb tracking-[-0.18px] text-text-primary">
                친구 초대
              </h3>

              <CategoryMemberSelector
                selectedMembers={selectedMembers}
                filteredFriends={filteredFriends}
                searchQuery={searchQuery}
                isDropdownOpen={isDropdownOpen}
                showSelectedMembersInInput={mode === 'create'}
                onSearchChange={setSearchQuery}
                onDropdownOpenChange={handleDropdownOpenChange}
                onToggleMember={toggleMember}
              />
            </div>

            {shouldShowMemberList ? (
              <div className="flex w-full flex-col gap-token-s">
                <h3 className="text-body-01-sb tracking-[-0.18px] text-text-primary">
                  구성원
                </h3>

                <CategoryMemberList
                  members={selectedMembers}
                  currentUserId={currentUserId}
                  onRemoveMember={toggleMember}
                  onLeaveCategory={onLeaveCategory}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {errorMessage ? (
          <p
            role="alert"
            className="w-full text-caption-01 text-fill-danger"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex w-full flex-col gap-5">
          <ModalActionBar
            submitLabel={mode === 'create' ? '추가' : '수정'}
            disabled={Boolean(submitDisabledReason)}
            isBusy={isRunning}
            disabledReason={submitDisabledReason}
            onCancel={onClose}
            onSubmit={handleSubmit}
            onDelete={
              mode === 'edit' && canDeleteCategory
                ? handleDelete
                : undefined
            }
            deleteLabel="카테고리 삭제"
          />
        </div>

        <ImageCropModal
          isOpen={Boolean(cropSourceImageFile)}
          imageUrl={null}
          imageFile={cropSourceImageFile}
          title="대표 이미지 편집"
          description="선택한 이미지를 드래그하고 확대해서 카테고리 대표 이미지 영역에 맞춰보세요."
          closeLabel="대표 이미지 편집 닫기"
          applyLabel="적용"
          changeImageLabel="이미지 다시 선택"
          aspect={CATEGORY_IMAGE_ASPECT_RATIO}
          cropShape="rect"
          onClose={closeImageCrop}
          onChangeImage={(croppedImageUrl) => {
            setImageUrl(croppedImageUrl);
            closeImageCrop();
          }}
        />
      </div>
    </ModalBackdrop>
  );
};
