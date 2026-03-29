import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isApiAdmin = pathname.startsWith("/api/admin");

  // 1. CRITICAL BYPASS: Allow Auth.js internal routes and public product API
  // This is essential to prevent "Unexpected end of JSON input" and auth failures
  if (
    pathname.startsWith("/api/auth") || 
    pathname.startsWith("/api/admin/products")
  ) {
    return NextResponse.next();
  }

  // 2. AUTH PROTECTION: Redirect to login if trying to access private pages while signed out
  // We check for Admin pages, Dashboard pages, and Admin-only API routes
  if (
    !isAuth && 
    (isAdminPage || isDashboardPage || (isApiAdmin && !pathname.startsWith('/api/admin/products')))
  ) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    // Include callbackUrl so Efe is redirected back to the dashboard after logging in
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. ADMIN/CHEF PROTECTION: Restrict /admin routes to specific roles
  // If a customer tries to access /admin, send them to the home page
  if (isAdminPage && role !== "admin" && role !== "chef") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * This matcher protects everything EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images/Assets with extensions (png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};