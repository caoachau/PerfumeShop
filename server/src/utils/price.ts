/** Effective unit price shown to customers after sale rules */
export function getEffectivePrice(price: number, salePrice?: number | null): number {
  if (salePrice === null || salePrice === undefined) return price;
  if (salePrice <= 0) return price;
  if (salePrice < price) return salePrice;
  return price;
}
