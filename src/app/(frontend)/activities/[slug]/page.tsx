import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/public'
import {
  Users,
  MapPin,
  Folder,
  Tag,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  ArrowLeft,
  UserPlus,
  Calendar,
  Banknote,
  Building,
  User,
} from 'lucide-react'
import { ImageGallery, RichTextRenderer } from '@/components/common'
import { RelatedInterviews } from './_components/RelatedInterviews'

// SNSアイコンコンポーネント
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

type CategoryItem = { id: string; name: string; slug: string }
type AreaItem = { id: string; name: string; slug: string }
type TagItem = { id: string; name: string; slug: string }

async function getOrganization(slug: string) {
  const supabase = createPublicClient()
  // URLエンコードされた日本語スラッグをデコード
  const decodedSlug = decodeURIComponent(slug)

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', decodedSlug)
    .eq('is_published', true)
    .single()

  if (!org) return null

  // カテゴリを取得
  const { data: orgCategories } = await supabase
    .from('organization_categories')
    .select('category:activity_categories(id, name, slug)')
    .eq('organization_id', org.id)

  // エリアを取得
  const { data: orgAreas } = await supabase
    .from('organization_areas')
    .select('area:activity_areas(id, name, slug)')
    .eq('organization_id', org.id)

  // タグを取得
  const { data: orgTags } = await supabase
    .from('organization_tags')
    .select('tag:tags(id, name, slug)')
    .eq('organization_id', org.id)

  return {
    ...org,
    categories: (orgCategories || []).map(
      (oc) => oc.category as unknown as CategoryItem
    ),
    areas: (orgAreas || []).map(
      (oa) => oa.area as unknown as AreaItem
    ),
    tags: (orgTags || []).map(
      (ot) => ot.tag as unknown as TagItem
    ),
  }
}

