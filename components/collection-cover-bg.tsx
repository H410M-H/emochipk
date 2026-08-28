'use client';

import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';

interface CollectionCoverBackgroundProps {
  images: string[];
  collectionKey?: string;
  className?: string;
}

/**
 * Fisher-Yates shuffle array helper
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Animated scrolling cover background for collection pages behind title and search bar.
 * Shuffles collection product images dynamic per category/style filter.
 * Responsive across mobile, tablet, desktop, ultra-wide screens with full text contrast readability.
 */
export function CollectionCoverBackground({
  images,
  collectionKey = 'default',
  className = '',
}: CollectionCoverBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shuffle images whenever collectionKey or images list changes
  const shuffled = useMemo(() => {
    if (!images || images.length === 0) return [];
    return shuffleArray(images);
  }, [images, collectionKey]);

  if (!shuffled.length) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 ${className}`} />
    );
  }

  // Create columns of images for multi-track marquee effect
  const col1 = [...shuffled, ...shuffled];
  const col2 = [...shuffled.slice().reverse(), ...shuffled.slice().reverse()];
  const col3 = [...shuffled.slice(Math.floor(shuffled.length / 2)), ...shuffled, ...shuffled.slice(0, Math.floor(shuffled.length / 2))];
  const col4 = [...shuffled.slice().reverse()];

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden transition-opacity duration-700 ${
        mounted ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Subtle left-edge gradient so hero text and search bar stay 100% readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/65 to-stone-950/25 z-10" />
      {/* Top & bottom subtle vignettes */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-transparent to-stone-950 z-10" />

      {/* Marquee columns container — vibrant, visible background images */}
      <div className="absolute inset-0 flex gap-2.5 sm:gap-3 opacity-65">
        {/* Column 1 — vertical animation */}
        <div className="flex-1 relative overflow-hidden">
          <div className="animate-marquee-up flex flex-col gap-3">
            {col1.map((url, i) => (
              <div
                key={`cc1-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 — vertical reverse animation */}
        <div className="flex-1 relative overflow-hidden">
          <div className="animate-marquee-down flex flex-col gap-3">
            {col2.map((url, i) => (
              <div
                key={`cc2-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 — visible on sm+ screens */}
        <div className="flex-1 relative overflow-hidden hidden sm:block">
          <div className="animate-marquee-up-slow flex flex-col gap-3">
            {col3.map((url, i) => (
              <div
                key={`cc3-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 4 — visible on lg+ screens */}
        <div className="flex-1 relative overflow-hidden hidden lg:block">
          <div className="animate-marquee-down-slow flex flex-col gap-3">
            {col4.map((url, i) => (
              <div
                key={`cc4-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
