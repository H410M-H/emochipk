'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HeroProductMarqueeProps {
  images: string[];
}

/**
 * Animated scrolling product image grid behind hero.
 * Two columns scroll in opposite directions to create a dynamic showcase.
 * Rendered with low opacity and green overlay so hero text stays readable.
 */
export function HeroProductMarquee({ images }: HeroProductMarqueeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!images.length) return null;

  // Duplicate images to fill out both columns seamlessly
  const col1 = [...images, ...images, ...images];
  const col2 = [...images.slice().reverse(), ...images.slice().reverse(), ...images.slice().reverse()];
  // A third column for wider screens
  const col3 = [...images.slice(Math.floor(images.length / 2)), ...images, ...images.slice(0, Math.floor(images.length / 2))];
  const col4 = [...col1.slice().reverse()];

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none transition-opacity duration-1000 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Dark green overlay to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#013516]/85 via-[#01411C]/80 to-[#002611]/90 z-10" />
      
      {/* Additional overlay gradient from left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#01411C]/95 via-[#01411C]/60 to-transparent z-10" />

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
