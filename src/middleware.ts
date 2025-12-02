import { NextResponse, type NextRequest } from 'next/server'

const SESSION_NAME = 'admin_session'

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  // APIルートはスキップ
  if (isApiRoute) {
    return NextResponse.next()
  }

  const session = request.cookies.get(SESSION_NAME)
  const isAuthenticated = !!session?.value

  if (isAdminRoute) {
    // 未認証で管理画面（ログインページ以外）にアクセス → ログインページへ
    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 認証済みでログインページにアクセス → ダッシュボードへ
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
