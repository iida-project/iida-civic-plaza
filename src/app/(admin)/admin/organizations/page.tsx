import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, Star } from 'lucide-react'
import { OrganizationList } from './_components'
import { getFeaturedCount } from './actions'
import { ScrollToTop } from '@/components/admin/ScrollToTop'

export const dynamic = 'force-dynamic'

type OrganizationWithCategories = {
  id: string
  name: string
  slug: string
  is_published: boolean
  is_featured: boolean
  updated_at: string
  organization_categories: { category: { name: string } | null }[]
}

export default async function OrganizationsPage() {
  const supabase = createAdminClient()

  const { data: organizations, error } = await supabase
    .from('organizations')
    .select(
      `
      id,
      name,
      slug,
      is_published,
      is_featured,
      updated_at,
      organization_categories (
        category:activity_categories (
          name
        )
      )
    `
    )
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch organizations:', error)
  }

  // ピックアップ数を取得
  const featuredCount = await getFeaturedCount()

  // Transform data to match expected type
  const typedOrganizations: OrganizationWithCategories[] = (organizations || []).map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    is_published: org.is_published,
    is_featured: org.is_featured ?? false,
    updated_at: org.updated_at,
    organization_categories: (org.organization_categories || []).map((oc) => ({
      category: oc.category as unknown as { name: string } | null,
    })),
  }))

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
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">団体管理</h1>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
            featuredCount >= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
          }`}>
            <Star className={`h-3.5 w-3.5 ${featuredCount >= 3 ? 'fill-amber-500 text-amber-500' : ''}`} />
            ピックアップ {featuredCount}/3
          </span>
        </div>
        <Button asChild>
          <Link href="/admin/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <OrganizationList organizations={typedOrganizations} featuredCount={featuredCount} />
    </div>
  )
}
