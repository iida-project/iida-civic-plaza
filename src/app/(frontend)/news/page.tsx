import { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { Bell } from 'lucide-react'
import { NewsItem } from './_components'

export const metadata: Metadata = {
  title: 'お知らせ | 飯田の市民活動ひろば',
  description: '飯田の市民活動ひろばからのお知らせ一覧です。',
}

export const revalidate = 60

async function getNewsPosts() {
  const supabase = createPublicClient()

  const { data } = await supabase
    .from('news_posts')
    .select('id, slug, title, body, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return data || []
}

export default async function NewsPage() {
  const newsPosts = await getNewsPosts()

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">お知らせ</h1>
          <p className="text-muted-foreground">
            サイトからのお知らせをお届けします
          </p>
        </div>

        {/* 一覧 */}
        {newsPosts.length > 0 ? (
          <div className="space-y-4 max-w-3xl">
            {newsPosts.map((news) => (
              <NewsItem key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              お知らせはまだありません
            </h2>
            <p className="text-muted-foreground">
              お知らせが公開されるまでお待ちください
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
