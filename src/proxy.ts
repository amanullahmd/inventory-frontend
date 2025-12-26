import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function proxy(request: NextRequest) {
  const session = await auth()
  
  // Define protected routes
  const protectedRoutes = ['/items', '/stock-in', '/stock-out', '/users']
  const adminOnlyRoutes = ['/users']
  
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // If no session, redirect to sign in
    if (!session) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    // Check admin-only routes
    const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route))
    if (isAdminRoute) {
      const userRoles = (session as any).roles || []
      const isAdmin = userRoles.includes('ROLE_ADMIN')
      
      if (!isAdmin) {
        // Redirect non-admin users to items page with access denied
        const itemsUrl = new URL('/items', request.url)
        itemsUrl.searchParams.set('error', 'access_denied')
        return NextResponse.redirect(itemsUrl)
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}