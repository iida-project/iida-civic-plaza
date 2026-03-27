import { NextResponse, type NextRequest } from 'next/server'

const SESSION_NAME = 'admin_session'

// Coming Soonモード（false にすると通常公開）
const COMING_SOON_MODE = true

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'
  const isApiRoute = pathname.startsWith('/api/')
  const isComingSoonPage = pathname === '/preview'

  // APIルート・静的アセットはスキップ
  if (isApiRoute) {
    return NextResponse.next()
  }

  const session = request.cookies.get(SESSION_NAME)
  const isAuthenticated = !!session?.value

  // 管理画面のルーティング
  if (isAdminRoute) {
    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // Coming Soonモード: 未認証の公開サイトアクセスをリダイレクト
  if (COMING_SOON_MODE && !isAuthenticated && !isComingSoonPage) {
    return NextResponse.redirect(new URL('/preview', request.url))
  }

  // 認証済みで Coming Soon ページにアクセス → トップへ
  if (COMING_SOON_MODE && isAuthenticated && isComingSoonPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
