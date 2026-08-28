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
      {/* Deep gradient overlays ensuring top title, badge, search bar & text remain 100% readable */}
      <div className="absolute inset-0 bg-stone-950/75 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/65 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-transparent to-stone-950 z-10" />

      {/* Marquee columns container */}
      <div className="absolute inset-0 flex gap-2 sm:gap-3 opacity-35 blur-[0.4px]">
        {/* Column 1 — vertical animation */}
        <div className="flex-1 relative overflow-hidden">
          <div className="animate-marquee-up flex flex-col gap-2.5">
            {col1.map((url, i) => (
              <div
                key={`cc1-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shrink-0 shadow-md border border-white/5"
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
          <div className="animate-marquee-down flex flex-col gap-2.5">
            {col2.map((url, i) => (
              <div
                key={`cc2-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shrink-0 shadow-md border border-white/5"
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
          <div className="animate-marquee-up-slow flex flex-col gap-2.5">
            {col3.map((url, i) => (
              <div
                key={`cc3-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shrink-0 shadow-md border border-white/5"
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
          <div className="animate-marquee-down-slow flex flex-col gap-2.5">
            {col4.map((url, i) => (
              <div
                key={`cc4-${i}-${collectionKey}`}
                className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shrink-0 shadow-md border border-white/5"
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
