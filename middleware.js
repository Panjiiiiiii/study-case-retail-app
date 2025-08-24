import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  console.log('🔍 Middleware called for:', req.nextUrl.pathname);
  
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isUserPage = req.nextUrl.pathname.startsWith('/user');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isHomePage = req.nextUrl.pathname === '/';

  console.log('🔍 Auth status:', {
    isAuth,
    hasToken: !!token,
    userRole: token?.role,
    pathname: req.nextUrl.pathname
  });

  // Skip middleware for API routes (except API pages that need protection)
  if (isApiRoute && !req.nextUrl.pathname.startsWith('/api/protected')) {
    console.log('🔍 Skipping API route');
    return NextResponse.next();
  }

  // Skip static files
  if (req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.includes('.') ||
      req.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // If user is on auth page and already authenticated, redirect to appropriate dashboard
  if (isAuthPage && isAuth) {
    console.log('🔍 Redirecting authenticated user from auth page');
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else {
      return NextResponse.redirect(new URL('/user', req.url));
    }
  }

  // If user is not authenticated and trying to access protected pages
  if (!isAuth && (isAdminPage || isUserPage)) {
    console.log('🔍 Redirecting unauthenticated user to signin');
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // If user is authenticated but trying to access wrong role pages
  if (isAuth) {
    if (isAdminPage && token.role !== 'ADMIN') {
      console.log('🔍 Redirecting non-admin from admin pages');
      return NextResponse.redirect(new URL('/user', req.url));
    }
    if (isUserPage && token.role !== 'CASHIER') {
      console.log('🔍 Redirecting non-cashier from user pages');
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // Handle home page redirect for authenticated users
  if (isHomePage && isAuth) {
    console.log('🔍 Redirecting authenticated user from home');
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else {
      return NextResponse.redirect(new URL('/user', req.url));
    }
  }

  // If unauthenticated user tries to access home, redirect to signin
  if (isHomePage && !isAuth) {
    console.log('🔍 Redirecting unauthenticated user from home to signin');
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  console.log('🔍 Allowing access to:', req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
