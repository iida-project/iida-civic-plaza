---
paths:
  - "src/app/(admin)/**"
  - "src/components/admin/**"
---

# 管理画面ルール

## Supabaseクライアントの使い分け

| クライアント | 用途 | RLS |
|-------------|------|-----|
| `createClient()` (server.ts) | 公開サイト | 適用される |
| `createAdminClient()` (admin.ts) | 管理画面 | バイパス |
| `createClient()` (client.ts) | クライアント側 | 適用される |

**重要**: 管理画面では `createAdminClient()` を使用すること。RLSで `is_published = true` のみ取得可能に設定されているため、下書き記事が表示されない問題が発生する。

```typescript
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminPage() {
  const supabase = createAdminClient()  // awaitなし
}
```

## 画像アップロード実装チェックリスト

### 1. Supabase Storage ポリシー
```sql
-- INSERT ポリシー（アップロード許可）
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'media');

-- SELECT ポリシー（読み取り許可）
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'media');
```

### 2. Next.js 画像ドメイン設定
`next.config.ts` に Supabase Storage のドメインを追加：
```typescript
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'gxsvyzvaalwywnylakgu.supabase.co',
    pathname: '/storage/v1/object/public/**',
  }],
},
```
**注意**: `next.config.ts` 変更後は開発サーバーの再起動が必要

### 3. Tiptap リッチテキストエディタ
SSRエラーを防ぐため `immediatelyRender: false` を設定：
```typescript
const editor = useEditor({
  extensions: [...],
  content,
  immediatelyRender: false,  // SSR対応（必須）
})
```

## テーブルカラムの注意

- Payload CMS 削除後、一部テーブルに `payload_id` カラムが残っている
- NOT NULL 制約がある場合はNULL許可に変更が必要
- `display_order` など存在しないカラムを参照していないか確認

## マスターデータ取得

マスターテーブルのソート：
- `activity_categories` と `activity_areas` は `sort_order` カラムでソート
- `tags` は `sort_order` がないため `name` でソート

```typescript
supabase.from('activity_categories').select('id, name').order('sort_order')
supabase.from('activity_areas').select('id, name').order('sort_order')
supabase.from('tags').select('id, name').order('name')
```

## 団体管理のフォームバリデーション

### 必須項目
- `団体名` のみ必須
- `概要説明` は任意（必須ではない）

## Organizations テーブル拡張カラム

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `activity_schedule` | TEXT | 活動日（例: 毎月第2土曜日） |
| `member_count` | TEXT | 会員数（例: 約30名） |
| `membership_fee` | TEXT | 会費（例: 年会費3,000円） |
| `activity_location` | TEXT | 活動場所（例: 飯田市公民館） |
| `representative` | TEXT | 代表者名 |
| `established_year` | INTEGER | 設立年（西暦） |
| `activity_description` | TEXT | 活動内容（リッチテキスト） |
| `is_recruiting` | BOOLEAN | 会員募集中フラグ |

## ピックアップ団体機能

- `is_featured` (BOOLEAN) - ピックアップフラグ
- 最大3件まで
- 管理画面で★アイコンをクリックしてトグル

```typescript
const MAX_FEATURED_ORGANIZATIONS = 3

export async function toggleFeatured(id: string) {
  // 上限チェック後にトグル
}
```

## メディアライブラリ

Supabase Storageを使用したメディア管理機能（`/admin/media`）。

### 機能
- **一覧表示**: すべてのフォルダを再帰的にスキャンして画像を表示
- **アップロード**: ドラッグ&ドロップ対応、複数ファイル同時アップロード
- **削除**: 使用状況チェック付き、参照クリア機能
- **URL コピー**: クリックでクリップボードにコピー

### ファイル構成
```
src/app/(admin)/admin/media/
├── page.tsx           # メディア一覧ページ
├── actions.ts         # Server Actions
└── _components/
    ├── MediaCard.tsx      # 画像カード（削除確認ダイアログ付き）
    ├── MediaGrid.tsx      # グリッド表示
    └── MediaUploader.tsx  # アップロード（D&D対応）
```

### Server Actions（actions.ts）
```typescript
getMediaFiles(): Promise<MediaFile[]>           // 全ファイル取得（再帰的）
checkMediaUsage(url: string): Promise<MediaUsage[]>  // 使用状況チェック
deleteMedia(url: string, clearReferences?: boolean)   // 削除
uploadMedia(formData: FormData)                       // アップロード（YYYY/MM/timestamp形式）
```

### MediaPickerDialog

編集画面で既存画像をライブラリから選択するダイアログ：

```typescript
import { MediaPickerDialog } from '@/components/admin'

<MediaPickerDialog
  onSelect={(url) => setImageUrl(url)}
  trigger={<Button>ライブラリから選択</Button>}
/>
```

使用箇所：
- `ImageUpload`（団体サムネイル、助成金PDF）
- `GalleryUpload`（インタビューギャラリー）

## リッチテキストエディタ カスタムメニュー

Tiptap 3.x の BubbleMenu/FloatingMenu は z-index 問題があるため、React Portal + Floating UI でカスタム実装。

### CustomBubbleMenu（テキスト選択時）
`src/components/admin/editor/CustomBubbleMenu.tsx`
- **Bold** (⌘+B), **Italic** (⌘+I), **Strikethrough**, **Code**, **Link**（URL入力付き）

### CustomFloatingMenu（空行/ブロック先頭）
`src/components/admin/editor/CustomFloatingMenu.tsx`
- **画像挿入**, **水平線**, **見出し**（H1-H3）, **引用**, **リスト**

動作仕様：
- エディタにフォーカスがある時のみ「+」ボタンを表示
- メニュー外クリックで自動的に閉じる
- React Portal でモーダル/ダイアログ内でも正常に動作

```tsx
import { RichTextEditor } from '@/components/admin/editor'

<RichTextEditor
  content={body}
  onChange={setBody}
  placeholder="本文を入力..."
/>
```

## AI要約機能（Gemini API）

インタビュー記事に対して3段階のAI要約を生成する機能。

### データベースカラム（interviewsテーブル）

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `summary_short` | TEXT | さくっと要約（150文字以内） |
| `summary_medium` | TEXT | ほどよく要約（400文字以内） |
| `summary_long` | TEXT | じっくり要約（800文字以内） |

### Gemini API設定（src/lib/gemini.ts）

```typescript
import { generateSummaries, generateSingleSummary, type SummaryLevel } from '@/lib/gemini'

const summaries = await generateSummaries(articleBody)
const summary = await generateSingleSummary(articleBody, 'short')
```

- **モデル**: `gemini-2.5-flash-lite`（無料枠あり）
- **無料枠制限**: RPM: 10回/分、RPD: 20回/日、TPM: 250Kトークン/分

### 管理画面（InterviewForm）
- 「AIで生成」ボタン: 3つすべてを一括生成
- 各フィールドの「再生成」ボタン: 個別に1つだけ再生成
- 生成後に手動編集可能、文字数カウンター付き

### 公開サイト（SummarySlider）
```tsx
<SummarySlider
  summaryShort={interview.summary_short}
  summaryMedium={interview.summary_medium}
  summaryLong={interview.summary_long}
/>
```
- 3段階スライダー（さくっと/ほどよく/じっくり）
- アニメーション付き切り替え（Framer Motion）
- 要約が未設定の場合は非表示
