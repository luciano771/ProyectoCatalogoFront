const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function isAllowedImageType(type: string): boolean {
  return ALLOWED_TYPES.includes(type);
}

export function isAllowedImageSize(bytes: number): boolean {
  return bytes <= MAX_IMAGE_SIZE_BYTES;
}

/**
 * Lee un archivo como data URL (base64). Para usar como src de img o guardar en backend.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isAllowedImageType(file.type)) {
      reject(new Error('Formato no permitido. Usá JPG, PNG, GIF o WebP.'));
      return;
    }
    if (!isAllowedImageSize(file.size)) {
      reject(new Error(`La imagen no puede superar ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024} MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}
