import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Public paths
  const isPublicPath = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/terms' || 
    pathname === '/privacy' || 
    pathname === '/' || 
    pathname.startsWith('/api/auth')

  // Redirect to login if no token and path is protected
  if (!refreshToken && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if logged in and trying to access login/register
  // 🛡️ BUT skip if 'logout' query param is present (to break redirect loops)
  const isLoggingOut = request.nextUrl.searchParams.get('logout') === 'true'
  
  if (refreshToken && !isLoggingOut && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }


  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-url', request.nextUrl.pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
