import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Skip middleware for static files and special paths
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/unauthorized'
  ) {
    return NextResponse.next();
  }

  // Handle redirect for authenticated users visiting auth pages
  if (token && authPaths.includes(pathname)) {
    try {
      const decoded = jwtDecode(token) as { role?: string };
      const role = decoded.role;
      console.log('Auth page access - Decoded role:', role);

      let redirectUrl = '/';
      if (role === 'admin') {
        redirectUrl = '/dashboard/overview-admin';
      } else if (role === 'superadmin') {
        redirectUrl = '/dashboard/overview';
      } else {
        console.warn('Unknown role during auth redirect:', role);
      }

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } catch (error) {
      console.error('JWT decode error on auth redirect:', error);
      return NextResponse.next();
    }
  }

  // Redirect unauthenticated users trying to access protected dashboard
  if (!token) {
    const protectedPaths = ['/dashboard'];
    if (protectedPaths.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Authenticated users access logic
  try {
    const decoded = jwtDecode(token) as { role?: string };
    const role = decoded.role;
    console.log('Dashboard access - Decoded role:', role);

    if (role === 'admin') {
      if (
        pathname === '/dashboard' ||
        pathname === '/dashboard/' ||
        pathname === '/dashboard/overview'
      ) {
        return NextResponse.redirect(new URL('/dashboard/overview-admin', request.url));
      }

      if (pathname.startsWith('/dashboard/')) {
        return NextResponse.next();
      }
    }

    if (role === 'superadmin') {
      if (pathname === '/dashboard' || pathname === '/dashboard/') {
        return NextResponse.redirect(new URL('/dashboard/overview', request.url));
      }

      if (pathname.startsWith('/dashboard/')) {
        return NextResponse.next();
      }
    }

    if (role === 'user' && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

  } catch (error) {
    console.error('JWT decode error on dashboard access:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|unauthorized).*)',
  ],
};
