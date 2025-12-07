'use client'

import { useActionState, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RichTextEditor } from '@/components/admin/editor'
import { ImageUpload } from './ImageUpload'
import { MultiSelect } from './MultiSelect'
import {
  createOrganization,
  updateOrganization,
  type OrganizationFormState,
} from '../actions'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Category = { id: string; name: string }
type Area = { id: string; name: string }
type Tag = { id: string; name: string }

type Organization = {
  id: string
  name: string
  short_name: string | null
  slug: string
  summary: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  website_url: string | null
  facebook_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  participation_info: string | null
  main_image_url: string | null
  is_published: boolean
  organization_categories?: { category_id: string }[]
  organization_areas?: { area_id: string }[]
  organization_tags?: { tag_id: string }[]
}

interface OrganizationFormProps {
  organization?: Organization
  categories: Category[]
  areas: Area[]
  tags: Tag[]
}

const initialState: OrganizationFormState = {}

export function OrganizationForm({
  organization,
  categories,
  areas,
  tags,
}: OrganizationFormProps) {
  const isEditing = !!organization

  // フォーム状態
  const [participationInfo, setParticipationInfo] = useState(
    organization?.participation_info || ''
  )
  const [mainImageUrl, setMainImageUrl] = useState(
    organization?.main_image_url || ''
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    organization?.organization_categories?.map((oc) => oc.category_id) || []
  )
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    organization?.organization_areas?.map((oa) => oa.area_id) || []
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(
    organization?.organization_tags?.map((ot) => ot.tag_id) || []
  )
  const [isPublished, setIsPublished] = useState(
    organization?.is_published || false
  )

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
      const fileName = `organizations/content/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

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
    ? updateOrganization.bind(null, organization.id)
    : createOrganization

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  const handleSubmit = (formData: FormData) => {
    // hidden フィールドのデータを追加
    formData.set('participation_info', participationInfo)
    formData.set('main_image_url', mainImageUrl)
    formData.set('categories', JSON.stringify(selectedCategories))
    formData.set('areas', JSON.stringify(selectedAreas))
    formData.set('tags', JSON.stringify(selectedTags))
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              団体名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={organization?.name || ''}
              required
            />
            {state.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_name">略称</Label>
            <Input
              id="short_name"
              name="short_name"
              defaultValue={organization?.short_name || ''}
            />
          </div>
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="slug">スラッグ（URL）</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={organization?.slug || ''}
              placeholder="自動生成されます"
            />
            <p className="text-xs text-gray-500">
              空欄の場合は団体名から自動生成されます
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="summary">
            概要説明 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="summary"
            name="summary"
            rows={3}
            defaultValue={organization?.summary || ''}
            required
          />
          {state.errors?.summary && (
            <p className="text-sm text-red-500">{state.errors.summary[0]}</p>
          )}
        </div>
      </div>

      {/* カテゴリ・エリア・タグ */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">分類</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>活動分野</Label>
            <MultiSelect
              options={categories}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="活動分野を選択"
            />
          </div>

          <div className="space-y-2">
            <Label>活動エリア</Label>
            <MultiSelect
              options={areas}
              selected={selectedAreas}
              onChange={setSelectedAreas}
              placeholder="活動エリアを選択"
            />
          </div>

          <div className="space-y-2">
            <Label>タグ</Label>
            <MultiSelect
              options={tags}
              selected={selectedTags}
              onChange={setSelectedTags}
              placeholder="タグを選択"
            />
          </div>
        </div>
      </div>

      {/* 連絡先 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">連絡先</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_name">担当者名</Label>
            <Input
              id="contact_name"
              name="contact_name"
              defaultValue={organization?.contact_name || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">メールアドレス</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={organization?.contact_email || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">電話番号</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              defaultValue={organization?.contact_phone || ''}
            />
          </div>
        </div>
      </div>

      {/* SNS・Web */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Web・SNS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website_url">Webサイト</Label>
            <Input
              id="website_url"
              name="website_url"
              type="url"
              placeholder="https://"
              defaultValue={organization?.website_url || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook_url">Facebook</Label>
            <Input
              id="facebook_url"
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/"
              defaultValue={organization?.facebook_url || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_url">X (Twitter)</Label>
            <Input
              id="twitter_url"
              name="twitter_url"
              type="url"
              placeholder="https://x.com/"
              defaultValue={organization?.twitter_url || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/"
              defaultValue={organization?.instagram_url || ''}
            />
          </div>
        </div>
      </div>

      {/* 参加情報 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">参加方法</h2>
        <RichTextEditor
          content={participationInfo}
          onChange={setParticipationInfo}
          placeholder="活動への参加方法を入力..."
          onImageUpload={handleEditorImageUpload}
        />
        <input
          ref={editorImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleEditorImageChange}
        />
      </div>

      {/* メイン画像 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">メイン画像</h2>
        <ImageUpload
          value={mainImageUrl}
          onChange={setMainImageUrl}
          folder="organizations"
        />
      </div>

      {/* 公開設定 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">公開設定</h2>
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
          <Link href="/admin/organizations">キャンセル</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? '更新する' : '作成する'}
        </Button>
      </div>
    </form>
  )
}
