import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PROTECTED_PREFIX = '/admin';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith(PROTECTED_PREFIX) && pathname !== '/admin/login') {
    const token = req.cookies.get('token')?.value;
    const secret = process.env.JWT_SECRET || 'dev_secret';
    try {
      const payload = jwt.verify(token || '', secret) as any;
      if (payload?.role === 'admin') return NextResponse.next();
    } catch (e) {}
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
