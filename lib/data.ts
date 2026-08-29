/**
 * lib/data.ts
 *
 * Backward-compatibility shim — no mock data.
 * All real data comes from the PostgreSQL database via tRPC routers.
 *
 * This file provides:
 *  - Utility function re-exports from lib/utils/catalog.ts
 *  - CatalogProduct / CatalogVariant types used by UI components
 *  - Pure variant-manipulation helpers (getProductColors, etc.)
 */

// ── UI Utility re-exports ─────────────────────────────────────────────────────
export { formatPrice, styleCategories, stylesByCategory, getStylesForCategory, styleLabelMap, getStyleLabel, genderCategories, pakistanProvinces, getDbStyle } from './utils/catalog';

// ── Types ─────────────────────────────────────────────────────────────────────
export type CatalogVariant = {
  id: string;
  sizeUK: string;
  color: string;
  colorHex: string;
  isActive: boolean;
  sku?: string | null;
  priceDelta?: number;
  inventory?: { branchId: string; quantity: number; reserved: number }[];
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  articleNumber: string;
  basePrice: number;
  salePrice?: number | null;
  category: string;
  style: string;
  isActive: boolean;
  isFeatured: boolean;
  description: string;
  leatherType?: string | null;
  manufacturingCity?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  images: { url: string; altText?: string | null; isPrimary: boolean; colorTag?: string | null }[];
  variants: CatalogVariant[];
  _count?: { reviews: number };
};

// ── Empty stub — data comes from tRPC ─────────────────────────────────────────
export const products: CatalogProduct[] = [];

// ── Pricing helpers ───────────────────────────────────────────────────────────

/** Returns effective sale price, or base price if no sale */
export function getEffectivePrice(product: CatalogProduct): number {
  return Number(product.salePrice ?? product.basePrice);
}

/** Discount percentage off base price (0 if no sale) */
export function getDiscountPercent(product: CatalogProduct): number {
  if (!product.salePrice || Number(product.salePrice) >= Number(product.basePrice)) return 0;
  return Math.round(
    ((Number(product.basePrice) - Number(product.salePrice)) / Number(product.basePrice)) * 100
  );
}

// ── Variant helpers ───────────────────────────────────────────────────────────

/** Unique colors (with hex) from active variants, in variant order */
export function getProductColors(product: CatalogProduct): { name: string; hex: string }[] {
  const seen = new Set<string>();
  const result: { name: string; hex: string }[] = [];
  for (const v of product.variants) {
    if (!v.isActive || !v.color) continue;
    const normalizedName = v.color.trim();
    const key = normalizedName.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ name: normalizedName, hex: v.colorHex ?? '#888888' });
    }
  }
  return result;
}

/** Unique UK sizes from active variants */
export function getProductSizes(product: CatalogProduct): string[] {
  return [...new Set(product.variants.filter((v) => v.isActive).map((v) => v.sizeUK))];
}

/** Active variants matching a specific color */
export function getVariantsByColor(product: CatalogProduct, color: string): CatalogVariant[] {
  const targetColor = color.trim().toLowerCase();
  return product.variants.filter((v) => v.isActive && v.color?.trim().toLowerCase() === targetColor);
}

/** Find one variant by color + size */
export function getVariant(
  product: CatalogProduct,
  color: string,
  size: string
): CatalogVariant | undefined {
  const targetColor = color.trim().toLowerCase();
  return product.variants.find(
    (v) => v.isActive && v.color?.trim().toLowerCase() === targetColor && v.sizeUK === size
  );
}

/** True if variant has any inventory available across branches */
export function isVariantInStock(variant: CatalogVariant): boolean {
  if (!variant.inventory?.length) return variant.isActive;
  return variant.inventory.some((inv) => inv.quantity - inv.reserved > 0);
}
