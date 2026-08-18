import { NextResponse } from 'next/server';
import { getS3Client, getS3Bucket, getPublicUrl } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function GET(): Promise<NextResponse> {
  const s3Endpoint = process.env.S3_ENDPOINT ?? 'NOT SET';
  const awsEndpoint = process.env.AWS_ENDPOINT_URL ?? 'NOT SET';
  const s3Key = process.env.S3_ACCESS_KEY_ID ? 'SET' : 'MISSING';
  const awsKey = process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'MISSING';
  const s3Secret = process.env.S3_SECRET_ACCESS_KEY ? 'SET' : 'MISSING';
  const bucket = process.env.S3_BUCKET_NAME ?? 'NOT SET';

  let s3Test = 'not_tried';
  let s3Error: string | null = null;
  let resolvedBucket = '';

  try {
    const s3 = getS3Client();
    resolvedBucket = getS3Bucket();
    await s3.send(new PutObjectCommand({
      Bucket: resolvedBucket,
      Key: 'debug/test.txt',
      Body: Buffer.from('test'),
      ContentType: 'text/plain',
    }));
    s3Test = 'success';
  } catch (err) {
    s3Test = 'failed';
    s3Error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  }

  return NextResponse.json({
    env: {
      S3_ENDPOINT: s3Endpoint,
      AWS_ENDPOINT_URL: awsEndpoint,
      S3_ACCESS_KEY_ID: s3Key,
      AWS_ACCESS_KEY_ID: awsKey,
      S3_SECRET_ACCESS_KEY: s3Secret,
      S3_BUCKET_NAME: bucket,
    },
    resolved_bucket: resolvedBucket,
    s3_test: s3Test,
    s3_error: s3Error,
    public_url_sample: getPublicUrl('products/test.jpg'),
  });
}
