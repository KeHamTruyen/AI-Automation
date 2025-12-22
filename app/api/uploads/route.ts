import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, r2BucketName, buildR2PublicUrl } from "@/lib/r2"
import { jwtVerify } from "jose"
import crypto from "crypto"

export const runtime = 'nodejs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export async function POST(request: Request) {
  try {
    // 🔒 SECURITY: Check authentication
    const authCookie = request.headers.get('cookie')?.split('; ').find(c => c.startsWith('auth-token='))?.split('=')[1]
    if (!authCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
      await jwtVerify(authCookie, JWT_SECRET)
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    console.log('[uploads] Starting upload request')
    const formData = await request.formData()
    const file = formData.get('file') as any
    if (!file) {
      console.error('[uploads] Missing file in formData')
      return NextResponse.json({ success: false, error: 'Missing file' }, { status: 400 })
    }

    console.log('[uploads] File received:', file.name, 'Size:', file.size, 'Type:', file.type)

    // 🔒 SECURITY: Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        success: false, 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 413 })
    }

    // 🔒 SECURITY: Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}` 
      }, { status: 400 })
    }

    if (!r2BucketName) {
      console.error('[uploads] R2_BUCKET_NAME not configured')
      return NextResponse.json({ success: false, error: 'R2 not configured' }, { status: 500 })
    }

    console.log('[uploads] R2 config - Bucket:', r2BucketName)

    const originalName = (file.name || 'upload').replace(/[^a-zA-Z0-9.\-\_]/g, '-')
    const ext = originalName.includes('.') ? originalName.split('.').pop() : 'bin'
    const key = `uploads/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${originalName}`
    const arrayBuffer = await file.arrayBuffer()
    const body = Buffer.from(arrayBuffer)
    const contentType = file.type || 'application/octet-stream'

    console.log('[uploads] Uploading to R2 - Key:', key, 'Size:', body.length, 'bytes')

    await r2Client.send(new PutObjectCommand({
      Bucket: r2BucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: undefined // R2 ignores ACL; public access via custom domain
    }))

    console.log('[uploads] Upload successful')
    const publicUrl = buildR2PublicUrl(key)
    console.log('[uploads] Public URL:', publicUrl)

    return NextResponse.json({ success: true, url: publicUrl, key })
  } catch (e: any) {
    console.error('[uploads]', e)
    return NextResponse.json({ success: false, error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
