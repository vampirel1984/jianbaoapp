export default function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('无法获取canvas上下文'));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('生成Blob失败'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = error => {
      reject(error);
    };
  });
}