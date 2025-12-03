'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

// スラッグ生成
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

export type MasterType = 'categories' | 'areas' | 'tags'

type TableMap = {
  categories: 'activity_categories'
  areas: 'activity_areas'
  tags: 'tags'
}

type RelationTableMap = {
  categories: 'organization_categories'
  areas: 'organization_areas'
  tags: 'organization_tags'
}

type ForeignKeyMap = {
  categories: 'category_id'
  areas: 'area_id'
  tags: 'tag_id'
}

const TABLE_MAP: TableMap = {
  categories: 'activity_categories',
  areas: 'activity_areas',
  tags: 'tags',
}

const RELATION_TABLE_MAP: RelationTableMap = {
  categories: 'organization_categories',
  areas: 'organization_areas',
  tags: 'organization_tags',
}

const FOREIGN_KEY_MAP: ForeignKeyMap = {
  categories: 'category_id',
  areas: 'area_id',
  tags: 'tag_id',
}

export type MasterFormState = {
  errors?: {
    name?: string[]
    general?: string[]
  }
  success?: boolean
}

// 使用件数を取得
export async function getUsageCount(
  type: MasterType,
  id: string
): Promise<number> {
  const supabase = createAdminClient()
  const relationTable = RELATION_TABLE_MAP[type]
  const foreignKey = FOREIGN_KEY_MAP[type]

  const { count } = await supabase
    .from(relationTable)
    .select('*', { count: 'exact', head: true })
    .eq(foreignKey, id)

  return count ?? 0
}

// 作成
export async function createMaster(
  type: MasterType,
  _prevState: MasterFormState,
  formData: FormData
): Promise<MasterFormState> {
  const supabase = createAdminClient()
  const table = TABLE_MAP[type]
  const name = (formData.get('name') as string)?.trim()

  if (!name) {
    return { errors: { name: ['名前は必須です'] } }
  }

  try {
    const slug = generateSlug(name)

    // 最大sort_orderを取得（tagsにはsort_orderがない）
    let sortOrder = 0
    if (type !== 'tags') {
      const { data: maxOrder } = await supabase
        .from(table)
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()
      sortOrder = (maxOrder?.sort_order ?? -1) + 1
    }

    const insertData: Record<string, unknown> = { name, slug }
    if (type !== 'tags') {
      insertData.sort_order = sortOrder
    }

    const { error } = await supabase.from(table).insert(insertData)

    if (error) throw error

    revalidatePath(`/admin/master/${type}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to create master:', error)
    return { errors: { general: ['作成に失敗しました'] } }
  }
}

// 更新
export async function updateMaster(
  type: MasterType,
  id: string,
  _prevState: MasterFormState,
  formData: FormData
): Promise<MasterFormState> {
  const supabase = createAdminClient()
  const table = TABLE_MAP[type]
  const name = (formData.get('name') as string)?.trim()
  const slugInput = (formData.get('slug') as string)?.trim()

  if (!name) {
    return { errors: { name: ['名前は必須です'] } }
  }

  try {
    const slug = slugInput || generateSlug(name)

    const updateData: Record<string, unknown> = { name, slug }

    // sort_orderがある場合は更新
    const sortOrderStr = formData.get('sort_order') as string
    if (sortOrderStr && type !== 'tags') {
      updateData.sort_order = parseInt(sortOrderStr, 10)
    }

    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    revalidatePath(`/admin/master/${type}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to update master:', error)
    return { errors: { general: ['更新に失敗しました'] } }
  }
}

// 削除
export async function deleteMaster(
  type: MasterType,
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()
  const table = TABLE_MAP[type]

  try {
    // 使用中かチェック
    const usageCount = await getUsageCount(type, id)
    if (usageCount > 0) {
      return {
        success: false,
        error: `この項目は ${usageCount} 件の団体で使用されているため削除できません`,
      }
    }

    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) throw error

    revalidatePath(`/admin/master/${type}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete master:', error)
    return { success: false, error: '削除に失敗しました' }
  }
}

// 並び順を更新
export async function updateSortOrder(
  type: MasterType,
  id: string,
  direction: 'up' | 'down'
): Promise<{ success: boolean; error?: string }> {
  if (type === 'tags') {
    return { success: false, error: 'タグには並び順がありません' }
  }

  const supabase = createAdminClient()
  const table = TABLE_MAP[type]

  try {
    const { data: current, error: fetchError } = await supabase
      .from(table)
      .select('id, sort_order')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const { data: target, error: targetError } = await supabase
      .from(table)
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
      return { success: true }
    }

    await supabase
      .from(table)
      .update({ sort_order: target.sort_order })
      .eq('id', current.id)

    await supabase
      .from(table)
      .update({ sort_order: current.sort_order })
      .eq('id', target.id)

    revalidatePath(`/admin/master/${type}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to update sort order:', error)
    return { success: false, error: '並び順の変更に失敗しました' }
  }
}
