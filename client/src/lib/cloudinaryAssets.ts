/**
 * Builds HTTPS delivery URLs for assets on Cloudinary.
 *
 * Expected upload layout (matches server upload folder `perfumeshop`):
 * - `perfumeshop/products/<basename>` — basename without extension, e.g. `valaya-white`
 * - `perfumeshop/ingredients/<basename>`
 * - `perfumeshop/banners/<basename>`
 */
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'dwj2trmn0';
const AUTO = 'q_auto,f_auto';

function basenameNoExt(filename: string): string {
  return filename.replace(/\.(png|jpe?g|webp|avif|gif)$/i, '');
}

export function productImage(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/products/${id}`;
}

export function ingredientImage(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/ingredients/${id}`;
}

export function bannerImage(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/banners/${id}`;
}

// Thêm đoạn này vào file cloudinaryAssets.ts
export function scentImage(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/Scents/${id}`;
}