import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { NewsList } from './_components'
import { ScrollToTop } from '@/components/admin/ScrollToTop'

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const supabase = createAdminClient()

  const { data: newsList, error } = await supabase
    .from('news_posts')
    .select(
      `
      id,
      title,
      slug,
      is_published,
      published_at,
      updated_at
    `
    )
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Failed to fetch news:', error)
  }

  return (
    <div className="space-y-6">
      <ScrollToTop />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            管理画面へ
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">お知らせ管理</h1>
        <Button asChild>
          <Link href="/admin/news/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <NewsList newsList={newsList || []} />
    </div>
  )
}
