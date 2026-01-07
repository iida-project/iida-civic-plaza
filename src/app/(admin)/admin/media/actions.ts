'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export type MediaFile = {
  name: string
  url: string
  size: number
  createdAt: string
}

export type MediaUsage = {
  table: string
  tableName: string
  column: string
  items: { id: string; title: string }[]
}

// メディア一覧取得（再帰的にすべてのフォルダをスキャン）
export async function getMediaFiles(): Promise<MediaFile[]> {
  const supabase = createAdminClient()
  const allFiles: MediaFile[] = []

  // 再帰的にフォルダをスキャンする関数
  async function scanFolder(path: string): Promise<void> {
    const { data, error } = await supabase.storage.from('media').list(path, {
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      console.error(`Failed to fetch media files from ${path}:`, error)
      return
    }

    for (const item of data) {
      // フォルダの場合は再帰的にスキャン
      if (item.id === null) {
        const folderPath = path ? `${path}/${item.name}` : item.name
        await scanFolder(folderPath)
      } else {
        // ファイルの場合はリストに追加
        const filePath = path ? `${path}/${item.name}` : item.name
        allFiles.push({
          name: item.name,
          url: supabase.storage.from('media').getPublicUrl(filePath).data.publicUrl,
          size: item.metadata?.size || 0,
          createdAt: item.created_at || '',
        })
      }
    }
  }

  await scanFolder('')

  // 作成日時で降順ソート
  allFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return allFiles
}

// 画像の使用状況をチェック
export async function checkMediaUsage(url: string): Promise<MediaUsage[]> {
  const supabase = createAdminClient()
  const usages: MediaUsage[] = []

  // organizations テーブル (main_image_url)
  const { data: orgsMain } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('main_image_url', url)

  if (orgsMain && orgsMain.length > 0) {
    usages.push({
      table: 'organizations',
      tableName: '団体',
      column: 'main_image_url',
      items: orgsMain.map((o) => ({ id: o.id, title: o.name })),
    })
  }

  // organizations テーブル (gallery_images) - 配列内を検索
  const { data: orgsGallery } = await supabase
    .from('organizations')
    .select('id, name, gallery_images')
    .not('gallery_images', 'is', null)

  if (orgsGallery) {
    const matchingOrgs = orgsGallery.filter((o) => {
      const images = o.gallery_images as string[] | null
      return images && images.includes(url)
    })
    if (matchingOrgs.length > 0) {
      usages.push({
        table: 'organizations',
        tableName: '団体（ギャラリー）',
        column: 'gallery_images',
        items: matchingOrgs.map((o) => ({ id: o.id, title: o.name })),
      })
    }
  }

  // interviews テーブル
  const { data: interviews } = await supabase
    .from('interviews')
    .select('id, title')
    .eq('main_image_url', url)

  if (interviews && interviews.length > 0) {
    usages.push({
      table: 'interviews',
      tableName: 'インタビュー',
      column: 'main_image_url',
      items: interviews.map((i) => ({ id: i.id, title: i.title })),
    })
  }

  // grants テーブル
  const { data: grants } = await supabase
    .from('grants')
    .select('id, title')
    .eq('thumbnail_url', url)

  if (grants && grants.length > 0) {
    usages.push({
      table: 'grants',
      tableName: '助成金',
      column: 'thumbnail_url',
      items: grants.map((g) => ({ id: g.id, title: g.title })),
    })
  }

  // news_posts テーブル
  const { data: news } = await supabase
    .from('news_posts')
    .select('id, title')
    .eq('thumbnail_url', url)

  if (news && news.length > 0) {
    usages.push({
      table: 'news_posts',
      tableName: 'お知らせ',
      column: 'thumbnail_url',
      items: news.map((n) => ({ id: n.id, title: n.title })),
    })
  }

  return usages
}

// 関連する記事の画像URLをnullに更新
async function clearMediaReferences(url: string): Promise<void> {
  const supabase = createAdminClient()

  // organizations.main_image_url
  await supabase
    .from('organizations')
    .update({ main_image_url: null })
    .eq('main_image_url', url)

  // organizations.gallery_images から該当URLを削除
  const { data: orgsGallery } = await supabase
    .from('organizations')
    .select('id, gallery_images')
    .not('gallery_images', 'is', null)

  if (orgsGallery) {
    for (const org of orgsGallery) {
      const images = org.gallery_images as string[] | null
      if (images && images.includes(url)) {
        const newImages = images.filter((img) => img !== url)
        await supabase
          .from('organizations')
          .update({ gallery_images: newImages.length > 0 ? newImages : null })
          .eq('id', org.id)
      }
    }
  }

  // interviews.main_image_url
  await supabase
    .from('interviews')
    .update({ main_image_url: null })
    .eq('main_image_url', url)

  // grants.thumbnail_url
  await supabase
    .from('grants')
    .update({ thumbnail_url: null })
    .eq('thumbnail_url', url)

  // news_posts.thumbnail_url
  await supabase
    .from('news_posts')
    .update({ thumbnail_url: null })
    .eq('thumbnail_url', url)
}

// メディア削除
export async function deleteMedia(
  url: string,
  clearReferences: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  try {
    // URLからファイル名を抽出
    const urlParts = url.split('/media/')
    if (urlParts.length < 2) {
      return { success: false, error: 'Invalid URL format' }
    }
    const fileName = urlParts[1]

    // 使用中の参照をクリアする場合
    if (clearReferences) {
      await clearMediaReferences(url)
    }

    // Storageから削除
    const { error } = await supabase.storage.from('media').remove([fileName])

    if (error) {
      console.error('Failed to delete media:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/media')
    return { success: true }
  } catch (err) {
    console.error('Delete media error:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// 画像アップロード
export async function uploadMedia(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = createAdminClient()

  const file = formData.get('file') as File
  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  // ファイル名を生成（日時ベース）
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const timestamp = now.getTime()
  const ext = file.name.split('.').pop()
  const fileName = `${year}/${month}/${timestamp}.${ext}`

  try {
    const { error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(fileName)

    revalidatePath('/admin/media')
    return { success: true, url: urlData.publicUrl }
  } catch (err) {
    console.error('Upload media error:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
