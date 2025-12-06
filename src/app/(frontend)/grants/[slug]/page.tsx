import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/public'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Coins,
  Users,
  Folder,
  ExternalLink,
  FileText,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { format, differenceInDays, isBefore, isToday, isAfter } from 'date-fns'
import { ja } from 'date-fns/locale'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

type CategoryItem = { id: string; name: string; slug: string }

async function getGrant(slug: string) {
  const supabase = createPublicClient()

  const { data: grant } = await supabase
    .from('grants')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!grant) return null

  // 対象分野を取得
  const { data: grantCategories } = await supabase
    .from('grant_categories')
    .select('category:activity_categories(id, name, slug)')
    .eq('grant_id', grant.id)

  return {
    ...grant,
    categories: (grantCategories || []).map(
      (gc) => gc.category as unknown as CategoryItem
    ),
  }
}

async function getOtherGrants(currentId: string) {
  const supabase = createPublicClient()
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('grants')
    .select('id, slug, title, application_end_date')
    .eq('is_published', true)
    .neq('id', currentId)
    .gte('application_end_date', today)
    .order('application_end_date', { ascending: true })
    .limit(5)

  return data || []
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const grant = await getGrant(slug)

  if (!grant) {
    return {
      title: '助成金情報が見つかりません',
    }
  }

  return {
    title: `${grant.title} | 助成金情報`,
    description: grant.description || `${grant.provider_name}による助成金情報`,
  }
}

