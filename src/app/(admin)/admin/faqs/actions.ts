'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

// フォームデータからの値取得ヘルパー
function getFormString(formData: FormData, key: string): string {
  return (formData.get(key) as string) || ''
}

export type FaqFormState = {
  errors?: {
    question?: string[]
    answer?: string[]
    general?: string[]
  }
  message?: string
  success?: boolean
}

export async function createFaq(
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  const supabase = createAdminClient()

  const question = getFormString(formData, 'question')
  const answer = getFormString(formData, 'answer')

  // バリデーション
  const errors: FaqFormState['errors'] = {}
  if (!question.trim()) {
    errors.question = ['質問は必須です']
  }
  if (!answer.trim()) {
    errors.answer = ['回答は必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    // 現在の最大sort_orderを取得
    const { data: maxOrder } = await supabase
      .from('faqs')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const sortOrder = (maxOrder?.sort_order ?? -1) + 1
    const isPublished = formData.get('is_published') === 'true'

    const { error } = await supabase.from('faqs').insert({
      question: question.trim(),
      answer: answer.trim(),
      sort_order: sortOrder,
      is_published: isPublished,
    })

    if (error) throw error

    revalidatePath('/admin/faqs')
  } catch (error) {
    console.error('Failed to create FAQ:', error)
    return {
      errors: { general: ['FAQの作成に失敗しました'] },
    }
  }

  redirect('/admin/faqs')
}

export async function updateFaq(
  id: string,
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  const supabase = createAdminClient()

  const question = getFormString(formData, 'question')
  const answer = getFormString(formData, 'answer')

  // バリデーション
  const errors: FaqFormState['errors'] = {}
  if (!question.trim()) {
    errors.question = ['質問は必須です']
  }
  if (!answer.trim()) {
    errors.answer = ['回答は必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    const sortOrderStr = getFormString(formData, 'sort_order')
    const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0
    const isPublished = formData.get('is_published') === 'true'

    const { error } = await supabase
      .from('faqs')
      .update({
        question: question.trim(),
        answer: answer.trim(),
        sort_order: sortOrder,
        is_published: isPublished,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/faqs')
    revalidatePath(`/admin/faqs/${id}`)
  } catch (error) {
    console.error('Failed to update FAQ:', error)
    return {
      errors: { general: ['FAQの更新に失敗しました'] },
    }
  }

  redirect('/admin/faqs')
}

export async function deleteFaq(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.from('faqs').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/faqs')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete FAQ:', error)
    return { success: false, error: 'FAQの削除に失敗しました' }
  }
}

export async function togglePublish(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    const { data: current, error: fetchError } = await supabase
      .from('faqs')
      .select('is_published')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newStatus = !current.is_published

    const { error } = await supabase
      .from('faqs')
      .update({ is_published: newStatus })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/faqs')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle publish:', error)
    return { success: false, error: '公開状態の変更に失敗しました' }
  }
}

export async function updateSortOrder(
  id: string,
  direction: 'up' | 'down'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 現在のFAQを取得
    const { data: current, error: fetchError } = await supabase
      .from('faqs')
      .select('id, sort_order')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // 入れ替え対象を取得
    const { data: target, error: targetError } = await supabase
      .from('faqs')
      .select('id, sort_order')
      .order('sort_order', { ascending: direction === 'up' ? false : true })
      .filter(
        'sort_order',
        direction === 'up' ? 'lt' : 'gt',
        current.sort_order
      )
      .limit(1)
      .single()

    if (targetError || !target) {
      return { success: true } // 移動先がない場合は何もしない
    }

    // sort_orderを入れ替え
    await supabase
      .from('faqs')
      .update({ sort_order: target.sort_order })
      .eq('id', current.id)

    await supabase
      .from('faqs')
      .update({ sort_order: current.sort_order })
      .eq('id', target.id)

    revalidatePath('/admin/faqs')
    return { success: true }
  } catch (error) {
    console.error('Failed to update sort order:', error)
    return { success: false, error: '並び順の変更に失敗しました' }
  }
}
