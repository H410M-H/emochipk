import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://executivemochi.pk').replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/images/', '/api/gmc/feed'],
        disallow: [
          '/admin/',
          '/account/',
          '/checkout/',
          '/order-success/',
          '/cart/',
          '/wishlist/',
          '/search/',
          '/api/trpc/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/products/', '/api/gmc/feed', '/api/images/'],
        disallow: [
          '/admin/',
          '/account/',
          '/checkout/',
          '/order-success/',
          '/cart/',
          '/wishlist/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/api/images/', '/images/', '/*.jpg', '/*.png', '/*.webp', '/*.avif'],
        disallow: ['/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
