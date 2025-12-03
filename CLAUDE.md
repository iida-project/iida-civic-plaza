# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「飯田の市民活動ひろば」- 飯田市内のNPO・市民活動を可視化するWebサイト。
Next.js 15（App Router）+ Supabase + Vercel の構成。

## 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# ESLint実行
npm run lint
```

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router, Turbopack)
- **言語**: TypeScript (strict mode)
- **スタイリング**: Tailwind CSS 3.4
- **データベース**: Supabase (PostgreSQL)
- **ストレージ**: Supabase Storage - 画像・メディア（バケット名: media）
- **UIライブラリ**: shadcn/ui, Lucide Icons
- **アニメーション**: Framer Motion
- **ホスティング**: Vercel (ISR)
- **管理画面**: 自作（予定）

## アーキテクチャ

### データフロー

```
Supabase (PostgreSQL) ←→ Next.js (公開サイト + 管理画面)
                              ↓
                    Vercel (ISR) でホスティング
```

### ルーティング構成

```
app/
├─ (frontend)/         # 公開サイト
│   ├─ page.tsx        # トップ /
│   ├─ activities/     # 市民活動紹介 /activities, /activities/[slug]
│   ├─ interviews/     # インタビュー /interviews, /interviews/[slug]
│   ├─ grants/         # 助成金情報 /grants, /grants/[slug]
│   ├─ news/           # お知らせ /news, /news/[slug]
│   ├─ faq/            # FAQ /faq
│   └─ about/          # サイトについて /about
├─ (admin)/            # 管理画面（自作予定）
│   └─ admin/          # /admin
└─ api/                # API Routes
```

## パスエイリアス

```typescript
// tsconfig.json
"@/*" → "./src/*"
```

## 環境変数

必要な環境変数（`.env.local`に設定）:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## デザイン方針

- 親しみやすい・信頼感・わくわく感
- コンテンポラリーで現代的 + アート寄り（行政3:アート7）
- 暖色系カラーパレット、曲線多め
- スマホ:PC = 5:5 を想定したレスポンシブ

### カラーパレット

| 用途 | 色名 | HEX | Tailwind | 使用場面 |
|------|------|-----|----------|----------|
| Primary | オレンジ | `#F97316` | `orange-500` | メインボタン、アクセント、リンク |
| Primary Dark | ダークオレンジ | `#EA580C` | `orange-600` | ホバー状態 |
| Secondary | コーラル | `#FB7185` | `rose-400` | サブアクセント、タグ |
| Secondary Dark | ローズ | `#E11D48` | `rose-600` | ホバー状態 |
| Accent | アンバー | `#F59E0B` | `amber-500` | ハイライト、バッジ、CTA |
| Background | クリーム | `#FFFBEB` | `amber-50` | 背景色 |
| Background Alt | ライトクリーム | `#FEF3C7` | `amber-100` | カード背景、セクション区切り |
| Text | ダークブラウン | `#451A03` | `orange-950` | 本文テキスト |
| Text Light | ブラウン | `#78350F` | `amber-900` | サブテキスト |
| Border | ライトオレンジ | `#FDBA74` | `orange-300` | ボーダー、区切り線 |

### CSS変数設定（globals.css）

```css
:root {
  --primary: 24.6 95% 53.1%;        /* orange-500 */
  --primary-foreground: 60 9.1% 97.8%;
  --secondary: 349.7 89.2% 72.9%;   /* rose-400 */
  --accent: 37.7 92.1% 50.2%;       /* amber-500 */
  --background: 48 100% 96.1%;      /* amber-50 */
  --foreground: 20.9 91.7% 14.1%;   /* orange-950 */
  --muted: 48 96.5% 88.8%;          /* amber-100 */
  --border: 24.6 94.5% 72.2%;       /* orange-300 */
}
```

### 使用ガイドライン

- **Primary（オレンジ）**: CTAボタン、重要なリンク、ナビゲーションのアクティブ状態
- **Secondary（コーラル）**: カテゴリタグ、サブボタン、アイコン
- **Accent（アンバー）**: 新着バッジ、締切警告、ピックアップ表示
- **Background（クリーム）**: 全体背景、柔らかく温かみのある印象
- **Text（ダークブラウン）**: 黒ではなく茶系で暖色パレットに調和

## Next.js App Router ベストプラクティス

### ディレクティブ

```typescript
'use client'  // クライアントコンポーネント（イベント、hooks、ブラウザAPI使用時）
'use server'  // Server Actions（データ変更、DB操作）
'use cache'   // キャッシュ有効化（パフォーマンス向上）
```

### Server Components（デフォルト）

Server Componentsはデフォルトで、データフェッチとセキュリティに最適：

```typescript
// app/activities/page.tsx
export default async function Page() {
  // サーバーで直接データ取得（クレデンシャル安全）
  const data = await fetch('https://api.example.com/data')
  const posts = await data.json()
  return <ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>
}
```

### データフェッチとキャッシュ戦略

