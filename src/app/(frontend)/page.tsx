import { createClient } from '@/lib/supabase/server'
import {
  HeroSection,
  LatestArticlesSection,
  SearchSection,
  FeaturedInterviewsSection,
  PickupOrganizationsSection,
  CTASection,
} from './_components'

export const revalidate = 60 // ISR: 60秒ごとに再検証

type Article = {
  id: string
  slug: string
  title: string
  type: 'organization' | 'interview' | 'grant' | 'news'
  published_at: string
  summary?: string
}

async function getLatestArticles(): Promise<Article[]> {
  const supabase = await createClient()
  const articles: Article[] = []

  // 団体（最新3件）
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, slug, name, summary, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  organizations?.forEach((org) => {
    articles.push({
      id: org.id,
      slug: org.slug,
      title: org.name,
      type: 'organization',
      published_at: org.published_at,
      summary: org.summary,
    })
  })

  // インタビュー（最新2件）
  const { data: interviews } = await supabase
    .from('interviews')
    .select('id, slug, title, lead_text, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(2)

  interviews?.forEach((interview) => {
    articles.push({
      id: interview.id,
      slug: interview.slug,
      title: interview.title,
      type: 'interview',
      published_at: interview.published_at,
      summary: interview.lead_text,
    })
  })

  // 助成金（最新2件）
  const { data: grants } = await supabase
    .from('grants')
    .select('id, slug, title, provider_name, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(2)

  grants?.forEach((grant) => {
    articles.push({
      id: grant.id,
      slug: grant.slug,
      title: grant.title,
      type: 'grant',
      published_at: grant.published_at,
      summary: `${grant.provider_name}`,
    })
  })

  // お知らせ（最新2件）
  const { data: news } = await supabase
    .from('news_posts')
    .select('id, slug, title, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(2)

  news?.forEach((post) => {
    articles.push({
      id: post.id,
      slug: post.slug,
      title: post.title,
      type: 'news',
      published_at: post.published_at,
    })
  })

  // 日付順にソート
  return articles.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  ).slice(0, 6)
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('activity_categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })
  return data || []
}

async function getAreas() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('activity_areas')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })
  return data || []
}

async function getFeaturedInterviews() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('interviews')
    .select(`
      id,
      slug,
      title,
      lead_text,
      main_image_url,
      organization:organizations(name)
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(4)

  return (data || []).map((interview) => ({
    ...interview,
    organization: interview.organization as unknown as { name: string } | null,
  }))
}

async function getPickupOrganizations() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('organizations')
    .select(`
      id,
      slug,
      name,
      short_name,
      summary,
      main_image_url
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  if (!data) return []

  // カテゴリとエリアを別途取得
  const orgIds = data.map((org) => org.id)

  const { data: orgCategories } = await supabase
    .from('organization_categories')
    .select('organization_id, category:activity_categories(name)')
    .in('organization_id', orgIds)

  const { data: orgAreas } = await supabase
    .from('organization_areas')
    .select('organization_id, area:activity_areas(name)')
    .in('organization_id', orgIds)

  return data.map((org) => ({
    ...org,
    categories: (orgCategories || [])
      .filter((oc) => oc.organization_id === org.id)
      .map((oc) => oc.category as unknown as { name: string }),
    areas: (orgAreas || [])
      .filter((oa) => oa.organization_id === org.id)
      .map((oa) => oa.area as unknown as { name: string }),
  }))
}

export default async function Home() {
  const [articles, categories, areas, featuredInterviews, pickupOrganizations] =
    await Promise.all([
      getLatestArticles(),
      getCategories(),
      getAreas(),
      getFeaturedInterviews(),
      getPickupOrganizations(),
    ])

  return (
    <div>
      <HeroSection />
      <LatestArticlesSection articles={articles} />
      <SearchSection categories={categories} areas={areas} />
      <PickupOrganizationsSection organizations={pickupOrganizations} />
      <FeaturedInterviewsSection interviews={featuredInterviews} />
      <CTASection />
    </div>
  )
}
