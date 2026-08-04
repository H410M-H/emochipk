'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface CategorySlideshowProps {
  images: string[];
  fallbackUrl: string;
  alt: string;
}

export function CategorySlideshow({ images, fallbackUrl, alt }: CategorySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Client-side shuffle so every view gets a shuffled image order including latest
  const displayImages = useMemo(() => {
    const list = images?.length > 0 ? [...images] : [fallbackUrl];
    if (list.length <= 1) return list;
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [images, fallbackUrl]);

  useEffect(() => {
    if (displayImages.length <= 1) return;

    // Change image every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <>
      {displayImages.map((src, index) => (
        <Image
          key={`${src}-${index}`}
          src={src}
          alt={`${alt} image ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(min-width: 768px) 33vw, 50vw"
        />
      ))}
    </>
  );
}
