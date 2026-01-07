'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Upload, Loader2, GripVertical, FolderOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MediaPickerDialog } from '@/components/admin'

interface GalleryUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  folder?: string
}

export function GalleryUpload({
  value,
  onChange,
  folder = 'interviews',
}: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setIsUploading(true)
      const supabase = createClient()
      const uploadedUrls: string[] = []

      try {
        for (const file of Array.from(files)) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error } = await supabase.storage
            .from('media')
            .upload(fileName, file)

          if (error) throw error

          const {
            data: { publicUrl },
          } = supabase.storage.from('media').getPublicUrl(fileName)

          uploadedUrls.push(publicUrl)
        }

        onChange([...value, ...uploadedUrls])
      } catch (error) {
        console.error('Upload error:', error)
        alert('画像のアップロードに失敗しました')
      } finally {
        setIsUploading(false)
        // Reset input
        e.target.value = ''
      }
    },
    [folder, value, onChange]
  )

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newValue = [...value]
    const draggedItem = newValue[draggedIndex]
    newValue.splice(draggedIndex, 1)
    newValue.splice(index, 0, draggedItem)
    onChange(newValue)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* ギャラリー表示 */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-move ${
                draggedIndex === index ? 'border-orange-500 opacity-50' : 'border-gray-200'
              }`}
            >
              <Image
                src={url}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* アップロードボタン */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('gallery-upload')?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              アップロード中...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              新規アップロード
            </>
          )}
        </Button>
        <MediaPickerDialog
          onSelect={(url) => {
            if (!value.includes(url)) {
              onChange([...value, url])
            }
          }}
          trigger={
            <Button type="button" variant="outline" disabled={isUploading}>
              <FolderOpen className="mr-2 h-4 w-4" />
              ライブラリから選択
            </Button>
          }
        />
        <Input
          id="gallery-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      <p className="text-sm text-gray-500">
        複数選択可。ドラッグで順序を変更できます。
      </p>
    </div>
  )
}
