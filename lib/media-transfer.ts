/**
 * Download image from external URL (AI-generated) and upload to R2
 * Returns R2 public URL for permanent storage
 */
export async function transferImageToR2(externalUrl: string): Promise<string> {
  try {
    // 1. Download image from external URL
    const response = await fetch(externalUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    // 2. Convert to blob
    const blob = await response.blob();
    
    // 3. Create FormData for upload API
    const formData = new FormData();
    
    // Extract filename from URL or generate one
    const urlPath = new URL(externalUrl).pathname;
    const originalFilename = urlPath.split('/').pop() || 'ai-generated-image.png';
    const filename = `ai-${Date.now()}-${originalFilename}`;
    
    formData.append('file', blob, filename);

    // 4. Upload to R2 via our upload API
    const uploadResponse = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to R2');
    }

    const uploadData = await uploadResponse.json();
    
    if (!uploadData.success || !uploadData.url) {
      throw new Error('Upload succeeded but no URL returned');
    }

    return uploadData.url;
  } catch (error) {
    console.error('Error transferring image to R2:', error);
    throw error;
  }
}

/**
 * Transfer multiple images from external URLs to R2
 * Returns array of R2 URLs
 */
export async function transferImagesToR2(externalUrls: string[]): Promise<string[]> {
  const promises = externalUrls.map(url => transferImageToR2(url));
  return Promise.all(promises);
}
