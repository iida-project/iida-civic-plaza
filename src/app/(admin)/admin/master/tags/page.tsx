import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { MasterList } from '../_components'

export const dynamic = 'force-dynamic'

export default async function TagsPage() {
  const supabase = createAdminClient()

  // タグを取得
  const { data: tags } = await supabase
    .from('tags')
    .select('id, name, slug')
    .order('name', { ascending: true })

  // 各タグの使用件数を取得
  const { data: usageCounts } = await supabase
    .from('organization_tags')
    .select('tag_id')

  // 使用件数をカウント
  const countMap = new Map<string, number>()
  usageCounts?.forEach((item) => {
    const count = countMap.get(item.tag_id) || 0
    countMap.set(item.tag_id, count + 1)
  })

  const items = (tags || []).map((tag) => ({
    ...tag,
    usage_count: countMap.get(tag.id) || 0,
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
        type="tags"
        items={items}
        title="タグ"
        hasSortOrder={false}
      />
    </div>
  )
}
