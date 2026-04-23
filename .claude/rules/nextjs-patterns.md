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

`generateMetadata` とページ本体で同じデータを取得する場合、`React.cache()` で重複排除する。
**全詳細ページ（activities, interviews, grants, news）に適用済み。**

```typescript
import { cache } from 'react'

// cache() でラップすると、同一リクエスト内で複数回呼んでも1回のみ実行
const getPost = cache(async (slug: string) => {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
})

// generateMetadata と Page の両方で getPost(slug) を呼ぶ → 実際のDBクエリは1回
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  // ...
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  // ...
}
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

## generateStaticParams で SSG 化

`[slug]` などの動的ルートはビルド時に全 slug を取得し、SSG 化する。動的レンダリング（ƒ）より静的生成（●）が高速でキャッシュ効率が高い。

**適用済み**: `/activities/[slug]`, `/interviews/[slug]`, `/grants/[slug]`, `/news/[slug]`

```typescript
export async function generateStaticParams() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('organizations')
    .select('slug')
    .eq('is_published', true)

  return (data ?? []).map(({ slug }) => ({ slug }))
}
```

- `createPublicClient` (anon key + cookies未使用) はビルド時にも利用可
- ビルド後に新規公開されたデータは ISR (`revalidate = 60`) でフォールバック生成

## Server / Client Component 境界の最小化

Framer Motion の `<motion.*>` が必要なセクション全体を `'use client'` にするのではなく、
**アニメーション用の小さな Client ラッパー (`FadeInOnScroll` など) で必要な箇所だけ包む**。

```typescript
// 悪い例: セクション全体が 'use client' → 静的JSXまでhydrateされる
'use client'
export function Section({ items }) {
  return (
    <section>
      <motion.div initial={...} animate={...}>
        <h2>タイトル</h2>
      </motion.div>
      {items.map(i => <motion.article key={i.id}>...</motion.article>)}
    </section>
  )
}

// 良い例: Server Component のまま、アニメ部分のみ FadeInOnScroll
import { FadeInOnScroll } from '@/lib/animations'

export function Section({ items }) {
  return (
    <section>
      <FadeInOnScroll>
        <h2>タイトル</h2>
      </FadeInOnScroll>
      {items.map((i, idx) => (
        <FadeInOnScroll key={i.id} delay={idx * 0.1}>
          <article>...</article>
        </FadeInOnScroll>
      ))}
    </section>
  )
}
```

**適用済み**: トップページの `LatestArticlesSection`, `PickupOrganizationsSection`, `FeaturedInterviewsSection`, `CTASection`（`HeroSection` のみ即時マウント演出のため `'use client'` 維持）。

## next/image の `sizes` 必須

`fill` を使う `<Image>` は **必ず `sizes` を指定**（指定しないとデフォルト `100vw` で最大解像度が配信される）。

```typescript
// グリッドレイアウトに応じたsizes指定
<Image src={...} alt={...} fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />

// 固定サイズなら実寸指定
<Image src={...} alt={...} fill sizes="64px" />
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

**配置済み境界:**
- `src/app/(frontend)/error.tsx` - frontend グループ全体のエラー境界
- `src/app/(frontend)/loading.tsx` - frontend グループ全体のローディング
- `src/app/(frontend)/{activities,interviews,grants,news}/[slug]/not-found.tsx` - 各詳細404
- `src/app/(frontend)/{activities,interviews,grants,news,faq}/loading.tsx` - 各ルートの skeleton

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

## 並列データ取得（Promise.all）

独立した複数のクエリは `Promise.all` で並列実行する。ウォーターフォールを排除し、
最も遅いクエリの時間だけで全データが揃う。

**適用済み箇所**: トップページ（4クエリ並列）、一覧ページ（リレーション3並列）、
詳細ページ（リレーション3並列）、管理画面編集ページ（データ+マスター並列）

```typescript
// 悪い例: 逐次実行（各50msずつ合計200ms）
const { data: orgs } = await supabase.from('organizations').select('*')
const { data: interviews } = await supabase.from('interviews').select('*')
const { data: grants } = await supabase.from('grants').select('*')
const { data: news } = await supabase.from('news_posts').select('*')

// 良い例: 並列実行（最長の50msで完了）
const [
  { data: orgs },
  { data: interviews },
  { data: grants },
  { data: news },
] = await Promise.all([
  supabase.from('organizations').select('*'),
  supabase.from('interviews').select('*'),
  supabase.from('grants').select('*'),
  supabase.from('news_posts').select('*'),
])
```

## 重量コンポーネントの動的インポート

クライアントコンポーネントで大きなライブラリを使う場合は `next/dynamic` で遅延読み込み。
初期バンドルサイズを削減し、ページの読み込み速度を向上させる。

```typescript
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(
  () => import('@/components/admin/editor/RichTextEditor').then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <div className="h-64 bg-gray-50 rounded-md animate-pulse" /> }
)
```

**適用済み**: RichTextEditor（Tiptap ~500KB）を全管理フォームで dynamic import

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
