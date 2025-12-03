export const compressBase64Image = async (
  base64String: string,
  maxWidth = 800,
  quality = 0.7,
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(base64String);
        return;
      }

      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      resolve(base64String);
    };
  });
};

export const getImageSizeInKB = (base64String: string): number => {
  const base64 = base64String.replace(/^data:image\/\w+;base64,/, "");
  return (base64.length * 3) / 4 / 1024;
};
