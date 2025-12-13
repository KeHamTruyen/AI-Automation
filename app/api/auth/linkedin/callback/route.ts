import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createHttpHeaderBearerCredential, addPlatformAccountNode, updateExistingNodeCredential } from "@/lib/n8n"
import { exchangeCodeForToken } from "@/lib/linkedin"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") // we set to socialId
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")
    
    const socialId = state || ""
    
    if (error) {
      console.error("LinkedIn OAuth error:", error, errorDescription)
      const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || ''}/social-accounts?error=linkedin_oauth&message=${encodeURIComponent(errorDescription || error)}`
      return new NextResponse(`
<!DOCTYPE html>
<html>
<head><title>Lỗi OAuth LinkedIn</title></head>
<body>
  <p>Đang chuyển hướng...</p>
  <script>window.location.href = ${JSON.stringify(redirectTo)};</script>
</body>
</html>
      `, { status: 200, headers: { 'Content-Type': 'text/html' } })
    }
    
    if (!code || !socialId) {
      return NextResponse.json({ success: false, error: "Thiếu code hoặc state" }, { status: 400 })
    }

    const social = await prisma.socialAccount.findUnique({ where: { id: socialId } })
    if (!social) {
      return NextResponse.json({ success: false, error: "Không tìm thấy social account" }, { status: 404 })
    }
    
    const clientId = (social as any)?.clientId || process.env.LINKEDIN_CLIENT_ID
    const clientSecret = (social as any)?.clientSecret || process.env.LINKEDIN_CLIENT_SECRET
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: "Thiếu clientId/clientSecret" }, { status: 500 })
    }

    const tok = await exchangeCodeForToken({ socialId, code, clientId, clientSecret })
    const accessToken = tok.accessToken

    // Fetch LinkedIn user profile to get URN (author ID)
    let linkedinUrn: string | null = null
    try {
      const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      if (profileRes.ok) {
        const profile = await profileRes.json()
        linkedinUrn = profile.sub || null // sub field contains URN like "urn:li:person:ABC123"
        console.log('[linkedin/callback] fetched URN:', linkedinUrn)
      }
    } catch (e) {
      console.warn('[linkedin/callback] failed to fetch userinfo:', (e as any)?.message)
    }

    await prisma.socialAccount.update({
      where: { id: socialId },
      data: { 
        accessToken,
        linkedinUrn: linkedinUrn || null,
      },
    })

    // Create/update n8n Bearer credential and activate LinkedIn HTTP Request nodes
    try {
      const userId = social?.userId
      // Create httpHeaderAuth credential with bearer token
      const credName = `bearer-linkedin-${userId}-${Date.now()}`
      const bearerCred = await createHttpHeaderBearerCredential(credName, accessToken)

      // Update social account with credential info
      await prisma.socialAccount.update({
        where: { id: socialId },
        data: {
          n8nCredentialId: bearerCred.id,
          n8nCredentialName: bearerCred.name,
        } as any,
      })

      // Try update existing LinkedIn node credential; else add a new HTTP Request node
      if (social?.n8nWorkflowId) {
        let updated = false
        try {
          const res = await updateExistingNodeCredential({
            workflowId: social.n8nWorkflowId,
            platform: 'linkedin',
            credentialId: bearerCred.id,
            credentialName: bearerCred.name,
            credentialType: 'httpHeaderAuth',
            nodeNameHint: 'linkedin',
            linkedinUrn: linkedinUrn || undefined,
          })
          updated = res.updated
        } catch (e) {
          console.warn('Update existing node failed:', (e as any)?.message)
        }
        if (!updated) {
          try {
            await addPlatformAccountNode({
              workflowId: social.n8nWorkflowId,
              platform: 'linkedin',
              accountDisplayName: social.name,
              credentialId: bearerCred.id,
              credentialName: bearerCred.name,
              credentialType: 'httpHeaderAuth',
              nodeTypeOverride: 'n8n-nodes-base.httpRequest',
              linkedinUrn: linkedinUrn || undefined,
            })
          } catch (e) {
            console.warn('Add platform node failed:', (e as any)?.message)
          }
        }
        const { setPlatformNodesActive } = await import("@/lib/n8n")
        await setPlatformNodesActive({
          workflowId: social.n8nWorkflowId,
          platform: 'linkedin',
          active: true,
          credentialId: bearerCred.id,
          credentialName: bearerCred.name,
        })
      }
    } catch (e) {
      console.warn('Activate LinkedIn nodes failed:', (e as any)?.message)
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || ''}/social-accounts?connected=linkedin`
    // Return HTML with auto-redirect to preserve session cookies (cross-domain redirect loses cookies)
    return new NextResponse(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kết nối LinkedIn thành công</title>
</head>
<body>
  <p>Đang chuyển hướng...</p>
  <script>
    window.location.href = ${JSON.stringify(redirectTo)};
  </script>
</body>
</html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err: any) {
    console.error("linkedin/callback error", err)
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || ''}/social-accounts?error=linkedin_callback&message=${encodeURIComponent(err?.message || 'Unknown error')}`
    return new NextResponse(`
<!DOCTYPE html>
<html>
<head><title>Lỗi callback</title></head>
<body>
  <p>Đang chuyển hướng...</p>
  <script>window.location.href = ${JSON.stringify(redirectTo)};</script>
</body>
</html>
    `, { status: 200, headers: { 'Content-Type': 'text/html' } })
  }
}
