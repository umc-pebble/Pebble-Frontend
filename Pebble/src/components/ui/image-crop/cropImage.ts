import type { Area } from "react-easy-crop";

const createImage = (imageUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = imageUrl;
  });

export const getCroppedImageUrl = async (
  imageUrl: string,
  croppedAreaPixels: Area,
  rotation = 0,
) => {
  const image = await createImage(imageUrl);
  const rotatedCanvas = document.createElement("canvas");
  const rotatedContext = rotatedCanvas.getContext("2d");

  if (!rotatedContext) {
    return null;
  }

  const rotationRadians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotationRadians));
  const cos = Math.abs(Math.cos(rotationRadians));
  const rotatedWidth = image.width * cos + image.height * sin;
  const rotatedHeight = image.width * sin + image.height * cos;

  rotatedCanvas.width = rotatedWidth;
  rotatedCanvas.height = rotatedHeight;

  rotatedContext.translate(rotatedWidth / 2, rotatedHeight / 2);
  rotatedContext.rotate(rotationRadians);
  rotatedContext.drawImage(
    image,
    -image.width / 2,
    -image.height / 2,
  );

  const croppedCanvas = document.createElement("canvas");
  const croppedContext = croppedCanvas.getContext("2d");

  if (!croppedContext) {
    return null;
  }

  croppedCanvas.width = croppedAreaPixels.width;
  croppedCanvas.height = croppedAreaPixels.height;
  croppedContext.drawImage(
    rotatedCanvas,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  );

  return croppedCanvas.toDataURL("image/png");
};