```typescript
// 静的データ（デフォルト: force-cache）
const staticData = await fetch('https://...', { cache: 'force-cache' })

// 動的データ（毎回取得）
const dynamicData = await fetch('https://...', { cache: 'no-store' })

// ISR（時間ベース再検証）
const revalidatedData = await fetch('https://...', {
  next: { revalidate: 60 }  // 60秒ごと
})

// タグベース再検証
const taggedData = await fetch('https://...', {
  next: { tags: ['posts'] }  // revalidateTag('posts')で無効化
})
```

### データ取得の重複排除（React cache）

```typescript
import { cache } from 'react'
import 'server-only'

// 同一リクエスト内で複数回呼んでも1回のみ実行
export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

### Server Actions（データ変更）

```typescript
// app/actions.ts
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

  // DB操作
  await db.insert(posts).values(validatedFields.data)

  revalidatePath('/posts')  // キャッシュ無効化
  redirect('/posts')        // リダイレクト
}
```

### フォーム実装（useActionState）

```typescript
// app/components/form.tsx
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
      <textarea name="content" required />
      <p aria-live="polite">{state?.message}</p>
      <button type="submit" disabled={pending}>
        {pending ? '送信中...' : '投稿'}
      </button>
    </form>
  )
}
```

### 動的メタデータ（SEO）

```typescript
// app/activities/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [post.mainImage, ...previousImages],
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  return <article>{/* ... */}</article>
}
```

### エラーハンドリング

```typescript
// app/activities/error.tsx（エラー境界）
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  )
}

// app/activities/not-found.tsx（404）
export default function NotFound() {
  return <div>ページが見つかりません</div>
}

// ページ内でnotFound()を呼び出し
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const post = await getPost(params.slug)
  if (!post) notFound()
  return <article>{/* ... */}</article>
}
```

### ローディングUI（Suspense）

```typescript
// app/activities/loading.tsx（自動Suspense境界）
export default function Loading() {
  return <div>読み込み中...</div>
}

// 手動Suspense境界（部分的なローディング）
import { Suspense } from 'react'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>記事を読み込み中...</p>}>
        <PostList />
      </Suspense>
      <Suspense fallback={<p>サイドバーを読み込み中...</p>}>
        <Sidebar />
      </Suspense>
    </section>
  )
}
```

### Route Handlers（API）

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const posts = await db.select().from(posts)
  return NextResponse.json({ data: posts })
}

export async function POST(request: Request) {
  const body = await request.json()
  // 検証・保存処理
  return NextResponse.json({ success: true }, { status: 201 })
}

// app/api/posts/[id]/route.ts（動的ルート）
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await getPost(params.id)
  return NextResponse.json(post)
}
```

### ファイル規約一覧

| ファイル | 用途 |
|---------|------|
| `page.tsx` | ルートのUI |
| `layout.tsx` | 共有レイアウト |
| `loading.tsx` | ローディングUI（Suspense境界） |
| `error.tsx` | エラー境界 |
| `not-found.tsx` | 404ページ |
| `route.ts` | APIエンドポイント |
| `default.tsx` | Parallel Routesのフォールバック |

## チケット管理（/docs）

チケットファイルは `/docs` 配下に連番で管理する。

### ファイル命名規則
```
/docs/
├── 001-環境構築-supabase.md
├── 003-環境構築-shadcn-ui.md
├── ...
```

### Todo記法
各チケット内でTodoを管理する。完了したら `[x]` に変更：

```markdown
## Todo
- [ ] 未完了のタスク
- [x] 完了したタスク
```

### チケットテンプレート
```markdown
# [連番] タイトル

## 概要
このチケットで実現すること

## 関連要件
- REQUIREMENTS.md の該当セクション

## 技術仕様
- 使用技術・ライブラリ
- 実装方針

## Todo
- [ ] タスク1
- [ ] タスク2

## 完了条件
- 何ができれば完了か

## 備考
- 補足事項
```

## 要件定義書

詳細な仕様は `REQUIREMENTS.md` を参照。

## Supabase 設定

- **プロジェクトID**: gxsvyzvaalwywnylakgu
- **リージョン**: ap-northeast-1 (東京)
- **Storageバケット**: media（公開）

### 作成済みテーブル

**メインテーブル（RLS有効）:**
- `activity_categories` - 活動分野マスター（10件投入済み）
- `activity_areas` - 活動エリアマスター（18件投入済み）
- `tags` - タグマスター
- `organizations` - 市民活動団体
- `interviews` - ロングインタビュー
- `grants` - 助成金情報
- `news_posts` - お知らせ
- `faqs` - よくある質問

**中間テーブル（RLS有効）:**
- `organization_categories` - 団体 × 活動分野
- `organization_areas` - 団体 × 活動エリア
- `organization_tags` - 団体 × タグ
- `grant_categories` - 助成金 × 対象分野

### RLSポリシー
- 公開データ（`is_published = true`）は誰でもSELECT可能
- マスターテーブルは全データSELECT可能

## Framer Motion アニメーション

### 利用可能なバリアント（src/lib/animations/variants.ts）
- `fadeIn` - フェードイン
- `fadeInUp` - 下からフェードイン
- `slideInLeft` - 左からスライドイン
- `slideInRight` - 右からスライドイン
- `scaleIn` - スケールイン
- `staggerContainer` - 子要素を順番にアニメーション
- `cardHover` - カードホバー効果
- `buttonHover` - ボタンホバー効果
- `pageTransition` - ページトランジション

