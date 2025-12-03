import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { GrantList } from './_components'

export const dynamic = 'force-dynamic'

export default async function GrantsPage() {
  const supabase = createAdminClient()

  const { data: grants, error } = await supabase
    .from('grants')
    .select(
      `
      id,
      title,
      slug,
      provider_name,
      application_end_date,
      is_published,
      updated_at
    `
    )
    .order('application_end_date', { ascending: true })

  if (error) {
    console.error('Failed to fetch grants:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            管理画面へ
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">助成金管理</h1>
        <Button asChild>
          <Link href="/admin/grants/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <GrantList grants={grants || []} />
    </div>
  )
}
