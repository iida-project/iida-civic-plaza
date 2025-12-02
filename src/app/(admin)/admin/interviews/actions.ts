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
    let query = supabase
      .from('interviews')
      .select('id')
      .eq('slug', slug)

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

export type InterviewFormState = {
  errors?: {
    title?: string[]
    lead_text?: string[]
    body?: string[]
    general?: string[]
  }
  message?: string
  success?: boolean
}

export async function createInterview(
  _prevState: InterviewFormState,
  formData: FormData
): Promise<InterviewFormState> {
  const supabase = createAdminClient()

  const title = getFormString(formData, 'title')
  const leadText = getFormString(formData, 'lead_text')
  const body = getFormString(formData, 'body')

  // バリデーション
  const errors: InterviewFormState['errors'] = {}
  if (!title.trim()) {
    errors.title = ['タイトルは必須です']
  }
  if (!leadText.trim()) {
    errors.lead_text = ['リード文は必須です']
  }
  if (!body.trim()) {
    errors.body = ['本文は必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    const slug = await generateUniqueSlug(supabase, title)
    const isPublished = formData.get('is_published') === 'true'
    const isFeatured = formData.get('is_featured') === 'true'
    const organizationId = getFormStringOrNull(formData, 'organization_id')
    const galleryImagesStr = getFormString(formData, 'gallery_images')
    const galleryImages = galleryImagesStr ? JSON.parse(galleryImagesStr) : []

    const { error } = await supabase
      .from('interviews')
      .insert({
        title: title.trim(),
        slug,
        lead_text: leadText.trim(),
        body: body.trim(),
        main_image_url: getFormStringOrNull(formData, 'main_image_url'),
        gallery_images: galleryImages,
        organization_id: organizationId,
        is_featured: isFeatured,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })

    if (error) throw error

    revalidatePath('/admin/interviews')
  } catch (error) {
    console.error('Failed to create interview:', error)
    return {
      errors: { general: ['インタビューの作成に失敗しました'] },
    }
  }

  redirect('/admin/interviews')
}

export async function updateInterview(
  id: string,
  _prevState: InterviewFormState,
  formData: FormData
): Promise<InterviewFormState> {
  const supabase = createAdminClient()

  const title = getFormString(formData, 'title')
  const leadText = getFormString(formData, 'lead_text')
  const body = getFormString(formData, 'body')

  // バリデーション
  const errors: InterviewFormState['errors'] = {}
  if (!title.trim()) {
    errors.title = ['タイトルは必須です']
  }
  if (!leadText.trim()) {
    errors.lead_text = ['リード文は必須です']
  }
  if (!body.trim()) {
    errors.body = ['本文は必須です']
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
      .from('interviews')
      .select('is_published, published_at')
      .eq('id', id)
      .single()

    const isPublished = formData.get('is_published') === 'true'
    const isFeatured = formData.get('is_featured') === 'true'
    const organizationId = getFormStringOrNull(formData, 'organization_id')
    const galleryImagesStr = getFormString(formData, 'gallery_images')
    const galleryImages = galleryImagesStr ? JSON.parse(galleryImagesStr) : []

    // 公開日時の設定
    let publishedAt = current?.published_at
    if (isPublished && !current?.is_published) {
      publishedAt = new Date().toISOString()
    } else if (!isPublished) {
      publishedAt = null
    }

    const { error } = await supabase
      .from('interviews')
      .update({
        title: title.trim(),
        slug,
        lead_text: leadText.trim(),
        body: body.trim(),
        main_image_url: getFormStringOrNull(formData, 'main_image_url'),
        gallery_images: galleryImages,
        organization_id: organizationId,
        is_featured: isFeatured,
        is_published: isPublished,
        published_at: publishedAt,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/interviews')
    revalidatePath(`/admin/interviews/${id}`)
  } catch (error) {
    console.error('Failed to update interview:', error)
    return {
      errors: { general: ['インタビューの更新に失敗しました'] },
    }
  }

  redirect('/admin/interviews')
}

export async function deleteInterview(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    const { error } = await supabase.from('interviews').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/interviews')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete interview:', error)
    return { success: false, error: 'インタビューの削除に失敗しました' }
  }
}

export async function togglePublish(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 現在の状態を取得
    const { data: current, error: fetchError } = await supabase
      .from('interviews')
      .select('is_published')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newStatus = !current.is_published

    // 更新
    const { error } = await supabase
      .from('interviews')
      .update({
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/interviews')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle publish:', error)
    return { success: false, error: '公開状態の変更に失敗しました' }
  }
}

export async function toggleFeatured(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 現在の状態を取得
    const { data: current, error: fetchError } = await supabase
      .from('interviews')
      .select('is_featured')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newStatus = !current.is_featured

    // 更新
    const { error } = await supabase
      .from('interviews')
      .update({
        is_featured: newStatus,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/interviews')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle featured:', error)
    return { success: false, error: 'ピックアップ状態の変更に失敗しました' }
  }
}
