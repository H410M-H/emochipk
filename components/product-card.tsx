'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CatalogProduct } from '@/lib/data';
import {
  formatPrice,
  getDiscountPercent,
  getEffectivePrice,
  getProductColors,
} from '@/lib/data';

interface ProductCardProps {
  product: CatalogProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const colors = getProductColors(product).slice(0, 5);
  const discountPct = getDiscountPercent(product);
  const effectivePrice = getEffectivePrice(product);

  // Active displayed image: color-selected image > primary image > first image
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const colorMatchedImage = selectedColorName
    ? product.images.find((img) => img.colorTag === selectedColorName)
    : null;
  const activeImage = colorMatchedImage ?? primaryImage;

  // Secondary image for hover swap effect
  const secondaryImage = product.images.find(
    (img) => img.url !== activeImage?.url
  );

  const styleLabelMap: Record<string, string> = {
    SANDALS: 'Chappal / Sandals',
    PESHAWARI: 'Peshawari',
    SNEAKERS: 'Jogger / Sneakers',
    OXFORD: 'Formal Shoe',
    LOAFERS: 'Loafer',
    MOCCASINS: 'Moccasin',
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col h-full rounded-2xl bg-card border border-border/40 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 transform hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          {activeImage ? (
            <>
              {/* Primary / Active Image */}
              <Image
                src={activeImage.url}
                alt={activeImage.altText ?? product.name}
                fill
                className={cn(
                  'object-cover transition-all duration-500 ease-out group-hover:scale-105',
                  secondaryImage && 'group-hover:opacity-0'
                )}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
              {/* Secondary Hover Image (if available) */}
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.altText ?? `${product.name} alternate`}
                  fill
                  className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              )}
            </>
          ) : (
            // Fallback icon placeholder
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
              <span className="text-5xl animate-float">
                {product.style === 'SANDALS'
                  ? '🩴'
                  : product.style === 'PESHAWARI'
                  ? '🥿'
                  : product.style === 'SNEAKERS'
                  ? '👟'
                  : '👞'}
              </span>
              <span className="text-xs text-muted-foreground font-medium font-mono">
                {product.articleNumber}
              </span>
            </div>
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          {discountPct && (
            <Badge className="bg-red-500 text-white font-bold text-xs px-2.5 py-0.5 shadow-sm animate-pulse-glow">
              -{discountPct}% OFF
            </Badge>
          )}
          {product.isFeatured && !discountPct && (
            <Badge className="bg-amber-400 text-stone-950 font-bold text-xs px-2.5 py-0.5 shadow-sm">
              ★ Featured
            </Badge>
          )}
        </div>

        {/* Article No Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="text-[10px] font-mono bg-black/60 text-white/90 rounded-md px-2 py-0.5 backdrop-blur-md border border-white/10 shadow-xs">
            {product.articleNumber}
          </span>
        </div>

        {/* Wishlist Floating Button */}
        <div className="absolute top-2.5 right-2.5 z-10 opacity-90 sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-300">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsWishlisted((prev) => !prev)}
            aria-label="Add to wishlist"
            className={cn(
              'h-9 w-9 rounded-full shadow-md backdrop-blur-md transition-all active:scale-90',
              isWishlisted
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 text-stone-900 dark:bg-stone-900/90 dark:text-white hover:bg-white hover:text-amber-600'
            )}
          >
            <Heart
              className={cn('h-4 w-4 transition-transform duration-300', isWishlisted && 'fill-current scale-110')}
            />
          </Button>
        </div>

        {/* Hover Quick Action Bar */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            asChild
            size="sm"
            className="w-full bg-stone-950/90 hover:bg-stone-900 text-white backdrop-blur-md text-xs font-semibold h-9 rounded-xl shadow-lg border border-white/10 active:scale-[0.98]"
          >
            <Link href={`/product/${product.slug}`}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View Options &amp; Sizes
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
        <div>
          {/* Color Swatches (Interactive) */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-1.5">
              {colors.map((color) => {
                const isSelected = selectedColorName === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() =>
                      setSelectedColorName((prev) =>
                        prev === color.name ? null : color.name
                      )
                    }
                    className={cn(
                      'h-4 w-4 rounded-full border border-border/80 shadow-xs transition-all hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-500',
                      isSelected && 'ring-2 ring-amber-500 scale-110 border-white'
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={`Select ${color.name}`}
                  />
                );
              })}
              {getProductColors(product).length > 5 && (
                <span className="text-[10px] text-muted-foreground font-medium ml-0.5">
                  +{getProductColors(product).length - 5}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <Link
            href={`/product/${product.slug}`}
            className="block font-serif text-base font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Style & Collection Metadata */}
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            {styleLabelMap[product.style] ?? product.style}
            {product.category === 'WOMEN'
              ? ' · Ladies'
              : product.category === 'MEN'
              ? ' · Gents'
              : ' · Kids'}
          </p>

          {/* Ratings */}
          {product.averageRating && product.reviewCount ? (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(product.averageRating!)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                ({product.reviewCount})
              </span>
            </div>
          ) : null}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline justify-between pt-1 border-t border-border/30">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-foreground font-sans tracking-tight">
              {formatPrice(effectivePrice)}
            </span>
            {product.salePrice && product.salePrice < product.basePrice && (
              <span className="text-xs text-muted-foreground line-through font-sans">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase">
            COD Ready
          </span>
        </div>
      </div>
    </div>
  );
}

// Ultra-smooth Shimmer Skeleton Loader for product cards
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-2xl bg-card border border-border/40 overflow-hidden shadow-xs">
      <div className="aspect-[3/4] w-full animate-shimmer rounded-t-2xl" />
      <div className="p-3.5 space-y-2.5">
        <div className="flex gap-1.5">
          <div className="h-4 w-4 rounded-full animate-shimmer" />
          <div className="h-4 w-4 rounded-full animate-shimmer" />
          <div className="h-4 w-4 rounded-full animate-shimmer" />
        </div>
        <div className="h-4 w-4/5 rounded-md animate-shimmer" />
        <div className="h-3 w-1/2 rounded-md animate-shimmer" />
        <div className="h-5 w-2/5 rounded-md animate-shimmer pt-1" />
      </div>
    </div>
  );
}

