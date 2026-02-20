---
paths:
  - "src/app/**/*.tsx"
  - "src/app/**/*.ts"
---

# Next.js App Router ベストプラクティス

## ディレクティブ

```typescript
'use client'  // クライアントコンポーネント（イベント、hooks、ブラウザAPI使用時）
'use server'  // Server Actions（データ変更、DB操作）
'use cache'   // キャッシュ有効化（パフォーマンス向上）
```

## Server Components（デフォルト）

```typescript
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const posts = await data.json()
  return <ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>
}
```

## データフェッチとキャッシュ戦略

```typescript
// 静的データ（デフォルト: force-cache）
const staticData = await fetch('https://...', { cache: 'force-cache' })

// 動的データ（毎回取得）
const dynamicData = await fetch('https://...', { cache: 'no-store' })

// ISR（時間ベース再検証）
const revalidatedData = await fetch('https://...', { next: { revalidate: 60 } })

// タグベース再検証
const taggedData = await fetch('https://...', { next: { tags: ['posts'] } })
```

## データ取得の重複排除（React cache）

```typescript
import { cache } from 'react'
import 'server-only'

export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

## Server Actions（データ変更）

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export async function createPost(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await db.insert(posts).values(validatedFields.data)
  revalidatePath('/posts')
  redirect('/posts')
}
```

## フォーム実装（useActionState）

```typescript
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initialState = { message: '', errors: {} }

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <form action={formAction}>
      <input type="text" name="title" required />
      {state?.errors?.title && <p>{state.errors.title}</p>}
      <button type="submit" disabled={pending}>
        {pending ? '送信中...' : '投稿'}
      </button>
    </form>
  )
}
```

## 動的メタデータ（SEO）

```typescript
import type { Metadata, ResolvingMetadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, images: [post.mainImage] },
  }
}
```

## エラーハンドリング

```typescript
// error.tsx（エラー境界）
'use client'
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  )
}

// not-found.tsx
export default function NotFound() {
  return <div>ページが見つかりません</div>
}

// ページ内でnotFound()を呼び出し
import { notFound } from 'next/navigation'
const post = await getPost(params.slug)
if (!post) notFound()
```

## ローディングUI（Suspense）

```typescript
// loading.tsx（自動Suspense境界）
export default function Loading() {
  return <div>読み込み中...</div>
}

// 手動Suspense境界
import { Suspense } from 'react'
<Suspense fallback={<p>読み込み中...</p>}>
  <PostList />
</Suspense>
```

## Route Handlers（API）

```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const posts = await db.select().from(posts)
  return NextResponse.json({ data: posts })
}
```

## ファイル規約一覧

| ファイル | 用途 |
|---------|------|
| `page.tsx` | ルートのUI |
| `layout.tsx` | 共有レイアウト |
| `loading.tsx` | ローディングUI（Suspense境界） |
| `error.tsx` | エラー境界 |
| `not-found.tsx` | 404ページ |
| `route.ts` | APIエンドポイント |
| `default.tsx` | Parallel Routesのフォールバック |
