import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'nne_admin_session';
const secretKey = process.env.AUTH_SECRET;

if (!secretKey && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET environment variable is required in production.');
}

const encodedKey = new TextEncoder().encode(secretKey || 'dev-only-insecure-secret-change-me');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
