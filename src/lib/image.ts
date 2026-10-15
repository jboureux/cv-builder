interface ImageOptions {
  /** Plus grande dimension (px) de l'image stockée */
  maxSize?: number;
  /** Rend transparents les pixels quasi blancs (utile pour une signature scannée) */
  removeWhite?: boolean;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image illisible'));
    img.src = src;
  });

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/**
 * Lit un fichier image et le convertit en data URL PNG redimensionnée,
 * pour rester sous les limites du localStorage.
 */
export async function fileToDataURL(file: File, { maxSize = 800, removeWhite = false }: ImageOptions = {}) {
  const src = await readAsDataURL(file);
  if (file.type === 'image/svg+xml') return src;

  const img = await loadImage(src);
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (removeWhite) {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const lightness = Math.min(d[i], d[i + 1], d[i + 2]);
      if (lightness > 225) d[i + 3] = 0;
      else if (lightness > 180) d[i + 3] = Math.round((d[i + 3] * (225 - lightness)) / 45);
    }
    ctx.putImageData(pixels, 0, 0);
  }

  return canvas.toDataURL('image/png');
}
