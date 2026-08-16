import { S3Client } from '@aws-sdk/client-s3';

/**
 * S3 / Cloudflare R2 Client helper
 * Supports endpoint URLs with or without bucket name in path:
 * e.g. https://c678cf5c0fc5ef3806edacc18e6a762d.r2.cloudflarestorage.com/emochipk
 */

let _s3: S3Client | null = null;

export function getS3Client(): S3Client {
  if (_s3) return _s3;

  const rawEndpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!rawEndpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing S3 environment variables (S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY)');
  }

  // Parse base endpoint host for AWS S3Client
  let endpoint = rawEndpoint;
  try {
    const url = new URL(rawEndpoint);
    if (url.pathname && url.pathname !== '/') {
      endpoint = url.origin;
    }
  } catch (_e) {
    // Keep rawEndpoint if not a standard URL
  }

  _s3 = new S3Client({
    endpoint,
    region: process.env.S3_REGION ?? 'auto',
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });

  return _s3;
}

// Keep backward-compatible export (lazy)
export const s3 = new Proxy({} as S3Client, {
  get(_target, prop) {
    return (getS3Client() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function getS3Bucket(): string {
  if (process.env.S3_BUCKET_NAME) {
    return process.env.S3_BUCKET_NAME;
  }
  const rawEndpoint = process.env.S3_ENDPOINT;
  if (rawEndpoint) {
    try {
      const url = new URL(rawEndpoint);
      const pathBucket = url.pathname.replace(/^\/+|\/+$/g, '');
      if (pathBucket) return pathBucket;
    } catch (_e) {
      // Ignore URL parse errors
    }
  }
  throw new Error('Missing S3_BUCKET_NAME environment variable');
}

export const S3_BUCKET = process.env.S3_BUCKET_NAME ?? 'emochipk';

/**
 * Build the public URL for an object stored in the bucket.
 * Routes through /api/images/ proxy which authenticates server-side.
 */
export function getPublicUrl(key: string): string {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
  return `${appUrl}/api/images/${key}`;
}
