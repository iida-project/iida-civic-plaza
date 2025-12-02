import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { OrganizationList } from './_components'

export const dynamic = 'force-dynamic'

type OrganizationWithCategories = {
  id: string
  name: string
  slug: string
  is_published: boolean
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

  // Transform data to match expected type
  const typedOrganizations: OrganizationWithCategories[] = (organizations || []).map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    is_published: org.is_published,
    updated_at: org.updated_at,
    organization_categories: (org.organization_categories || []).map((oc) => ({
      category: oc.category as unknown as { name: string } | null,
    })),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">団体管理</h1>
        <Button asChild>
          <Link href="/admin/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <OrganizationList organizations={typedOrganizations} />
    </div>
  )
}
