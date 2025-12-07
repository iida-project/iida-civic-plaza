'use client'

import { useActionState, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RichTextEditor } from '@/components/admin/editor'
import { ImageUpload } from '../../organizations/_components/ImageUpload'
import { OrganizationSelect } from './OrganizationSelect'
import { GalleryUpload } from './GalleryUpload'
import {
  createInterview,
  updateInterview,
  type InterviewFormState,
} from '../actions'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Organization = {
  id: string
  name: string
}

type Interview = {
  id: string
  title: string
  slug: string
  lead_text: string
  body: string
  main_image_url: string | null
  gallery_images: string[] | null
  organization_id: string | null
  is_featured: boolean
  is_published: boolean
}

interface InterviewFormProps {
  interview?: Interview
  organizations: Organization[]
}

const initialState: InterviewFormState = {}

export function InterviewForm({ interview, organizations }: InterviewFormProps) {
  const isEditing = !!interview

  // フォーム状態
  const [body, setBody] = useState(interview?.body || '')
  const [mainImageUrl, setMainImageUrl] = useState(interview?.main_image_url || '')
  const [galleryImages, setGalleryImages] = useState<string[]>(
    interview?.gallery_images || []
  )
  const [organizationId, setOrganizationId] = useState<string | null>(
    interview?.organization_id || null
  )
  const [isFeatured, setIsFeatured] = useState(interview?.is_featured || false)
  const [isPublished, setIsPublished] = useState(interview?.is_published || false)

  const editorImageInputRef = useRef<HTMLInputElement>(null)
  const [imageUploadResolve, setImageUploadResolve] = useState<((url: string | null) => void) | null>(null)

  // リッチテキスト内の画像アップロード
  const handleEditorImageUpload = (): Promise<string | null> => {
    return new Promise((resolve) => {
      setImageUploadResolve(() => resolve)
      editorImageInputRef.current?.click()
    })
  }

  const handleEditorImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      imageUploadResolve?.(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください')
      imageUploadResolve?.(null)
      return
    }

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `interviews/content/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)
      imageUploadResolve?.(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      alert('アップロードに失敗しました')
      imageUploadResolve?.(null)
    } finally {
      if (editorImageInputRef.current) {
        editorImageInputRef.current.value = ''
      }
    }
  }

  // Server Action
  const boundAction = isEditing
    ? updateInterview.bind(null, interview.id)
    : createInterview

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  const handleSubmit = (formData: FormData) => {
    // hidden フィールドのデータを追加
    formData.set('body', body)
    formData.set('main_image_url', mainImageUrl)
    formData.set('gallery_images', JSON.stringify(galleryImages))
    formData.set('organization_id', organizationId || '')
    formData.set('is_featured', isFeatured.toString())
    formData.set('is_published', isPublished.toString())

    formAction(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* エラー表示 */}
      {state.errors?.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {state.errors.general.join(', ')}
        </div>
      )}

      {/* 基本情報 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">基本情報</h2>

        <div className="space-y-2">
          <Label htmlFor="title">
            タイトル <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={interview?.title || ''}
            required
          />
          {state.errors?.title && (
            <p className="text-sm text-red-500">{state.errors.title[0]}</p>
          )}
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="slug">スラッグ（URL）</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={interview?.slug || ''}
              placeholder="自動生成されます"
            />
            <p className="text-xs text-gray-500">
              空欄の場合はタイトルから自動生成されます
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="lead_text">
            リード文 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="lead_text"
            name="lead_text"
            rows={3}
            defaultValue={interview?.lead_text || ''}
            placeholder="記事の導入文を入力..."
            required
          />
          {state.errors?.lead_text && (
            <p className="text-sm text-red-500">{state.errors.lead_text[0]}</p>
          )}
        </div>
      </div>

      {/* 関連団体 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">関連団体</h2>
        <OrganizationSelect
          organizations={organizations}
          value={organizationId}
          onChange={setOrganizationId}
        />
        <p className="text-xs text-gray-500">
          このインタビューに関連する団体を選択できます（任意）
        </p>
      </div>

      {/* 本文 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          本文 <span className="text-red-500">*</span>
        </h2>
        <RichTextEditor
          content={body}
          onChange={setBody}
          placeholder="インタビュー本文を入力..."
          onImageUpload={handleEditorImageUpload}
        />
        <input
          ref={editorImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleEditorImageChange}
        />
        {state.errors?.body && (
          <p className="text-sm text-red-500">{state.errors.body[0]}</p>
        )}
      </div>

      {/* メイン画像 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">メイン画像</h2>
        <ImageUpload
          value={mainImageUrl}
          onChange={setMainImageUrl}
          folder="interviews"
        />
      </div>

      {/* ギャラリー画像 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">ギャラリー画像</h2>
        <GalleryUpload
          value={galleryImages}
          onChange={setGalleryImages}
          folder="interviews/gallery"
        />
      </div>

      {/* 公開設定 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">公開設定</h2>

        <div className="flex items-center space-x-3">
          <Switch
            id="is_featured"
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
          />
          <Label htmlFor="is_featured" className="cursor-pointer">
            ピックアップに表示する
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            id="is_published"
            checked={isPublished}
            onCheckedChange={setIsPublished}
          />
          <Label htmlFor="is_published" className="cursor-pointer">
            {isPublished ? '公開する' : '下書きとして保存'}
          </Label>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/interviews">キャンセル</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? '更新する' : '作成する'}
        </Button>
      </div>
    </form>
  )
}
