import { jwtVerify } from "jose"
import { NextRequest } from "next/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

/**
 * Extracts userId from JWT token in cookies
 * @returns userId string or null if not authenticated
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const authCookie = req.cookies.get("auth-token")?.value
    if (!authCookie) {
      return null
    }

    const { payload } = await jwtVerify(authCookie, JWT_SECRET)
    const userId = (payload as any)?.userId as string | undefined
    
    return userId || null
  } catch (e) {
    console.error("[auth] Failed to verify token:", e)
    return null
  }
}
