import { useId, useRef } from "react";
import { useState, type ChangeEvent } from "react";
import UploadIcon from "@/assets/icons/Upload.svg?react";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  validateImageFile,
} from "@/components/ui/image-crop/imageCropConfig";

type CategoryImageUploaderProps = {
  imageUrl?: string;
  onImageChange: (imageUrl: string | undefined) => void;
  onSelectImageFile: (imageFile: File) => void;
};

export const CategoryImageUploader = ({
  imageUrl,
  onImageChange,
  onSelectImageFile,
}: CategoryImageUploaderProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationMessage = validateImageFile(file);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      event.target.value = "";
      return;
    }

    setErrorMessage("");
    onSelectImageFile(file);
    event.target.value = "";
  };

  return (
    <div className="flex w-[175px] shrink-0 flex-col items-start gap-2 max-sm:w-full">
      <label className="text-body-01-sb text-text-primary" htmlFor={inputId}>
        대표 이미지 (선택)
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-[234px] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-token-s border border-dashed border-border-default bg-fill-inverse transition-colors hover:bg-fill-surface max-sm:h-[180px] dark:border-border-secondary"
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="선택한 대표 이미지"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-fill-shadow px-3 py-2 text-center text-caption-01 text-text-onFill">
              이미지 변경
            </span>
          </>
        ) : (
          <>
            <UploadIcon className="h-11 w-11 text-text-secondary dark:text-btn-secondary" />
            <span className="text-body-02-m text-text-secondary">이미지 추가</span>
            <span className="mt-3 whitespace-pre-line text-center text-caption-01 text-text-teritary">
              JPEG · PNG · WEBP{"\n"}최대 {MAX_IMAGE_SIZE_MB}MB
            </span>
          </>
        )}
      </button>
      {imageUrl && (
        <button
          type="button"
          onClick={() => onImageChange(undefined)}
          className="w-full text-center text-caption-01 text-text-secondary hover:text-fill-danger"
        >
          이미지 삭제
        </button>
      )}
      {errorMessage && (
        <p className="text-caption-01 text-fill-danger">{errorMessage}</p>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
};
