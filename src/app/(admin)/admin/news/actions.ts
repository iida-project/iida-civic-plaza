'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

type SupabaseClient = ReturnType<typeof createAdminClient>

// スラッグ生成（日本語対応）
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

// 一意のスラッグを生成
async function generateUniqueSlug(
  supabase: SupabaseClient,
  baseTitle: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(baseTitle)
  let slug = baseSlug
  let counter = 1

  while (true) {
    let query = supabase.from('news_posts').select('id').eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.single()

    if (!data) break

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// フォームデータからの値取得ヘルパー
function getFormString(formData: FormData, key: string): string {
  return (formData.get(key) as string) || ''
}

function getFormStringOrNull(formData: FormData, key: string): string | null {
  const value = (formData.get(key) as string)?.trim()
  return value || null
}

export type NewsFormState = {
  errors?: {
    title?: string[]
    general?: string[]
  }
  message?: string
  success?: boolean
}

export async function createNews(
  _prevState: NewsFormState,
  formData: FormData
): Promise<NewsFormState> {
  const supabase = createAdminClient()

  const title = getFormString(formData, 'title')

  // バリデーション
  const errors: NewsFormState['errors'] = {}
  if (!title.trim()) {
    errors.title = ['タイトルは必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    const slug = await generateUniqueSlug(supabase, title)
    const isPublished = formData.get('is_published') === 'true'
    const body = getFormStringOrNull(formData, 'body')

    const { error } = await supabase.from('news_posts').insert({
      title: title.trim(),
      slug,
      body,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })

    if (error) throw error

    revalidatePath('/admin/news')
  } catch (error) {
    console.error('Failed to create news:', error)
    return {
      errors: { general: ['お知らせの作成に失敗しました'] },
    }
  }

  redirect('/admin/news')
}

export async function updateNews(
  id: string,
  _prevState: NewsFormState,
  formData: FormData
): Promise<NewsFormState> {
  const supabase = createAdminClient()

  const title = getFormString(formData, 'title')

  // バリデーション
  const errors: NewsFormState['errors'] = {}
  if (!title.trim()) {
    errors.title = ['タイトルは必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    // スラッグ処理
    let slug = getFormString(formData, 'slug').trim()
    if (!slug) {
      slug = await generateUniqueSlug(supabase, title, id)
    }

    // 現在の公開状態を取得
    const { data: current } = await supabase
      .from('news_posts')
      .select('is_published, published_at')
      .eq('id', id)
      .single()

    const isPublished = formData.get('is_published') === 'true'
    const body = getFormStringOrNull(formData, 'body')

    // 公開日時の設定
    let publishedAt = current?.published_at
    if (isPublished && !current?.is_published) {
      publishedAt = new Date().toISOString()
    } else if (!isPublished) {
      publishedAt = null
    }

    const { error } = await supabase
      .from('news_posts')
      .update({
        title: title.trim(),
        slug,
        body,
        is_published: isPublished,
        published_at: publishedAt,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/news')
    revalidatePath(`/admin/news/${id}`)
  } catch (error) {
    console.error('Failed to update news:', error)
    return {
      errors: { general: ['お知らせの更新に失敗しました'] },
    }
  }

  redirect('/admin/news')
}

export async function deleteNews(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.from('news_posts').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/news')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete news:', error)
    return { success: false, error: 'お知らせの削除に失敗しました' }
  }
}

export async function togglePublish(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 現在の状態を取得
    const { data: current, error: fetchError } = await supabase
      .from('news_posts')
      .select('is_published')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newStatus = !current.is_published

    // 更新
    const { error } = await supabase
      .from('news_posts')
      .update({
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/news')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle publish:', error)
    return { success: false, error: '公開状態の変更に失敗しました' }
  }
}
