import {
  createCanvas,
  loadImage,
  type Image,
  type ImageData,
} from "@napi-rs/canvas";
import { encode } from "blurhash";

const getImageData = (image: Image): ImageData => {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, image.width, image.height);
  return context.getImageData(0, 0, image.width, image.height);
};

export const encodeImageToBlurhash = async (imageUrl: string): Promise<string | null> => {
  try {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
  } catch (error) {
    console.error(error);
    return null;
  }
};
