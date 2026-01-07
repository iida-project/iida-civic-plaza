'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { AdminLayout } from '@/components/admin'
import { ScrollToTop } from '@/components/admin/ScrollToTop'
import { MediaGrid, MediaUploader } from './_components'
import { getMediaFiles, type MediaFile } from './actions'

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadFiles = async () => {
    setIsLoading(true)
    const data = await getMediaFiles()
    setFiles(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadFiles()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ScrollToTop />

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              管理画面へ
            </Link>
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">メディアライブラリ</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={loadFiles}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            更新
          </Button>
        </div>

        {/* アップロードエリア */}
        <MediaUploader onUploaded={loadFiles} />

        {/* 画像一覧 */}
        <div>
          <h2 className="text-lg font-medium mb-4">
            アップロード済み ({files.length}件)
          </h2>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              読み込み中...
            </div>
          ) : (
            <MediaGrid files={files} onRefresh={loadFiles} />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
