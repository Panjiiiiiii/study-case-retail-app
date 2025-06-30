import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

    // If user is on auth page and already authenticated, redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user is not authenticated and trying to access protected routes
    if (!isAuth && !isAuthPage && !isApiAuthRoute) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Role-based access control
    if (isAuth && token?.role) {
      const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
      const isCashierRoute = req.nextUrl.pathname.startsWith('/cashier');

      // Admin routes - only ADMIN can access
      if (isAdminRoute && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Cashier routes - only CASHIER can access
      if (isCashierRoute && token.role !== 'CASHIER') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 