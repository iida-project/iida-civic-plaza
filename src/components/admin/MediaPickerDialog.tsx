'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ImageIcon, Upload, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getMediaFiles, uploadMedia, type MediaFile } from '@/app/(admin)/admin/media/actions'

interface MediaPickerDialogProps {
  onSelect: (url: string) => void
  trigger?: React.ReactNode
}

export function MediaPickerDialog({ onSelect, trigger }: MediaPickerDialogProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

  const loadFiles = async () => {
    setIsLoading(true)
    const data = await getMediaFiles()
    setFiles(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (open) {
      loadFiles()
      setSelectedUrl(null)
    }
  }, [open])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadMedia(formData)
    setIsUploading(false)

    if (result.success && result.url) {
      await loadFiles()
      setSelectedUrl(result.url)
    }

    e.target.value = ''
  }

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            ライブラリから選択
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>メディアライブラリ</DialogTitle>
        </DialogHeader>

        {/* アップロードボタン */}
        <div className="flex items-center gap-4 py-2 border-b">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button type="button" variant="outline" size="sm" asChild disabled={isUploading}>
              <span>
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                新規アップロード
              </span>
            </Button>
          </label>
          {selectedUrl && (
            <Button type="button" onClick={handleSelect}>
              <Check className="h-4 w-4 mr-2" />
              選択した画像を使用
            </Button>
          )}
        </div>

        {/* 画像グリッド */}
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <ImageIcon className="h-12 w-12 mb-2" />
              <p>画像がありません</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {files.map((file) => (
                <button
                  key={file.url}
                  type="button"
                  onClick={() => setSelectedUrl(file.url)}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${selectedUrl === file.url
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-transparent hover:border-gray-300'
                    }
                  `}
                >
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  {selectedUrl === file.url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
