import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

const publicRoutes = ['/login', '/register']
const adminRoutes = ['/admin']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  const isAdminRoute = adminRoutes.some((r) => path.startsWith(r))

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (session?.userId && isPublicRoute) {
    return NextResponse.redirect(new URL('/beranda', req.nextUrl))
  }

  if (isAdminRoute && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/beranda', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)'],
}