function formatAmount(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toLocaleString()}万円`
  }
  return `${amount.toLocaleString()}円`
}

function getApplicationStatus(startDate: string | null, endDate: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadline = new Date(endDate)
  deadline.setHours(0, 0, 0, 0)

  if (isBefore(deadline, today)) {
    return { status: 'closed', label: '募集終了' }
  }

  if (startDate) {
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    if (isAfter(start, today)) {
      return { status: 'upcoming', label: '募集開始前' }
    }
  }

  const daysRemaining = differenceInDays(deadline, today)

  if (isToday(deadline)) {
    return { status: 'urgent', label: '本日締切', days: 0 }
  }

  if (daysRemaining <= 7) {
    return { status: 'urgent', label: `締切まで残り${daysRemaining}日`, days: daysRemaining }
  }

  if (daysRemaining <= 14) {
    return { status: 'soon', label: `締切まで残り${daysRemaining}日`, days: daysRemaining }
  }

  return { status: 'open', label: '募集中', days: daysRemaining }
}

export default async function GrantDetailPage({ params }: Props) {
  const { slug } = await params
  const grant = await getGrant(slug)

  if (!grant) {
    notFound()
  }

  const otherGrants = await getOtherGrants(grant.id)
  const appStatus = getApplicationStatus(grant.application_start_date, grant.application_end_date)

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 戻るリンク */}
        <Link
          href="/grants"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          助成金一覧に戻る
        </Link>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム: メイン情報 */}
          <div className="lg:col-span-2 space-y-8">
            {/* ヘッダー */}
            <div>
              {/* ステータスバッジ */}
              <div className="mb-4">
                {appStatus.status === 'closed' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground text-sm font-medium rounded-full">
                    募集終了
                  </span>
                ) : appStatus.status === 'upcoming' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-apple-blue text-white text-sm font-medium rounded-full">
                    <Clock className="h-4 w-4" />
                    募集開始前
                  </span>
                ) : appStatus.status === 'urgent' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-apple-red text-white text-sm font-medium rounded-full">
                    <AlertTriangle className="h-4 w-4" />
                    {appStatus.label}
                  </span>
                ) : appStatus.status === 'soon' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-apple-orange text-white text-sm font-medium rounded-full">
                    <Clock className="h-4 w-4" />
                    {appStatus.label}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-apple-green text-white text-sm font-medium rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    募集中
                  </span>
                )}
              </div>

              {/* タイトル */}
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                {grant.title}
              </h1>

              {/* 実施主体 */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-5 w-5" />
                <span className="text-lg">{grant.provider_name}</span>
              </div>
            </div>

            {/* 概要 */}
            {grant.description && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-semibold mb-3">概要</h2>
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {grant.description}
                </p>
              </div>
            )}

            {/* 詳細情報 */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">詳細情報</h2>
              <dl className="space-y-4">
                {/* 募集期間 */}
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="flex items-center gap-2 text-muted-foreground font-medium min-w-[140px] mb-1 sm:mb-0">
                    <Calendar className="h-4 w-4" />
                    募集期間
                  </dt>
                  <dd className="text-foreground">
                    {grant.application_start_date
                      ? format(new Date(grant.application_start_date), 'yyyy年M月d日', { locale: ja })
                      : '指定なし'
                    }
                    {' 〜 '}
                    {format(new Date(grant.application_end_date), 'yyyy年M月d日', { locale: ja })}
                  </dd>
                </div>

                {/* 補助金額 */}
                {(grant.subsidy_min_amount || grant.subsidy_max_amount) && (
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="flex items-center gap-2 text-muted-foreground font-medium min-w-[140px] mb-1 sm:mb-0">
                      <Coins className="h-4 w-4" />
                      補助金額
                    </dt>
                    <dd className="text-foreground">
                      {grant.subsidy_min_amount && grant.subsidy_max_amount ? (
                        `${formatAmount(grant.subsidy_min_amount)} 〜 ${formatAmount(grant.subsidy_max_amount)}`
                      ) : grant.subsidy_max_amount ? (
                        `上限 ${formatAmount(grant.subsidy_max_amount)}`
                      ) : grant.subsidy_min_amount ? (
                        `${formatAmount(grant.subsidy_min_amount)} 〜`
                      ) : null}
                    </dd>
                  </div>
                )}

                {/* 対象団体 */}
                {grant.target_organizations && grant.target_organizations.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="flex items-center gap-2 text-muted-foreground font-medium min-w-[140px] mb-1 sm:mb-0">
                      <Users className="h-4 w-4" />
                      対象団体
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {grant.target_organizations.map((org: string, index: number) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-muted text-foreground text-sm rounded-full"
                        >
                          {org}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                {/* 対象分野 */}
                {grant.categories.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="flex items-center gap-2 text-muted-foreground font-medium min-w-[140px] mb-1 sm:mb-0">
                      <Folder className="h-4 w-4" />
                      対象分野
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {grant.categories.map((cat: CategoryItem) => (
                        <span
                          key={cat.id}
                          className="px-2.5 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* CTAボタン */}
            {appStatus.status !== 'closed' && (
              <div className="flex flex-wrap gap-4">
                {grant.apply_url && (
                  <a
                    href={grant.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium"
                  >
                    申請する
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {grant.guidelines_file_url && (
                  <a
                    href={grant.guidelines_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-full hover:bg-muted transition-colors font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    募集要項を見る
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 右カラム: サイドバー */}
          <div className="space-y-6">
            {/* お問い合わせ */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">お問い合わせ</h2>
              <p className="text-sm text-muted-foreground mb-4">
                この助成金についてのご質問は、下記までお問い合わせください。
              </p>
              {grant.contact_url ? (
                <a
                  href={grant.contact_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  お問い合わせページ
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <a
                  href="https://www.city.iida.lg.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  飯田市役所
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* 他の助成金 */}
            {otherGrants.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Coins className="h-5 w-5 text-primary" />
                  他の助成金
                </h2>
                <div className="space-y-3">
                  {otherGrants.map((other) => (
                    <Link
                      key={other.id}
                      href={`/grants/${other.slug}`}
                      className="block group"
                    >
                      <div className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {other.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        締切: {format(new Date(other.application_end_date), 'M月d日', { locale: ja })}
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/grants"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-4"
                >
                  すべての助成金を見る
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