async function getRelatedInterviews(organizationId: string) {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('interviews')
    .select('id, slug, title, main_image_url')
    .eq('organization_id', organizationId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  return data || []
}

async function getOtherOrganizations(currentOrgId: string) {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('organizations')
    .select('id, slug, name, short_name, main_image_url')
    .eq('is_published', true)
    .neq('id', currentOrgId)
    .order('published_at', { ascending: false })
    .limit(5)

  return data || []
}

export async function generateStaticParams() {
  // ビルド時は空の配列を返し、動的に生成する
  // (サーバーコンポーネントでcookiesを使うSupabaseクライアントはビルド時に使えないため)
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const org = await getOrganization(slug)

  if (!org) {
    return {
      title: '団体が見つかりません',
    }
  }

  // summaryからHTMLタグを除去してdescriptionに使用
  const plainSummary = org.summary.replace(/<[^>]*>/g, '').slice(0, 160)

  return {
    title: `${org.short_name || org.name} | 市民活動紹介`,
    description: plainSummary,
    openGraph: {
      title: org.short_name || org.name,
      description: plainSummary,
      images: org.main_image_url ? [org.main_image_url] : [],
    },
  }
}

export default async function OrganizationDetailPage({ params }: Props) {
  const { slug } = await params
  const org = await getOrganization(slug)

  if (!org) {
    notFound()
  }

  const [relatedInterviews, otherOrganizations] = await Promise.all([
    getRelatedInterviews(org.id),
    getOtherOrganizations(org.id),
  ])
  const galleryImages = (org.gallery_images as string[] | null) || []

  const hasSocialLinks =
    org.facebook_url || org.twitter_url || org.instagram_url || org.website_url
  const hasContactInfo = org.contact_email || org.contact_phone || org.contact_name
  const hasOrgInfo =
    org.representative ||
    org.established_year ||
    org.member_count ||
    org.membership_fee ||
    org.activity_schedule ||
    org.activity_location

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 戻るリンク */}
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          市民活動一覧に戻る
        </Link>

        {/* メイングリッド: サイドバーが2行にまたがる */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Row1 Col1: タイトル・リード文・分類 */}
          <div className="space-y-4 order-2 md:order-1">
            {/* タイトル */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {org.name}
                </h1>
                {/* 会員募集中バッジ */}
                {org.is_recruiting && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white text-sm font-bold rounded-sm shadow-md">
                    <UserPlus className="h-4 w-4" />
                    会員募集中
                  </span>
                )}
              </div>
              {org.short_name && org.short_name !== org.name && (
                <p className="text-lg text-muted-foreground">
                  {org.short_name}
                </p>
              )}
            </div>

            {/* 概要説明（リッチテキスト） */}
            <div className="text-foreground/80">
              <RichTextRenderer html={org.summary} size="default" />
            </div>

            {/* カテゴリ・エリア・タグ */}
            <div className="space-y-3">
              {/* 活動分野 */}
              {org.categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <Folder className="h-4 w-4" />
                    活動分野:
                  </span>
                  {org.categories.map((cat: CategoryItem) => (
                    <Link
                      key={cat.id}
                      href={`/activities?category=${cat.slug}`}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* 活動エリア */}
              {org.areas.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    活動エリア:
                  </span>
                  {org.areas.map((area: AreaItem) => (
                    <Link
                      key={area.id}
                      href={`/activities?area=${area.slug}`}
                      className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full hover:bg-secondary/20 transition-colors"
                    >
                      {area.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* タグ */}
              {org.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    タグ:
                  </span>
                  {org.tags.map((tag: TagItem) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-apple-green/10 text-apple-green text-sm rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row1 Col2: メイン画像 */}
          <div className="order-1 md:order-2">
            <div className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden">
              {org.main_image_url ? (
                <Image
                  src={org.main_image_url}
                  alt={org.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>

          {/* Row1-2 Col3: サイドバー（2行にまたがる） */}
          <div className="space-y-6 order-3 md:row-span-2">
            {/* 団体情報 */}
            {hasOrgInfo && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-semibold mb-4">団体情報</h2>
                <dl className="space-y-3">
                  {org.representative && (
                    <div className="flex items-start gap-3">
                      <dt className="flex items-center gap-2 text-sm text-muted-foreground min-w-[80px]">
                        <User className="h-4 w-4" />
                        代表者
                      </dt>
                      <dd className="text-sm">{org.representative}</dd>
                    </div>
                  )}
                  {org.established_year && (
                    <div className="flex items-start gap-3">
                      <dt className="flex items-center gap-2 text-sm text-muted-foreground min-w-[80px]">
                        <Building className="h-4 w-4" />
                        設立
                      </dt>
                      <dd className="text-sm">{org.established_year}年</dd>
                    </div>
                  )}
                  {org.member_count && (
                    <div className="flex items-start gap-3">
                      <dt className="flex items-center gap-2 text-sm text-muted-foreground min-w-[80px]">
                        <Users className="h-4 w-4" />
                        会員数
                      </dt>
                      <dd className="text-sm">{org.member_count}</dd>
                    </div>
                  )}
                  {org.membership_fee && (
                    <div className="flex items-start gap-3">
                      <dt className="flex items-center gap-2 text-sm text-muted-foreground min-w-[80px]">
                        <Banknote className="h-4 w-4" />
                        会費
                      </dt>
                      <dd className="text-sm">{org.membership_fee}</dd>
                    </div>
                  )}
                  {org.activity_schedule && (
                    <div className="flex items-start gap-3">
                      <dt className="flex items-center gap-2 text-sm text-muted-foreground min-w-[80px]">
                        <Calendar className="h-4 w-4" />
                        活動日
                      </dt>
                      <dd className="text-sm">{org.activity_schedule}</dd>
                    </div>
                  )}
                  {org.activity_location && (
                    <div className="flex items-start gap-3">
                      <dt className="flex items-center gap-2 text-sm text-muted-foreground min-w-[80px]">
                        <MapPin className="h-4 w-4" />
                        活動場所
                      </dt>
                      <dd className="text-sm">{org.activity_location}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* 連絡先 */}
            {hasContactInfo && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-semibold mb-4">連絡先</h2>
                <div className="space-y-3">
                  {org.contact_name && (
                    <p className="text-sm text-foreground/80">
                      担当: {org.contact_name}
                    </p>
                  )}
                  {org.contact_email && (
                    <a
                      href={`mailto:${org.contact_email}`}
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {org.contact_email}
                    </a>
                  )}
                  {org.contact_phone && (
                    <a
                      href={`tel:${org.contact_phone}`}
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {org.contact_phone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 外部リンク・SNS */}
            {hasSocialLinks && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-semibold mb-4">外部リンク</h2>
                <div className="space-y-3">
                  {org.website_url && (
                    <a
                      href={org.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      公式サイト
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {org.facebook_url && (
                    <a
                      href={org.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <FacebookIcon className="h-4 w-4" />
                      Facebook
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {org.twitter_url && (
                    <a
                      href={org.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <TwitterIcon className="h-4 w-4" />
                      X (Twitter)
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {org.instagram_url && (
                    <a
                      href={org.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      <InstagramIcon className="h-4 w-4" />
                      Instagram
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 他の活動団体 */}
            {otherOrganizations.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  他の活動団体
                </h2>
                <div className="space-y-4">
                  {otherOrganizations.map((otherOrg) => (
                    <Link
                      key={otherOrg.id}
                      href={`/activities/${otherOrg.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {otherOrg.main_image_url ? (
                          <Image
                            src={otherOrg.main_image_url}
                            alt={otherOrg.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {otherOrg.short_name || otherOrg.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/activities"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-4"
                >
                  すべての団体を見る
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Row2 Col1-2: 活動内容（2列にまたがる） */}
          {org.activity_description && (
            <div className="order-4 md:col-span-2">
              <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border h-full">
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
                  <Users className="h-5 w-5 text-primary" />
                  活動内容
                </h2>
                <RichTextRenderer html={org.activity_description} size="default" />
              </div>
            </div>
          )}
        </div>

        {/* 下部: フル幅セクション */}
        <div className="space-y-8">
          {/* 画像ギャラリー */}
          {galleryImages.length > 0 && (
            <ImageGallery images={galleryImages} alt={`${org.name}の活動写真`} title="活動の様子" />
          )}

          {/* 参加方法 */}
          {org.participation_info && (
            <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
                <UserPlus className="h-5 w-5 text-primary" />
                参加方法
              </h2>
              <RichTextRenderer html={org.participation_info} size="default" />
            </div>
          )}

          {/* 関連インタビュー */}
          {relatedInterviews.length > 0 && (
            <RelatedInterviews interviews={relatedInterviews} />
          )}
        </div>
      </div>
    </div>
  )
}
