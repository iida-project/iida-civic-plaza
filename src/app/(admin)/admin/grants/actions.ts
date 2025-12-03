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
    let query = supabase.from('grants').select('id').eq('slug', slug)

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

function getFormNumberOrNull(formData: FormData, key: string): number | null {
  const value = (formData.get(key) as string)?.trim()
  if (!value) return null
  const num = parseInt(value.replace(/,/g, ''), 10)
  return isNaN(num) ? null : num
}

// 対象分野の更新
async function updateCategories(
  supabase: SupabaseClient,
  grantId: string,
  categories: string[]
): Promise<void> {
  // 既存を削除
  await supabase.from('grant_categories').delete().eq('grant_id', grantId)

  // 新規追加
  if (categories.length > 0) {
    await supabase.from('grant_categories').insert(
      categories.map((categoryId) => ({
        grant_id: grantId,
        category_id: categoryId,
      }))
    )
  }
}

export type GrantFormState = {
  errors?: {
    title?: string[]
    provider_name?: string[]
    application_end_date?: string[]
    general?: string[]
  }
  message?: string
  success?: boolean
}

export async function createGrant(
  _prevState: GrantFormState,
  formData: FormData
): Promise<GrantFormState> {
  const supabase = createAdminClient()

  const title = getFormString(formData, 'title')
  const providerName = getFormString(formData, 'provider_name')
  const applicationEndDate = getFormString(formData, 'application_end_date')

  // バリデーション
  const errors: GrantFormState['errors'] = {}
  if (!title.trim()) {
    errors.title = ['助成金名は必須です']
  }
  if (!providerName.trim()) {
    errors.provider_name = ['提供元は必須です']
  }
  if (!applicationEndDate) {
    errors.application_end_date = ['申請締切日は必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    const slug = await generateUniqueSlug(supabase, title)
    const isPublished = formData.get('is_published') === 'true'
    const categoriesStr = getFormString(formData, 'categories')
    const categories = categoriesStr ? JSON.parse(categoriesStr) : []
    const targetOrgsStr = getFormString(formData, 'target_organizations')
    const targetOrganizations = targetOrgsStr ? JSON.parse(targetOrgsStr) : []

    const { data: grant, error } = await supabase
      .from('grants')
      .insert({
        title: title.trim(),
        slug,
        provider_name: providerName.trim(),
        description: getFormStringOrNull(formData, 'description'),
        application_start_date: getFormStringOrNull(formData, 'application_start_date'),
        application_end_date: applicationEndDate,
        target_organizations: targetOrganizations,
        subsidy_min_amount: getFormNumberOrNull(formData, 'subsidy_min_amount'),
        subsidy_max_amount: getFormNumberOrNull(formData, 'subsidy_max_amount'),
        apply_url: getFormStringOrNull(formData, 'apply_url'),
        guidelines_file_url: getFormStringOrNull(formData, 'guidelines_file_url'),
        contact_url: getFormStringOrNull(formData, 'contact_url'),
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })
      .select('id')
      .single()

    if (error) throw error

    // 対象分野を登録
    if (grant && categories.length > 0) {
      await updateCategories(supabase, grant.id, categories)
    }

    revalidatePath('/admin/grants')
  } catch (error) {
    console.error('Failed to create grant:', error)
    return {
      errors: { general: ['助成金情報の作成に失敗しました'] },
    }
  }

  redirect('/admin/grants')
}

export async function updateGrant(
  id: string,
  _prevState: GrantFormState,
  formData: FormData
): Promise<GrantFormState> {
  const supabase = createAdminClient()

  const title = getFormString(formData, 'title')
  const providerName = getFormString(formData, 'provider_name')
  const applicationEndDate = getFormString(formData, 'application_end_date')

  // バリデーション
  const errors: GrantFormState['errors'] = {}
  if (!title.trim()) {
    errors.title = ['助成金名は必須です']
  }
  if (!providerName.trim()) {
    errors.provider_name = ['提供元は必須です']
  }
  if (!applicationEndDate) {
    errors.application_end_date = ['申請締切日は必須です']
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
      .from('grants')
      .select('is_published, published_at')
      .eq('id', id)
      .single()

    const isPublished = formData.get('is_published') === 'true'
    const categoriesStr = getFormString(formData, 'categories')
    const categories = categoriesStr ? JSON.parse(categoriesStr) : []
    const targetOrgsStr = getFormString(formData, 'target_organizations')
    const targetOrganizations = targetOrgsStr ? JSON.parse(targetOrgsStr) : []

    // 公開日時の設定
    let publishedAt = current?.published_at
    if (isPublished && !current?.is_published) {
      publishedAt = new Date().toISOString()
    } else if (!isPublished) {
      publishedAt = null
    }

    const { error } = await supabase
      .from('grants')
      .update({
        title: title.trim(),
        slug,
        provider_name: providerName.trim(),
        description: getFormStringOrNull(formData, 'description'),
        application_start_date: getFormStringOrNull(formData, 'application_start_date'),
        application_end_date: applicationEndDate,
        target_organizations: targetOrganizations,
        subsidy_min_amount: getFormNumberOrNull(formData, 'subsidy_min_amount'),
        subsidy_max_amount: getFormNumberOrNull(formData, 'subsidy_max_amount'),
        apply_url: getFormStringOrNull(formData, 'apply_url'),
        guidelines_file_url: getFormStringOrNull(formData, 'guidelines_file_url'),
        contact_url: getFormStringOrNull(formData, 'contact_url'),
        is_published: isPublished,
        published_at: publishedAt,
      })
      .eq('id', id)

    if (error) throw error

    // 対象分野を更新
    await updateCategories(supabase, id, categories)

    revalidatePath('/admin/grants')
    revalidatePath(`/admin/grants/${id}`)
  } catch (error) {
    console.error('Failed to update grant:', error)
    return {
      errors: { general: ['助成金情報の更新に失敗しました'] },
    }
  }

  redirect('/admin/grants')
}

export async function deleteGrant(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 対象分野を削除
    await supabase.from('grant_categories').delete().eq('grant_id', id)

    // 助成金を削除
    const { error } = await supabase.from('grants').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/grants')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete grant:', error)
    return { success: false, error: '助成金情報の削除に失敗しました' }
  }
}

export async function togglePublish(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 現在の状態を取得
    const { data: current, error: fetchError } = await supabase
      .from('grants')
      .select('is_published')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newStatus = !current.is_published

    // 更新
    const { error } = await supabase
      .from('grants')
      .update({
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/grants')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle publish:', error)
    return { success: false, error: '公開状態の変更に失敗しました' }
  }
}
