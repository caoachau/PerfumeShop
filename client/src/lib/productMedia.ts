import { productImage } from './cloudinaryAssets';

const FALLBACK_ORDER = ['valaya-white', 'delina-pink', 'tf-oud-wood', 'narciso-bleu-noir', 'layton-blue', 'blue_hope_xerjoff', 'Dior_Homme_Intense', 'hero'] as const;

/** First valid image URL from API, or rotating Cloudinary fallback (same folder as marketing assets). */
export function displayProductImage(images: string[] | undefined | null, salt = 0): string {
  const list = Array.isArray(images) ? images.map((u) => u.trim()).filter(Boolean) : [];
  if (list.length > 0) return list[0];
  const id = FALLBACK_ORDER[Math.abs(salt) % FALLBACK_ORDER.length];
  return productImage(id);
}

export function displayGalleryImages(images: string[] | undefined | null, salt = 0): string[] {
  const list = Array.isArray(images) ? images.map((u) => u.trim()).filter(Boolean) : [];
  if (list.length > 0) return list;
  return [displayProductImage([], salt)];
}

export function effectivePrice(price: number, salePrice?: number | null): number {
  if (salePrice != null && salePrice > 0 && salePrice < price) return salePrice;
  return price;
}

export function minVariantRetailPrice(
  variants: { price: number; salePrice?: number | null; stock?: number; isActive?: boolean }[],
): number {
  const active = variants.filter((v) => v.isActive !== false && (v.stock ?? 0) > 0);
  const pool = active.length ? active : variants;
  if (!pool.length) return 0;
  return Math.min(...pool.map((v) => effectivePrice(v.price, v.salePrice)));
}

export function formatVnd(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
}

export function brandDisplayName(brand: unknown): string {
  if (brand && typeof brand === 'object' && 'name' in brand && typeof (brand as { name: unknown }).name === 'string') {
    return (brand as { name: string }).name;
  }
  return '';
}
