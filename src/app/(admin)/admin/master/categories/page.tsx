import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { MasterList } from '../_components'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = createAdminClient()

  // 活動分野を取得
  const { data: categories } = await supabase
    .from('activity_categories')
    .select('id, name, slug, sort_order')
    .order('sort_order', { ascending: true })

  // 各分野の使用件数を取得
  const { data: usageCounts } = await supabase
    .from('organization_categories')
    .select('category_id')

  // 使用件数をカウント
  const countMap = new Map<string, number>()
  usageCounts?.forEach((item) => {
    const count = countMap.get(item.category_id) || 0
    countMap.set(item.category_id, count + 1)
  })

  const items = (categories || []).map((cat) => ({
    ...cat,
    usage_count: countMap.get(cat.id) || 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/master">
            <ArrowLeft className="mr-2 h-4 w-4" />
            マスター管理へ
          </Link>
        </Button>
      </div>

      <MasterList
        type="categories"
        items={items}
        title="活動分野"
        hasSortOrder={true}
      />
    </div>
  )
}
