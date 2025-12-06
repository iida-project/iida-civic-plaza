import { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { Coins } from 'lucide-react'
import { GrantCard, FilterSection } from './_components'

export const metadata: Metadata = {
  title: '助成金情報 | 飯田の市民活動ひろば',
  description: '市民活動団体向けの助成金・補助金情報をお届けします。募集中の助成金や締切間近の情報をチェック。',
}

export const revalidate = 60

type Props = {
  searchParams: Promise<{ showClosed?: string; sort?: string }>
}

async function getGrants(showClosed: boolean, sort: string) {
  const supabase = createPublicClient()

  let query = supabase
    .from('grants')
    .select('id, slug, title, provider_name, description, application_start_date, application_end_date, subsidy_min_amount, subsidy_max_amount, target_organizations')
    .eq('is_published', true)

  // 募集終了を含めない場合
  if (!showClosed) {
    const today = new Date().toISOString().split('T')[0]
    query = query.gte('application_end_date', today)
  }

  // ソート
  if (sort === 'newest') {
    query = query.order('published_at', { ascending: false })
  } else {
    // deadline (デフォルト)
    query = query.order('application_end_date', { ascending: true })
  }

  const { data } = await query

  return data || []
}

async function getClosedCount() {
  const supabase = createPublicClient()
  const today = new Date().toISOString().split('T')[0]

  const { count } = await supabase
    .from('grants')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true)
    .lt('application_end_date', today)

  return count || 0
}

export default async function GrantsPage({ searchParams }: Props) {
  const params = await searchParams
  const showClosed = params.showClosed === 'true'
  const sort = params.sort || 'deadline'

  const [grants, closedCount] = await Promise.all([
    getGrants(showClosed, sort),
    getClosedCount(),
  ])

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">助成金情報</h1>
          <p className="text-muted-foreground">
            市民活動団体向けの助成金・補助金情報
          </p>
        </div>

        {/* フィルター */}
        <FilterSection showClosedCount={closedCount} totalCount={grants.length} />

        {/* 一覧 */}
        {grants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Coins className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {showClosed ? '助成金情報はまだありません' : '現在募集中の助成金はありません'}
            </h2>
            <p className="text-muted-foreground">
              {showClosed
                ? '情報が公開されるまでお待ちください'
                : '募集終了した助成金を含めて表示するには上のチェックをオンにしてください'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
