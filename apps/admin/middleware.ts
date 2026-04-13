import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // TODO: Check admin auth — redirect non-admin users to user app
  // All routes except /login require admin role
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
};