### 利用可能なコンポーネント（src/lib/animations/motion.tsx）
- `FadeInOnScroll` - スクロールでフェードイン
- `StaggerContainer` - スタガードコンテナ
- `StaggerItem` - スタガードアイテム
- `HoverCard` - ホバーで浮き上がるカード
- `HoverScale` - ホバーでスケール

```tsx
import { FadeInOnScroll, HoverCard } from '@/lib/animations'

<FadeInOnScroll>
  <h1>スクロールでフェードイン</h1>
</FadeInOnScroll>
```

## 管理画面実装の注意点

### Supabaseクライアントの使い分け

| クライアント | 用途 | RLS |
|-------------|------|-----|
| `createClient()` (server.ts) | 公開サイト | 適用される |
| `createAdminClient()` (admin.ts) | 管理画面 | バイパス |
| `createClient()` (client.ts) | クライアント側 | 適用される |

**重要**: 管理画面では `createAdminClient()` を使用すること。RLSで `is_published = true` のみ取得可能に設定されているため、下書き記事が表示されない問題が発生する。

```typescript
// 管理画面のページ（正しい例）
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminPage() {
  const supabase = createAdminClient()  // awaitなし
  // ...
}
```

### 画像アップロード実装チェックリスト

画像アップロード機能を実装する際は、以下を確認すること：

#### 1. Supabase Storage ポリシー
バケットに対してRLSポリシーが必要：
```sql
-- INSERT ポリシー（アップロード許可）
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');

-- SELECT ポリシー（読み取り許可）
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');
```

#### 2. Next.js 画像ドメイン設定
`next.config.ts` に Supabase Storage のドメインを追加：
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'gxsvyzvaalwywnylakgu.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
},
```
**注意**: `next.config.ts` 変更後は開発サーバーの再起動が必要

#### 3. Tiptap リッチテキストエディタ
SSRエラーを防ぐため `immediatelyRender: false` を設定：
```typescript
const editor = useEditor({
  extensions: [...],
  content,
  immediatelyRender: false,  // SSR対応（必須）
  // ...
})
```

### テーブルカラムの注意

- Payload CMS 削除後、一部テーブルに `payload_id` カラムが残っている
- NOT NULL 制約がある場合はNULL許可に変更が必要
- `display_order` など存在しないカラムを参照していないか確認

### マスターデータ取得

マスターテーブル（`activity_categories`, `activity_areas`, `tags`）のソート：
- `activity_categories` と `activity_areas` は `sort_order` カラムでソート可能
- `tags` は `sort_order` がないため `name` でソート

```typescript
// 活動分野・エリア（sort_orderあり）
supabase.from('activity_categories').select('id, name').order('sort_order')

// タグ（sort_orderなし）
supabase.from('tags').select('id, name').order('name')
```

### Supabase リレーションの型アサーション

Supabaseのネストしたselectでは型が配列として推論されるため、`as unknown as` を使用：

```typescript
// 正しい例
organization: interview.organization as unknown as { name: string } | null

// 間違い（型エラー）
organization: interview.organization as { name: string } | null
```

## 完了済みチケット

### 環境構築・基盤
- [x] 001 - Supabase プロジェクト作成
- [x] 003 - shadcn/ui セットアップ
- [x] 004 - Framer Motion セットアップ
- [x] 005 - Supabase テーブル作成
- [x] 006 - 中間テーブル作成（005で完了）
- [x] 007 - マスターデータ投入

### 管理画面
- [x] 008 - 管理画面認証（簡易パスワード認証）
- [x] 009 - 管理画面共通レイアウト
- [x] 010 - リッチテキストエディタ（Tiptap）
- [x] 011 - 団体CRUD
- [x] 012 - インタビューCRUD
- [x] 013 - 助成金CRUD
- [x] 014 - お知らせCRUD
- [x] 015 - FAQ CRUD
- [x] 016 - マスター管理

### 公開サイト
- [x] 021 - 共通レイアウト（Header/Footer）
- [x] 022 - トップページ
- [x] 023 - 市民活動一覧ページ
- [x] 024 - 市民活動詳細ページ

## カラーパレット（Apple風4色）

| 用途 | 色名 | CSS変数 | 使用場面 |
|------|------|---------|----------|
| Primary | 赤 | `--apple-red` | メインボタン、アクセント、リンク |
| Secondary | 緑 | `--apple-green` | タグ、サブアクセント |
| Accent | オレンジ | `--apple-orange` | ハイライト、バッジ |
| Info | 青 | `--apple-blue` | 情報系アクセント |

```tsx
// Tailwindでの使用例
<span className="text-apple-red">赤</span>
<span className="bg-apple-green/10 text-apple-green">緑タグ</span>
```

## 備考

- Payload CMSは互換性問題のため削除済み
- 管理画面は自作で実装
- 認証は本番前にセキュリティ強化予定（チケット045）
- 全テーブルの`payload_id`カラムはNULL許可に変更済み
