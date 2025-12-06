import { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { Mic } from 'lucide-react'
import { InterviewCard } from './_components'

export const metadata: Metadata = {
  title: '団体インタビュー | 飯田の市民活動ひろば',
  description: '飯田市で活動する市民団体のロングインタビュー記事。活動への想いや取り組みを深掘りしてご紹介します。',
}

export const revalidate = 60

async function getInterviews() {
  const supabase = createPublicClient()

  const { data } = await supabase
    .from('interviews')
    .select(`
      id,
      slug,
      title,
      lead_text,
      main_image_url,
      is_featured,
      published_at,
      organization:organizations(name, slug)
    `)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })

  if (!data) return { featured: [], regular: [] }

  const interviews = data.map((interview) => ({
    ...interview,
    organization: interview.organization as unknown as { name: string; slug: string } | null,
  }))

  // ピックアップと通常を分離
  const featured = interviews.filter((i) => i.is_featured)
  const regular = interviews.filter((i) => !i.is_featured)

  return { featured, regular }
}

export default async function InterviewsPage() {
  const { featured, regular } = await getInterviews()
  const hasInterviews = featured.length > 0 || regular.length > 0

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">団体インタビュー</h1>
          <p className="text-muted-foreground">
            活動への想いや取り組みを、じっくりとお聞きしました
          </p>
        </div>

        {hasInterviews ? (
          <div className="space-y-12">
            {/* ピックアップ記事 */}
            {featured.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-apple-orange">★</span>
                  ピックアップ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 通常記事 */}
            {regular.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <h2 className="text-xl font-semibold mb-6">すべてのインタビュー</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* 空状態 */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Mic className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              インタビュー記事はまだありません
            </h2>
            <p className="text-muted-foreground">
              記事が公開されるまでお待ちください
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
