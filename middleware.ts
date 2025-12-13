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
  const token = request.cookies.get("auth-token")?.value

  // Kiểm tra nếu là protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isLoginPage = pathname === "/login" || pathname === "/register"
  const isHomePage = pathname === "/"

  // Xử lý trang login/register: nếu đã login thì redirect về dashboard
  if (isLoginPage && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch {
      // Token không hợp lệ, xóa và cho phép truy cập login
      const response = NextResponse.next()
      response.cookies.delete("auth-token")
      return response
    }
  }

  // Xử lý homepage: redirect về dashboard nếu đã login, ngược lại về login
  if (isHomePage) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET)
        return NextResponse.redirect(new URL("/dashboard", request.url))
      } catch {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth-token")
        return response
      }
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Xử lý protected routes
  if (isProtectedRoute || isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Kiểm tra admin route
      const role = String((payload as any).role ?? "").toLowerCase()
      if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      return NextResponse.next()
    } catch (error) {
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
     * - public folder (images, assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
