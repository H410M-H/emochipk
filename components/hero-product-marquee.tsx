'use client';

import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';

interface HeroProductMarqueeProps {
  images: string[];
}

/** Simple deterministic PRNG shuffle for hydration stability */
function shuffleArray<T>(array: T[], seed: number): T[] {
  if (!array || array.length <= 1) return [...array];
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Animated scrolling product image grid behind hero.
 * Four columns scroll in opposite directions with unique randomized image sequences
 * across categories (Men, Women, Kids, Accessories) to create a dynamic luxury showcase.
 */
export function HeroProductMarquee({ images }: HeroProductMarqueeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { col1, col2, col3, col4 } = useMemo(() => {
    if (!images || images.length === 0) {
      return { col1: [], col2: [], col3: [], col4: [] };
    }

    // Shuffle each column with distinct seeds for maximum randomness and variety across columns
    const c1 = shuffleArray(images, 517);
    const c2 = shuffleArray(images, 829);
    const c3 = shuffleArray(images, 343);
    const c4 = shuffleArray(images, 961);

    return {
      col1: [...c1, ...c1, ...c1],
      col2: [...c2, ...c2, ...c2],
      col3: [...c3, ...c3, ...c3],
      col4: [...c4, ...c4, ...c4],
    };
  }, [images]);

  if (!images.length) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none transition-opacity duration-1000 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Subtle left-edge gradient so hero text stays readable without dimming images */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/50 to-stone-950/10 z-10" />
      {/* Very subtle top/bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/40 z-10" />

      {/* Scrolling columns container */}
      <div className="absolute inset-0 flex gap-2 sm:gap-3 overflow-hidden">
        {/* Column 1 — scrolls up */}
        <div className="flex-1 relative overflow-hidden">
          <div className="animate-marquee-up flex flex-col gap-2 sm:gap-3">
            {col1.map((url, i) => (
              <div
                key={`c1-${i}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0"
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

        {/* Column 2 — scrolls down */}
        <div className="flex-1 relative overflow-hidden">
          <div className="animate-marquee-down flex flex-col gap-2 sm:gap-3">
            {col2.map((url, i) => (
              <div
                key={`c2-${i}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0"
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

        {/* Column 3 — scrolls up (hidden on small screens) */}
        <div className="flex-1 relative overflow-hidden hidden sm:block">
          <div className="animate-marquee-up-slow flex flex-col gap-2 sm:gap-3">
            {col3.map((url, i) => (
              <div
                key={`c3-${i}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0"
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

        {/* Column 4 — scrolls down (hidden on smaller screens) */}
        <div className="flex-1 relative overflow-hidden hidden lg:block">
          <div className="animate-marquee-down-slow flex flex-col gap-2 sm:gap-3">
            {col4.map((url, i) => (
              <div
                key={`c4-${i}`}
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0"
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
