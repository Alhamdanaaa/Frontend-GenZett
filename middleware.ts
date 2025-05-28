import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname === '/unauthorized') {
    return NextResponse.next();
  }

  if (token && authPaths.includes(pathname)) {
    try {
      const decoded = jwtDecode(token) as { role?: string };
      const role = decoded.role;

      const redirectUrl =
        role === 'admin'
          ? '/dashboard/overview-admin'
          : role === 'superadmin'
          ? '/dashboard/overview'
          : '/';

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

    if (role === 'admin' && !pathname.startsWith('/dashboard/overview-admin')) {
      return NextResponse.redirect(new URL('/dashboard/overview-admin', request.url));
    }

    if (role === 'superadmin' && !pathname.startsWith('/dashboard/overview')) {
      return NextResponse.redirect(new URL('/dashboard/overview', request.url));
    }

    if (role === 'user' && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|unauthorized).*)',
  ],
};
