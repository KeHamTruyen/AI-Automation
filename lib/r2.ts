import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const R2_PUBLIC_DEV_URL = process.env.R2_PUBLIC_DEV_URL?.trim()

// Cloudflare R2 is S3-compatible; endpoint format:
// https://<account_id>.r2.cloudflarestorage.com
const endpoint = R2_ACCOUNT_ID
  ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  : undefined

export const r2Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY ? {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  } : undefined,
})

function parseDataUrl(dataUrl: string): { mime: string; buffer: Buffer } {
  const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl)
  if (!m) throw new Error("Invalid data URL")
  const mime = m[1]
  const b64 = m[2]
  const buffer = Buffer.from(b64, "base64")
  return { mime, buffer }
}

export async function uploadDataUrlToR2(userId: string, dataUrl: string, prefix = "posts"): Promise<string> {
  if (!R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME missing")
  const { mime, buffer } = parseDataUrl(dataUrl)
  const ext = mime.split("/")[1] || "jpg"
  const key = `${prefix}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  await r2Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mime,
    ACL: "public-read" as any, // R2 ignores ACL; use public bucket or signed URL policy
  }))
  if (!R2_PUBLIC_DEV_URL) throw new Error("R2_PUBLIC_DEV_URL missing for public access")
  // Construct public URL from dev/public base
  const url = R2_PUBLIC_DEV_URL.endsWith("/") ? `${R2_PUBLIC_DEV_URL}${key}` : `${R2_PUBLIC_DEV_URL}/${key}`
  return url
}

export async function normalizeMediaToR2(userId: string, media: any[]): Promise<string[]> {
  const out: string[] = []
  for (const m of media || []) {
    const s = String(m || "")
    if (s.startsWith("data:")) {
      const url = await uploadDataUrlToR2(userId, s)
      out.push(url)
    } else {
      out.push(s)
    }
  }
  return out
}
