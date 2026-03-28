import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware - Optimized for Vercel NFT Tracing
 * Location: ./src/middleware.ts
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly allow public access to products for the menu
  if (pathname.startsWith('/api/admin/products')) {
    return NextResponse.next();
  }

  // 2. Default allow for all other routes
  return NextResponse.next();
}

// POSITIVE MATCHER: We only run middleware on specific paths. 
// This prevents the "middleware.js.nft.json" ENOENT error in Next.js 16.
export const config = {
  matcher: [
    '/api/admin/:path*', 
    '/dashboard/:path*', 
    '/admin/:path*'
  ],
};