import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/media/transfer
 * Transfer external images (AI-generated) to R2 storage
 * 
 * Body: { urls: string[] }
 * Returns: { success: true, urls: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "urls array is required" },
        { status: 400 }
      );
    }

    // Transfer each image to R2
    const transferredUrls: string[] = [];
    const errors: Array<{ url: string; error: string }> = [];

    for (const externalUrl of urls) {
      try {
        // 1. Download image from external URL
        const response = await fetch(externalUrl);
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.statusText}`);
        }

        // 2. Convert to blob
        const blob = await response.blob();
        
        // 3. Create FormData for upload API
        const formData = new FormData();
        
        // Extract filename from URL or generate one
        const urlPath = new URL(externalUrl).pathname;
        const originalFilename = urlPath.split('/').pop() || 'ai-generated-image.png';
        const filename = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${originalFilename}`;
        
        formData.append('file', blob, filename);

        // 4. Upload to R2 via our upload API
        const uploadResponse = await fetch(
          new URL('/api/uploads', req.url).toString(),
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload to R2');
        }

        const uploadData = await uploadResponse.json();
        
        if (!uploadData.success || !uploadData.url) {
          throw new Error('Upload succeeded but no URL returned');
        }

        transferredUrls.push(uploadData.url);
      } catch (error: any) {
        console.error(`Error transferring ${externalUrl}:`, error);
        errors.push({
          url: externalUrl,
          error: error.message || 'Unknown error'
        });
        // Keep original URL if transfer fails
        transferredUrls.push(externalUrl);
      }
    }

    return NextResponse.json({
      success: true,
      urls: transferredUrls,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Media transfer error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to transfer media" },
      { status: 500 }
    );
  }
}
