import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * Location: ./src/middleware.ts or ./middleware.ts
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly allow public access to products for the menu
  // This bypasses any further logic for this specific path
  if (pathname.startsWith('/api/admin/products')) {
    return NextResponse.next();
  }

  // 2. Add other logic here (like protecting other /api/admin routes)
  // For now, we allow the request to proceed
  return NextResponse.next();
}

// The Matcher defines exactly which paths trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};