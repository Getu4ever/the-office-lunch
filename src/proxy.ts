import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuth = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // 1. Protection: Redirect to login if not authenticated
  if (!isAuth && (isAdminPage || isDashboardPage)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Admin Protection: Only allow admin/chef to admin pages
  if (isAdminPage && role !== "admin" && role !== "chef") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};