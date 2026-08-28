/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'c678cf5c0fc5ef3806edacc18e6a762d.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 't3.storageapi.dev',
      },
      {
        protocol: 'https',
        hostname: '4oeubkcl1phjjpbw.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'executivemochi.pk',
      },
    ],
  },

}


export default nextConfig
