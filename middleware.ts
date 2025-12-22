import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// Simple rate limiting (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  record.count++
  return true
}

// Các route cần authentication
const protectedRoutes = [
  "/dashboard",
  "/social-accounts",
  "/content-creation",
  "/cms",
  "/performance-management",
  "/brand-analysis",
  "/ai-representative",
  "/archive",
]

// Các route chỉ admin mới được truy cập
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // 🔒 Rate limiting
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  // 🔒 Security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Kiểm tra nếu là protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isLoginPage = pathname === "/login" || pathname === "/register"
  const isHomePage = pathname === "/"

  // Xử lý trang login/register: nếu đã login thì redirect về dashboard
  if (isLoginPage && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url))
      // Copy security headers
      response.headers.forEach((value, key) => redirectResponse.headers.set(key, value))
      return redirectResponse
    } catch {
      // Token không hợp lệ, xóa và cho phép truy cập login
      const loginResponse = NextResponse.next()
      loginResponse.cookies.delete("auth-token")
      response.headers.forEach((value, key) => loginResponse.headers.set(key, value))
      return loginResponse
    }
  }

  // Xử lý homepage: redirect về dashboard nếu đã login, ngược lại về login
  if (isHomePage) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET)
        const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url))
        response.headers.forEach((value, key) => redirectResponse.headers.set(key, value))
        return redirectResponse
      } catch {
        const loginResponse = NextResponse.redirect(new URL("/login", request.url))
        loginResponse.cookies.delete("auth-token")
        response.headers.forEach((value, key) => loginResponse.headers.set(key, value))
        return loginResponse
      }
    } else {
      const loginResponse = NextResponse.redirect(new URL("/login", request.url))
      response.headers.forEach((value, key) => loginResponse.headers.set(key, value))
      return loginResponse
    }
  }

  // Xử lý protected routes
  if (isProtectedRoute || isAdminRoute) {
    if (!token) {
      const loginResponse = NextResponse.redirect(new URL("/login", request.url))
      response.headers.forEach((value, key) => loginResponse.headers.set(key, value))
      return loginResponse
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Kiểm tra admin route
      const role = String((payload as any).role ?? "").toLowerCase()
      if (isAdminRoute && role !== "admin") {
        const dashboardResponse = NextResponse.redirect(new URL("/dashboard", request.url))
        response.headers.forEach((value, key) => dashboardResponse.headers.set(key, value))
        return dashboardResponse
      }

      return response
    } catch (error) {
      const loginResponse = NextResponse.redirect(new URL("/login", request.url))
      loginResponse.cookies.delete("auth-token")
      response.headers.forEach((value, key) => loginResponse.headers.set(key, value))
      return loginResponse
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (images, assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
