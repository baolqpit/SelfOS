import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAuthed = !!req.auth;
  const url = req.nextUrl;
  if (!isAuthed) {
    const login = new URL('/login', url);
    login.searchParams.set('next', url.pathname + url.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
