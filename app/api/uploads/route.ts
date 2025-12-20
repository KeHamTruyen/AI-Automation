import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, r2BucketName, buildR2PublicUrl } from "@/lib/r2"
import crypto from "crypto"

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    console.log('[uploads] Starting upload request')
    const formData = await request.formData()
    const file = formData.get('file') as any
    if (!file) {
      console.error('[uploads] Missing file in formData')
      return NextResponse.json({ success: false, error: 'Missing file' }, { status: 400 })
    }

    console.log('[uploads] File received:', file.name, 'Size:', file.size, 'Type:', file.type)

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
