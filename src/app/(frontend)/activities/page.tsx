import { Suspense } from 'react'
import { createPublicClient } from '@/lib/supabase/public'
import { FilterSection, OrganizationCard } from './_components'
import { Users } from 'lucide-react'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ category?: string; area?: string }>
}

async function getCategories() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('activity_categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })
  return data || []
}

async function getAreas() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('activity_areas')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })
  return data || []
}

async function getOrganizations(categorySlug?: string, areaSlug?: string) {
  const supabase = createPublicClient()

  // まず公開済みの団体を取得
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, slug, name, short_name, summary, main_image_url, is_recruiting')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (!organizations || organizations.length === 0) {
    return []
  }

  const orgIds = organizations.map((org) => org.id)

  // カテゴリを取得
  const { data: orgCategories } = await supabase
    .from('organization_categories')
    .select('organization_id, category:activity_categories(name, slug)')
    .in('organization_id', orgIds)

  // エリアを取得
  const { data: orgAreas } = await supabase
    .from('organization_areas')
    .select('organization_id, area:activity_areas(name, slug)')
    .in('organization_id', orgIds)

  // タグを取得
  const { data: orgTags } = await supabase
    .from('organization_tags')
    .select('organization_id, tag:tags(name, slug)')
    .in('organization_id', orgIds)

  // データを結合
  let result = organizations.map((org) => ({
    ...org,
    categories: (orgCategories || [])
      .filter((oc) => oc.organization_id === org.id)
      .map((oc) => oc.category as unknown as { name: string; slug: string }),
    areas: (orgAreas || [])
      .filter((oa) => oa.organization_id === org.id)
      .map((oa) => oa.area as unknown as { name: string; slug: string }),
    tags: (orgTags || [])
      .filter((ot) => ot.organization_id === org.id)
      .map((ot) => ot.tag as unknown as { name: string; slug: string }),
  }))

  // カテゴリでフィルタ
  if (categorySlug) {
    result = result.filter((org) =>
      org.categories.some((cat) => cat.slug === categorySlug)
    )
  }

  // エリアでフィルタ
  if (areaSlug) {
    result = result.filter((org) =>
      org.areas.some((area) => area.slug === areaSlug)
    )
  }

  return result
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">団体が見つかりませんでした</h3>
      <p className="text-muted-foreground">
        条件を変更して再度お試しください
      </p>
    </div>
  )
}

export default async function ActivitiesPage({ searchParams }: Props) {
  const params = await searchParams
  const categorySlug = params.category
  const areaSlug = params.area

  const [categories, areas, organizations] = await Promise.all([
    getCategories(),
    getAreas(),
    getOrganizations(categorySlug, areaSlug),
  ])

  // 選択中のフィルタ名を取得
  const selectedCategoryName = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name
    : null
  const selectedAreaName = areaSlug
    ? areas.find((a) => a.slug === areaSlug)?.name
    : null

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">市民活動紹介</h1>
          <p className="text-foreground/70">
            飯田市内で活動する団体を紹介しています
          </p>
          {(selectedCategoryName || selectedAreaName) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategoryName && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedCategoryName}
                </span>
              )}
              {selectedAreaName && (
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                  {selectedAreaName}
                </span>
              )}
              <span className="text-sm text-muted-foreground self-center">
                で絞り込み中 ({organizations.length}件)
              </span>
            </div>
          )}
        </div>

        {/* フィルタセクション */}
        <Suspense fallback={null}>
          <FilterSection
            categories={categories}
            areas={areas}
            selectedCategory={categorySlug}
            selectedArea={areaSlug}
          />
        </Suspense>

        {/* 団体一覧 */}
        {organizations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org, index) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
