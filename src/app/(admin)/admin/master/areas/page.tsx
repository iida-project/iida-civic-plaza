import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { MasterList } from '../_components'

export const dynamic = 'force-dynamic'

export default async function AreasPage() {
  const supabase = createAdminClient()

  // 活動エリアを取得
  const { data: areas } = await supabase
    .from('activity_areas')
    .select('id, name, slug, sort_order')
    .order('sort_order', { ascending: true })

  // 各エリアの使用件数を取得
  const { data: usageCounts } = await supabase
    .from('organization_areas')
    .select('area_id')

  // 使用件数をカウント
  const countMap = new Map<string, number>()
  usageCounts?.forEach((item) => {
    const count = countMap.get(item.area_id) || 0
    countMap.set(item.area_id, count + 1)
  })

  const items = (areas || []).map((area) => ({
    ...area,
    usage_count: countMap.get(area.id) || 0,
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
        type="areas"
        items={items}
        title="活動エリア"
        hasSortOrder={true}
      />
    </div>
  )
}
