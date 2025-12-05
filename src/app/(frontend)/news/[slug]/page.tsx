import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Bell, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

async function getNewsPost(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  return data
}

async function getOtherNews(currentId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('news_posts')
    .select('id, slug, title, published_at')
    .eq('is_published', true)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(5)

  return data || []
}

export async function generateStaticParams() {
  return []
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsPost(slug)

  if (!news) {
    return {
      title: 'お知らせが見つかりません',
    }
  }

  const description = news.body ? stripHtml(news.body).slice(0, 120) : ''

  return {
    title: `${news.title} | お知らせ`,
    description,
    openGraph: {
      title: news.title,
      description,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = await getNewsPost(slug)

  if (!news) {
    notFound()
  }

  const otherNews = await getOtherNews(news.id)

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 戻るリンク */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          お知らせ一覧に戻る
        </Link>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 記事本文 */}
          <article className="lg:col-span-3">
            {/* ヘッダー */}
            <header className="mb-8">
              {/* 日付 */}
              {news.published_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={news.published_at}>
                    {format(new Date(news.published_at), 'yyyy年M月d日（E）', {
                      locale: ja,
                    })}
                  </time>
                </div>
              )}

              {/* タイトル */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {news.title}
              </h1>
            </header>

            {/* 本文 */}
            {news.body && (
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:my-6
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-foreground/80 prose-li:my-2
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/70"
                dangerouslySetInnerHTML={{ __html: news.body }}
              />
            )}

            {/* 一覧へ戻るボタン */}
            <div className="mt-12 pt-8 border-t border-border">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                <Bell className="h-4 w-4" />
                お知らせ一覧を見る
              </Link>
            </div>
          </article>

          {/* サイドバー */}
          <aside className="space-y-6">
            {/* 他のお知らせ */}
            {otherNews.length > 0 && (
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <Bell className="h-4 w-4 text-primary" />
                  他のお知らせ
                </h2>
                <div className="space-y-3">
                  {otherNews.map((other) => (
                    <Link
                      key={other.id}
                      href={`/news/${other.slug}`}
                      className="block group"
                    >
                      <div className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {other.title}
                      </div>
                      {other.published_at && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(other.published_at), 'yyyy.M.d', {
                            locale: ja,
                          })}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
