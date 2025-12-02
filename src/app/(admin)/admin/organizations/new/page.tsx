import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { OrganizationForm } from '../_components'

export default async function NewOrganizationPage() {
  const supabase = createAdminClient()

  // マスターデータを取得
  const [categoriesResult, areasResult, tagsResult] = await Promise.all([
    supabase
      .from('activity_categories')
      .select('id, name')
      .order('name'),
    supabase.from('activity_areas').select('id, name').order('name'),
    supabase.from('tags').select('id, name').order('name'),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/organizations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">団体を新規作成</h1>
      </div>

      <OrganizationForm
        categories={categoriesResult.data || []}
        areas={areasResult.data || []}
        tags={tagsResult.data || []}
      />
    </div>
  )
}
