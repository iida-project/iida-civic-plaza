'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, SortAsc } from 'lucide-react'

type Props = {
  showClosedCount: number
  totalCount: number
}

export function FilterSection({ showClosedCount, totalCount }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const showClosed = searchParams.get('showClosed') === 'true'
  const sort = searchParams.get('sort') || 'deadline'

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/grants?${params.toString()}`)
  }

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-md border border-border mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* フィルター */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            表示
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => updateParams('showClosed', e.target.checked ? 'true' : null)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">
              募集終了も表示
              <span className="text-muted-foreground ml-1">({showClosedCount}件)</span>
            </span>
          </label>
        </div>

        {/* ソート */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SortAsc className="h-4 w-4" />
            並び順
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateParams('sort', 'deadline')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                sort === 'deadline'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              締切順
            </button>
            <button
              onClick={() => updateParams('sort', 'newest')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                sort === 'newest'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              新着順
            </button>
          </div>
        </div>
      </div>

      {/* 件数表示 */}
      <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
        {totalCount}件の助成金情報
      </div>
    </div>
  )
}
