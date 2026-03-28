import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuth = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // 1. Public API Bypass: Allow public to fetch products for the menu
  if (pathname.startsWith('/api/admin/products')) {
    return NextResponse.next();
  }

  // 2. Auth Protection: Redirect to login if not authenticated
  if (!isAuth && (isAdminPage || isDashboardPage)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Admin Protection: Only allow admin/chef to admin pages
  if (isAdminPage && role !== "admin" && role !== "chef") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

// The Matcher identifies which routes run this logic
export const config = {
  matcher: [
    "/admin/:path*", 
    "/dashboard/:path*",
    "/api/admin/:path*"
  ],
};