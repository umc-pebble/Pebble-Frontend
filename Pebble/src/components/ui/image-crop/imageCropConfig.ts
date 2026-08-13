export const ACCEPTED_IMAGE_TYPE_LIST = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_IMAGE_TYPES = ACCEPTED_IMAGE_TYPE_LIST.join(",");

export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const validateImageFile = (file: File) => {
  if (
    !ACCEPTED_IMAGE_TYPE_LIST.includes(
      file.type as (typeof ACCEPTED_IMAGE_TYPE_LIST)[number],
    )
  ) {
    return "JPG, PNG, WEBP 파일만 업로드할 수 있습니다.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return `이미지는 최대 ${MAX_IMAGE_SIZE_MB}MB까지 업로드할 수 있습니다.`;
  }

  return null;
};
