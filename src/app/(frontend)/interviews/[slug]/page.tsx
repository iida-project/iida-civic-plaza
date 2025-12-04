import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Mic, ArrowLeft, Building2, Calendar } from 'lucide-react'
import { TableOfContents, ArticleBody } from './_components'
import { ImageGallery } from '../../activities/[slug]/_components'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

async function getInterview(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('interviews')
    .select(`
      *,
      organization:organizations(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) return null

  return {
    ...data,
    organization: data.organization as unknown as { id: string; name: string; slug: string } | null,
  }
}

async function getOtherInterviews(currentId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('interviews')
    .select('id, slug, title, main_image_url')
    .eq('is_published', true)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(3)

  return data || []
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const interview = await getInterview(slug)

  if (!interview) {
    return {
      title: 'インタビューが見つかりません',
    }
  }

  return {
    title: `${interview.title} | 団体インタビュー`,
    description: interview.lead_text,
    openGraph: {
      title: interview.title,
      description: interview.lead_text,
      images: interview.main_image_url ? [interview.main_image_url] : [],
    },
  }
}

export default async function InterviewDetailPage({ params }: Props) {
  const { slug } = await params
  const interview = await getInterview(slug)

  if (!interview) {
    notFound()
  }

  const otherInterviews = await getOtherInterviews(interview.id)
  const galleryImages = (interview.gallery_images as string[] | null) || []

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 戻るリンク */}
        <Link
          href="/interviews"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          インタビュー一覧に戻る
        </Link>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 記事本文 */}
          <article className="lg:col-span-3">
            {/* ヘッダー画像 */}
            <div className="relative w-full aspect-video bg-muted rounded-2xl overflow-hidden mb-8">
              {interview.main_image_url ? (
                <Image
                  src={interview.main_image_url}
                  alt={interview.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Mic className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
              {interview.organization && (
                <Link
                  href={`/activities/${interview.organization.slug}`}
                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  {interview.organization.name}
                </Link>
              )}
              {interview.published_at && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDistanceToNow(new Date(interview.published_at), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </span>
              )}
            </div>

            {/* タイトル */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
              {interview.title}
            </h1>

            {/* リード文 */}
            <p className="text-lg text-foreground/80 leading-relaxed mb-8 p-6 bg-muted/50 rounded-xl border-l-4 border-primary">
              {interview.lead_text}
            </p>

            {/* 本文 */}
            <ArticleBody html={interview.body} />

            {/* 画像ギャラリー */}
            {galleryImages.length > 0 && (
              <div className="mt-12">
                <ImageGallery images={galleryImages} orgName={interview.title} />
              </div>
            )}

            {/* 関連団体への誘導 */}
            {interview.organization && (
              <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
                <h2 className="text-lg font-semibold mb-3">この団体について</h2>
                <p className="text-muted-foreground mb-4">
                  {interview.organization.name}の活動詳細をご覧ください。
                </p>
                <Link
                  href={`/activities/${interview.organization.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  団体ページを見る
                </Link>
              </div>
            )}
          </article>

          {/* サイドバー */}
          <aside className="space-y-6">
            {/* 目次 */}
            <TableOfContents html={interview.body} />

            {/* 他のインタビュー */}
            {otherInterviews.length > 0 && (
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <Mic className="h-4 w-4 text-primary" />
                  他のインタビュー
                </h2>
                <div className="space-y-4">
                  {otherInterviews.map((other) => (
                    <Link
                      key={other.id}
                      href={`/interviews/${other.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {other.main_image_url ? (
                          <Image
                            src={other.main_image_url}
                            alt={other.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Mic className="h-4 w-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {other.title}
                      </span>
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
