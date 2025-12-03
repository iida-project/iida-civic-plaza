'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RichTextEditor } from '@/components/admin/editor'
import { createNews, updateNews, type NewsFormState } from '../actions'
import { Loader2 } from 'lucide-react'

type News = {
  id: string
  title: string
  slug: string
  body: string | null
  is_published: boolean
}

interface NewsFormProps {
  news?: News
}

const initialState: NewsFormState = {}

export function NewsForm({ news }: NewsFormProps) {
  const isEditing = !!news

  // フォーム状態
  const [body, setBody] = useState(news?.body || '')
  const [isPublished, setIsPublished] = useState(news?.is_published || false)

  // Server Action
  const boundAction = isEditing ? updateNews.bind(null, news.id) : createNews

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  const handleSubmit = (formData: FormData) => {
    formData.set('body', body)
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
            defaultValue={news?.title || ''}
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
              defaultValue={news?.slug || ''}
              placeholder="自動生成されます"
            />
            <p className="text-xs text-gray-500">
              空欄の場合はタイトルから自動生成されます
            </p>
          </div>
        )}
      </div>

      {/* 本文 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">本文</h2>
        <RichTextEditor
          content={body}
          onChange={setBody}
          placeholder="お知らせの内容を入力..."
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
          <Link href="/admin/news">キャンセル</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? '更新する' : '作成する'}
        </Button>
      </div>
    </form>
  )
}
