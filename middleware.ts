import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const authPaths = ['/login', '/register'];
const protectedPaths = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }


  if (token && authPaths.includes(pathname)) {
    try {
      const decoded = jwtDecode(token) as { role?: string };
      const redirectUrl = decoded.role === 'admin' ? '/dashboard/overview' : '/';
      
    
      return NextResponse.rewrite(new URL(redirectUrl, request.url));
    } catch {
      return NextResponse.next();
    }
  }

  if (!token && protectedPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && pathname === '/') {
    try {
      const decoded = jwtDecode(token) as { role?: string };
      if (decoded.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (token && pathname.startsWith('/dashboard')) {
    try {
      const decoded = jwtDecode(token) as { role?: string };
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};