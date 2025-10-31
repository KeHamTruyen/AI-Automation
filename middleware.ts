import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

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

  // Kiểm tra nếu là protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute || isAdminRoute) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Verify JWT token
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Kiểm tra admin route (chuẩn hoá role về lowercase để tránh sai lệch ADMIN/admin)
      const role = String((payload as any).role ?? "").toLowerCase()
      if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Token hợp lệ, cho phép truy cập
      return NextResponse.next()
    } catch (error) {
      // Token không hợp lệ, redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|login|register).*)",
  ],
}
