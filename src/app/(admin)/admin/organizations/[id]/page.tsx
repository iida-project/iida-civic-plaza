import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { OrganizationForm } from '../_components'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditOrganizationPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  // 団体データとマスターデータを並列で取得
  const [orgResult, categoriesResult, areasResult, tagsResult] =
    await Promise.all([
      supabase
        .from('organizations')
        .select(
          `
          *,
          organization_categories (category_id),
          organization_areas (area_id),
          organization_tags (tag_id)
        `
        )
        .eq('id', id)
        .single(),
      supabase
        .from('activity_categories')
        .select('id, name')
        .order('sort_order'),
      supabase.from('activity_areas').select('id, name').order('sort_order'),
      supabase.from('tags').select('id, name').order('name'),
    ])

  const { data: organization, error } = orgResult

  if (error || !organization) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/organizations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">団体を編集</h1>
      </div>

      <OrganizationForm
        organization={organization}
        categories={categoriesResult.data || []}
        areas={areasResult.data || []}
        tags={tagsResult.data || []}
      />
    </div>
  )
}
