import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow the public to fetch products for the menu
  if (request.nextUrl.pathname.startsWith('/api/admin/products')) {
    return NextResponse.next();
  }

  // Add other public routes here if needed
  return NextResponse.next();
}

// This "matcher" tells Next.js which routes to run this logic on
export const config = {
  matcher: ['/api/admin/:path*'],
};