'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { MultiSelect } from '../../organizations/_components/MultiSelect'
import { ImageUpload } from '../../organizations/_components/ImageUpload'
import { createGrant, updateGrant, type GrantFormState } from '../actions'
import { Loader2 } from 'lucide-react'

type Category = {
  id: string
  name: string
}

type Grant = {
  id: string
  title: string
  slug: string
  provider_name: string
  description: string | null
  application_start_date: string | null
  application_end_date: string
  target_organizations: string[] | null
  subsidy_min_amount: number | null
  subsidy_max_amount: number | null
  apply_url: string | null
  guidelines_file_url: string | null
  contact_url: string | null
  is_published: boolean
  grant_categories?: { category_id: string }[]
}

interface GrantFormProps {
  grant?: Grant
  categories: Category[]
}

// 対象団体種別の選択肢
const TARGET_ORG_OPTIONS = [
  { id: 'npo', name: 'NPO法人' },
  { id: 'general', name: '一般社団法人' },
  { id: 'foundation', name: '公益財団法人' },
  { id: 'volunteer', name: 'ボランティア団体' },
  { id: 'community', name: '自治会・町内会' },
  { id: 'other', name: 'その他' },
]

const initialState: GrantFormState = {}

export function GrantForm({ grant, categories }: GrantFormProps) {
  const isEditing = !!grant

  // フォーム状態
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    grant?.grant_categories?.map((gc) => gc.category_id) || []
  )
  const [selectedTargetOrgs, setSelectedTargetOrgs] = useState<string[]>(
    grant?.target_organizations || []
  )
  const [guidelinesFileUrl, setGuidelinesFileUrl] = useState(
    grant?.guidelines_file_url || ''
  )
  const [isPublished, setIsPublished] = useState(grant?.is_published || false)

  // Server Action
  const boundAction = isEditing
    ? updateGrant.bind(null, grant.id)
    : createGrant

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  // 金額をフォーマット
  const formatAmount = (value: number | null): string => {
    if (value === null) return ''
    return value.toLocaleString()
  }

  const handleSubmit = (formData: FormData) => {
    // hidden フィールドのデータを追加
    formData.set('categories', JSON.stringify(selectedCategories))
    formData.set('target_organizations', JSON.stringify(selectedTargetOrgs))
    formData.set('guidelines_file_url', guidelinesFileUrl)
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
            <Label htmlFor="title">
              助成金名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={grant?.title || ''}
              required
            />
            {state.errors?.title && (
              <p className="text-sm text-red-500">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider_name">
              提供元 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="provider_name"
              name="provider_name"
              defaultValue={grant?.provider_name || ''}
              placeholder="例：飯田市、○○財団"
              required
            />
            {state.errors?.provider_name && (
              <p className="text-sm text-red-500">{state.errors.provider_name[0]}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="slug">スラッグ（URL）</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={grant?.slug || ''}
              placeholder="自動生成されます"
            />
            <p className="text-xs text-gray-500">
              空欄の場合は助成金名から自動生成されます
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={grant?.description || ''}
            placeholder="助成金の概要を入力..."
          />
        </div>
      </div>

      {/* 申請期間 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">申請期間</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="application_start_date">申請開始日</Label>
            <Input
              id="application_start_date"
              name="application_start_date"
              type="date"
              defaultValue={grant?.application_start_date || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_end_date">
              申請締切日 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="application_end_date"
              name="application_end_date"
              type="date"
              defaultValue={grant?.application_end_date || ''}
              required
            />
            {state.errors?.application_end_date && (
              <p className="text-sm text-red-500">
                {state.errors.application_end_date[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 助成金額 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">助成金額</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subsidy_min_amount">下限額（円）</Label>
            <Input
              id="subsidy_min_amount"
              name="subsidy_min_amount"
              type="text"
              inputMode="numeric"
              defaultValue={formatAmount(grant?.subsidy_min_amount ?? null)}
              placeholder="例：100,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subsidy_max_amount">上限額（円）</Label>
            <Input
              id="subsidy_max_amount"
              name="subsidy_max_amount"
              type="text"
              inputMode="numeric"
              defaultValue={formatAmount(grant?.subsidy_max_amount ?? null)}
              placeholder="例：1,000,000"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          カンマ区切りで入力できます（例：1,000,000）
        </p>
      </div>

      {/* 対象分野・対象団体 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">対象</h2>

        <div className="space-y-2">
          <Label>対象分野</Label>
          <MultiSelect
            options={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="分野を選択..."
          />
        </div>

        <div className="space-y-2">
          <Label>対象団体種別</Label>
          <MultiSelect
            options={TARGET_ORG_OPTIONS}
            selected={selectedTargetOrgs}
            onChange={setSelectedTargetOrgs}
            placeholder="対象団体を選択..."
          />
        </div>
      </div>

      {/* リンク・資料 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">リンク・資料</h2>

        <div className="space-y-2">
          <Label htmlFor="apply_url">申請URL</Label>
          <Input
            id="apply_url"
            name="apply_url"
            type="url"
            defaultValue={grant?.apply_url || ''}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_url">問い合わせURL</Label>
          <Input
            id="contact_url"
            name="contact_url"
            type="url"
            defaultValue={grant?.contact_url || ''}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label>募集要項PDF</Label>
          <ImageUpload
            value={guidelinesFileUrl}
            onChange={setGuidelinesFileUrl}
            folder="grants"
          />
          <p className="text-xs text-gray-500">
            PDFファイルまたはURLを設定できます
          </p>
        </div>
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
          <Link href="/admin/grants">キャンセル</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? '更新する' : '作成する'}
        </Button>
      </div>
    </form>
  )
}
