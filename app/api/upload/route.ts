import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { getS3Client, getS3Bucket, getPublicUrl } from '@/lib/s3';

export async function POST(request: Request): Promise<NextResponse> {
  // Early env-var check — gives a clear error instead of a cryptic "Invalid URL"
  const endpoint = process.env.S3_ENDPOINT || process.env.AWS_ENDPOINT_URL;
  const accessKey = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKey || !secretKey) {
    console.error('[upload] Missing S3 environment variables:', {
      S3_ENDPOINT: !!process.env.S3_ENDPOINT,
      AWS_ENDPOINT_URL: !!process.env.AWS_ENDPOINT_URL,
      S3_ACCESS_KEY_ID: !!process.env.S3_ACCESS_KEY_ID,
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY: !!process.env.S3_SECRET_ACCESS_KEY,
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
    });
    return NextResponse.json(
      { error: 'Storage is not configured. Please contact the administrator.' },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG, WebP, and AVIF are allowed.' },
      { status: 400 }
    );
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10MB.' },
      { status: 400 }
    );
  }

  try {
    const s3 = getS3Client();
    const bucket = getS3Bucket();
    const key = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = getPublicUrl(key);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('[upload] S3 upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
