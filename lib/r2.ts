import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 uses S3-compatible API. We configure a custom endpoint.
// Required env vars:
// R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL
// R2_PUBLIC_BASE_URL is the base https URL (custom domain) used to build public file URLs.

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;
const publicBase = process.env.R2_PUBLIC_BASE_URL; // Production custom domain (recommend)
const publicDev = process.env.R2_PUBLIC_DEV_URL;   // Cloudflare Public Development URL (rate-limited, not cached)

if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
  // We avoid throwing at import to not break build if optional.
  console.warn('[r2] Missing R2 env vars. Uploads to R2 will fail until set.');
}

export const r2BucketName = bucket || '';
export const r2PublicBase = publicBase || '';
export const r2PublicDev = publicDev || '';

export const r2Client = new S3Client({
  region: "auto", // R2 uses "auto"
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: accessKeyId && secretAccessKey ? {
    accessKeyId,
    secretAccessKey,
  } : undefined,
});

// Helper to build public URL preferring production custom domain, then dev URL, then raw endpoint.
export function buildR2PublicUrl(key: string) {
  if (r2PublicBase) return `${r2PublicBase.replace(/\/$/, '')}/${key}`;
  if (r2PublicDev) return `${r2PublicDev.replace(/\/$/, '')}/${key}`;
  return `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`;
}
