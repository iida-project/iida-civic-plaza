'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

type SupabaseClient = ReturnType<typeof createAdminClient>

// スラッグ生成（日本語対応）
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

// 一意のスラッグを生成
async function generateUniqueSlug(
  supabase: SupabaseClient,
  baseName: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(baseName)
  let slug = baseSlug
  let counter = 1

  while (true) {
    let query = supabase
      .from('organizations')
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

// 中間テーブル更新ヘルパー
async function updateRelations(
  supabase: SupabaseClient,
  organizationId: string,
  categories: string[],
  areas: string[],
  tags: string[]
): Promise<void> {
  // 既存のリレーションを削除
  await Promise.all([
    supabase.from('organization_categories').delete().eq('organization_id', organizationId),
    supabase.from('organization_areas').delete().eq('organization_id', organizationId),
    supabase.from('organization_tags').delete().eq('organization_id', organizationId),
  ])

  // 新しいリレーションを追加
  if (categories.length > 0) {
    await supabase.from('organization_categories').insert(
      categories.map((categoryId) => ({
        organization_id: organizationId,
        category_id: categoryId,
      }))
    )
  }

  if (areas.length > 0) {
    await supabase.from('organization_areas').insert(
      areas.map((areaId) => ({
        organization_id: organizationId,
        area_id: areaId,
      }))
    )
  }

  if (tags.length > 0) {
    await supabase.from('organization_tags').insert(
      tags.map((tagId) => ({
        organization_id: organizationId,
        tag_id: tagId,
      }))
    )
  }
}

export type OrganizationFormState = {
  errors?: {
    name?: string[]
    general?: string[]
  }
  message?: string
  success?: boolean
}

export async function createOrganization(
  _prevState: OrganizationFormState,
  formData: FormData
): Promise<OrganizationFormState> {
  const supabase = createAdminClient()

  const name = getFormString(formData, 'name')
  const summary = getFormString(formData, 'summary')

  // バリデーション
  const errors: OrganizationFormState['errors'] = {}
  if (!name.trim()) {
    errors.name = ['団体名は必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    const slug = await generateUniqueSlug(supabase, name)
    const isPublished = formData.get('is_published') === 'true'

    const isRecruiting = formData.get('is_recruiting') === 'true'
    const establishedYearStr = getFormStringOrNull(formData, 'established_year')
    const establishedYear = establishedYearStr ? parseInt(establishedYearStr, 10) : null

    const { data: organization, error } = await supabase
      .from('organizations')
      .insert({
        name: name.trim(),
        short_name: getFormStringOrNull(formData, 'short_name'),
        slug,
        summary: summary.trim(),
        contact_name: getFormStringOrNull(formData, 'contact_name'),
        contact_email: getFormStringOrNull(formData, 'contact_email'),
        contact_phone: getFormStringOrNull(formData, 'contact_phone'),
        website_url: getFormStringOrNull(formData, 'website_url'),
        facebook_url: getFormStringOrNull(formData, 'facebook_url'),
        twitter_url: getFormStringOrNull(formData, 'twitter_url'),
        instagram_url: getFormStringOrNull(formData, 'instagram_url'),
        participation_info: getFormStringOrNull(formData, 'participation_info'),
        main_image_url: getFormStringOrNull(formData, 'main_image_url'),
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
        // 新規カラム
        activity_schedule: getFormStringOrNull(formData, 'activity_schedule'),
        member_count: getFormStringOrNull(formData, 'member_count'),
        membership_fee: getFormStringOrNull(formData, 'membership_fee'),
        activity_location: getFormStringOrNull(formData, 'activity_location'),
        representative: getFormStringOrNull(formData, 'representative'),
        established_year: establishedYear,
        activity_description: getFormStringOrNull(formData, 'activity_description'),
        is_recruiting: isRecruiting,
      })
      .select()
      .single()

    if (error) throw error

    // リレーションを追加
    const categories = JSON.parse(getFormString(formData, 'categories') || '[]')
    const areas = JSON.parse(getFormString(formData, 'areas') || '[]')
    const tags = JSON.parse(getFormString(formData, 'tags') || '[]')

    await updateRelations(supabase, organization.id, categories, areas, tags)

    revalidatePath('/admin/organizations')
  } catch (error) {
    console.error('Failed to create organization:', error)
    return {
      errors: { general: ['団体の作成に失敗しました'] },
    }
  }

  redirect('/admin/organizations')
}

export async function updateOrganization(
  id: string,
  _prevState: OrganizationFormState,
  formData: FormData
): Promise<OrganizationFormState> {
  const supabase = createAdminClient()

  const name = getFormString(formData, 'name')
  const summary = getFormString(formData, 'summary')

  // バリデーション
  const errors: OrganizationFormState['errors'] = {}
  if (!name.trim()) {
    errors.name = ['団体名は必須です']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    // スラッグ処理
    let slug = getFormString(formData, 'slug').trim()
    if (!slug) {
      slug = await generateUniqueSlug(supabase, name, id)
    }

    // 現在の公開状態を取得
    const { data: current } = await supabase
      .from('organizations')
      .select('is_published, published_at')
      .eq('id', id)
      .single()

    const isPublished = formData.get('is_published') === 'true'

    // 公開日時の設定
    let publishedAt = current?.published_at
    if (isPublished && !current?.is_published) {
      publishedAt = new Date().toISOString()
    } else if (!isPublished) {
      publishedAt = null
    }

    const isRecruiting = formData.get('is_recruiting') === 'true'
    const establishedYearStr = getFormStringOrNull(formData, 'established_year')
    const establishedYear = establishedYearStr ? parseInt(establishedYearStr, 10) : null

    const { error } = await supabase
      .from('organizations')
      .update({
        name: name.trim(),
        short_name: getFormStringOrNull(formData, 'short_name'),
        slug,
        summary: summary.trim(),
        contact_name: getFormStringOrNull(formData, 'contact_name'),
        contact_email: getFormStringOrNull(formData, 'contact_email'),
        contact_phone: getFormStringOrNull(formData, 'contact_phone'),
        website_url: getFormStringOrNull(formData, 'website_url'),
        facebook_url: getFormStringOrNull(formData, 'facebook_url'),
        twitter_url: getFormStringOrNull(formData, 'twitter_url'),
        instagram_url: getFormStringOrNull(formData, 'instagram_url'),
        participation_info: getFormStringOrNull(formData, 'participation_info'),
        main_image_url: getFormStringOrNull(formData, 'main_image_url'),
        is_published: isPublished,
        published_at: publishedAt,
        // 新規カラム
        activity_schedule: getFormStringOrNull(formData, 'activity_schedule'),
        member_count: getFormStringOrNull(formData, 'member_count'),
        membership_fee: getFormStringOrNull(formData, 'membership_fee'),
        activity_location: getFormStringOrNull(formData, 'activity_location'),
        representative: getFormStringOrNull(formData, 'representative'),
        established_year: establishedYear,
        activity_description: getFormStringOrNull(formData, 'activity_description'),
        is_recruiting: isRecruiting,
      })
      .eq('id', id)

    if (error) throw error

    // リレーションを更新
    const categories = JSON.parse(getFormString(formData, 'categories') || '[]')
    const areas = JSON.parse(getFormString(formData, 'areas') || '[]')
    const tags = JSON.parse(getFormString(formData, 'tags') || '[]')

    await updateRelations(supabase, id, categories, areas, tags)

    revalidatePath('/admin/organizations')
    revalidatePath(`/admin/organizations/${id}`)
  } catch (error) {
    console.error('Failed to update organization:', error)
    return {
      errors: { general: ['団体の更新に失敗しました'] },
    }
  }

  redirect('/admin/organizations')
}

export async function deleteOrganization(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 中間テーブルを先に削除
    await supabase
      .from('organization_categories')
      .delete()
      .eq('organization_id', id)

    await supabase.from('organization_areas').delete().eq('organization_id', id)

    await supabase.from('organization_tags').delete().eq('organization_id', id)

    // 団体を削除
    const { error } = await supabase.from('organizations').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/organizations')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete organization:', error)
    return { success: false, error: '団体の削除に失敗しました' }
  }
}

export async function togglePublish(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 現在の状態を取得
    const { data: current, error: fetchError } = await supabase
      .from('organizations')
      .select('is_published')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newStatus = !current.is_published

    // 更新
    const { error } = await supabase
      .from('organizations')
      .update({
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/organizations')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle publish:', error)
    return { success: false, error: '公開状態の変更に失敗しました' }
  }
}

const MAX_FEATURED_ORGANIZATIONS = 3

export async function toggleFeatured(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // 現在の状態を取得
    const { data: current, error: fetchError } = await supabase
      .from('organizations')
      .select('is_featured')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newStatus = !current.is_featured

    // ピックアップに追加する場合、上限チェック
    if (newStatus) {
      const { count } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true)

      if (count !== null && count >= MAX_FEATURED_ORGANIZATIONS) {
        return {
          success: false,
          error: `ピックアップは最大${MAX_FEATURED_ORGANIZATIONS}件までです`
        }
      }
    }

    // 更新
    const { error } = await supabase
      .from('organizations')
      .update({ is_featured: newStatus })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/organizations')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle featured:', error)
    return { success: false, error: 'ピックアップ状態の変更に失敗しました' }
  }
}

export async function getFeaturedCount(): Promise<number> {
  const supabase = createAdminClient()
  const { count } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .eq('is_featured', true)
  return count ?? 0
}
