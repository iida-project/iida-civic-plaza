'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Trash2, Copy, Check, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { checkMediaUsage, deleteMedia, type MediaFile, type MediaUsage } from '../actions'

interface MediaCardProps {
  file: MediaFile
  onDeleted: () => void
}

export function MediaCard({ file, onDeleted }: MediaCardProps) {
  const [copied, setCopied] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [usages, setUsages] = useState<MediaUsage[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(file.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeleteClick = async () => {
    setIsChecking(true)
    const usageData = await checkMediaUsage(file.url)
    setUsages(usageData)
    setIsChecking(false)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const hasUsages = usages.length > 0
    const result = await deleteMedia(file.url, hasUsages)
    setIsDeleting(false)

    if (result.success) {
      setShowDeleteDialog(false)
      onDeleted()
    } else {
      alert(`削除に失敗しました: ${result.error}`)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '不明'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '不明'
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        {/* 画像 */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        {/* 情報 */}
        <div className="p-3">
          <p className="text-sm font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(file.size)} · {formatDate(file.createdAt)}
          </p>
        </div>

        {/* アクションボタン（ホバー時表示） */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleCopyUrl}
            title="URLをコピー"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-red-50"
            onClick={handleDeleteClick}
            disabled={isChecking}
            title="削除"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {usages.length > 0 && (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              画像を削除しますか？
            </DialogTitle>
            <DialogDescription>
              {usages.length > 0 ? (
                <span className="text-amber-600">
                  この画像は以下の記事で使用されています。削除すると、これらの記事から画像が削除されます。
                </span>
              ) : (
                'この操作は取り消せません。'
              )}
            </DialogDescription>
          </DialogHeader>

          {usages.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-3">
              {usages.map((usage, idx) => (
                <div key={idx} className="bg-amber-50 p-3 rounded-md">
                  <p className="font-medium text-sm text-amber-800">
                    {usage.tableName}
                  </p>
                  <ul className="mt-1 text-sm text-amber-700">
                    {usage.items.map((item) => (
                      <li key={item.id}>・{item.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '削除中...' : usages.length > 0 ? '参照を解除して削除' : '削除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
