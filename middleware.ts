import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  if (token && authPaths.includes(pathname)) {
    try {
      const decoded = jwtDecode(token) as { role?: string };
      const redirectUrl = ['admin', 'superadmin'].includes(decoded.role || '') ? '/dashboard/overview' : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } catch {
      return NextResponse.next();
    }
  }

  if (!token) {
    const protectedPaths = ['/dashboard'];
    if (protectedPaths.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode(token) as { role?: string };
    const role = decoded.role;

    if (['admin', 'superadmin'].includes(role || '')) {

      if (!pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else if (role === 'user') {
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
