'use client'

import { MediaCard } from './MediaCard'
import type { MediaFile } from '../actions'

interface MediaGridProps {
  files: MediaFile[]
  onRefresh: () => void
}

export function MediaGrid({ files, onRefresh }: MediaGridProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>アップロードされた画像はありません</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => (
        <MediaCard key={file.url} file={file} onDeleted={onRefresh} />
      ))}
    </div>
  )
}
