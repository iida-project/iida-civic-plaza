'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createFaq, updateFaq, type FaqFormState } from '../actions'
import { Loader2 } from 'lucide-react'

type Faq = {
  id: string
  question: string
  answer: string
  sort_order: number
  is_published: boolean
}

interface FaqFormProps {
  faq?: Faq
}

const initialState: FaqFormState = {}

export function FaqForm({ faq }: FaqFormProps) {
  const isEditing = !!faq

  // フォーム状態
  const [isPublished, setIsPublished] = useState(faq?.is_published ?? true)

  // Server Action
  const boundAction = isEditing ? updateFaq.bind(null, faq.id) : createFaq

  const [state, formAction, isPending] = useActionState(boundAction, initialState)

  const handleSubmit = (formData: FormData) => {
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

      {/* 質問と回答 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">FAQ内容</h2>

        <div className="space-y-2">
          <Label htmlFor="question">
            質問 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="question"
            name="question"
            defaultValue={faq?.question || ''}
            placeholder="例：団体登録はどうすればいいですか？"
            required
          />
          {state.errors?.question && (
            <p className="text-sm text-red-500">{state.errors.question[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">
            回答 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="answer"
            name="answer"
            rows={6}
            defaultValue={faq?.answer || ''}
            placeholder="回答を入力..."
            required
          />
          {state.errors?.answer && (
            <p className="text-sm text-red-500">{state.errors.answer[0]}</p>
          )}
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="sort_order">表示順</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={faq?.sort_order || 0}
              className="w-24"
            />
            <p className="text-xs text-gray-500">
              数値が小さいほど上に表示されます
            </p>
          </div>
        )}
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
            {isPublished ? '公開する' : '非公開'}
          </Label>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/faqs">キャンセル</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? '更新する' : '作成する'}
        </Button>
      </div>
    </form>
  )
}
