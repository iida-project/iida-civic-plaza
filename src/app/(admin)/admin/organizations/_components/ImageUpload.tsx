'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
}

export function ImageUpload({
  value,
  onChange,
  folder = 'images',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック（5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください')
      return
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルを選択してください')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const supabase = createClient()

      // ファイル名を生成
      const ext = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

      // Supabase Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // 公開URLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(fileName)

      onChange(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('アップロードに失敗しました')
    } finally {
      setIsUploading(false)
      // ファイル選択をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full max-w-md">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={value}
              alt="アップロード画像"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {isUploading ? (
            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          ) : (
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <p className="mt-2 text-sm text-gray-500">
            {isUploading ? 'アップロード中...' : 'クリックして画像を選択'}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF（最大5MB）</p>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={isUploading}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 直接URL入力 */}
      <div className="flex gap-2 items-center max-w-md">
        <Input
          type="url"
          placeholder="または画像URLを直接入力"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {!value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
