import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { GrantForm } from '../_components'

export default async function NewGrantPage() {
  const supabase = createAdminClient()

  // 活動分野を取得
  const { data: categories } = await supabase
    .from('activity_categories')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/grants">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">助成金を新規作成</h1>
      </div>

      <GrantForm categories={categories || []} />
    </div>
  )
}
