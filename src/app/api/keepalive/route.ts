import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'

// Vercel Cron から毎回実行されるよう、キャッシュさせない
export const dynamic = 'force-dynamic'

/**
 * Supabase スリープ防止用のキープアライブ。
 * 無料プランは一定期間 DB アクセスが無いと一時停止されるため、
 * Vercel Cron（vercel.json）から1日1回呼び出し、実際に軽量クエリを投げて
 * DB を「活動中」状態に保つ。
 *
 * 認証: Vercel Cron はリクエストに `Authorization: Bearer ${CRON_SECRET}` を
 * 自動付与する。CRON_SECRET 環境変数と一致しないリクエストは拒否する。
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createPublicClient()

    // 行データは返さず件数のみ取得する軽量クエリ（DB に touch するのが目的）
    const { error } = await supabase
      .from('activity_categories')
      .select('id', { count: 'exact', head: true })

    if (error) throw error

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Keepalive query failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Database query failed' },
      { status: 500 }
    )
  }
}
