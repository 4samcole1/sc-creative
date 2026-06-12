import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')

  if (!isAdminRoute) return NextResponse.next()

  // Env not configured yet — allow login page, block everything else
  if (!process.env.SESSION_SECRET) {
    return isLoginPage ? NextResponse.next() : NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)

  if (isLoginPage) {
    if (session.isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
