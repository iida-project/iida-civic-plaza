---
paths:
  - "src/app/(frontend)/**"
  - "src/components/common/**"
  - "src/lib/animations/**"
---

# フロントエンド（公開サイト）ルール

## デザイン方針

- ロゴ4色（ピンク・オレンジ・グリーン・ブルー）を常に意識できるデザイン
- 明るくポップ、パステル調カラー
- 角丸12px + 薄いドロップシャドウ
- スマホ:PC = 5:5 を想定したレスポンシブ（ブレークポイント: 768px）
- セクション間に4色波線区切り（WaveDivider）を配置

## カラーパレット（りんご4色パステル）

| 用途 | 色名 | HEX | CSS変数 | Tailwind |
|------|------|-----|---------|----------|
| Primary | りんごピンク | `#F4A7B9` | `--apple-red` / `--primary` | `bg-apple-red` / `bg-primary` |
| Secondary | りんごグリーン | `#A8D5A2` | `--apple-green` / `--secondary` | `bg-apple-green` / `bg-secondary` |
| Accent | りんごオレンジ | `#F9C784` | `--apple-orange` / `--accent` | `bg-apple-orange` / `bg-accent` |
| Info | りんごブルー | `#90C8E0` | `--apple-blue` | `bg-apple-blue` |
| Text Main | ダークグレー | `#333333` | `--foreground` | `text-foreground` |
| Text Sub | グレー | `#666666` | `--muted-foreground` | `text-muted-foreground` |
| Background | ホワイト | `#FFFFFF` | `--background` | `bg-background` |

### 使用ガイドライン

- **Primary（ピンク）**: CTAボタン、ナビアクティブ、メインアクション
- **Secondary（グリーン）**: サブタイトルアンダーライン、エリア系チップ
- **Accent（オレンジ）**: セクションタイトル左カラーバー、助成金バッジ
- **Info（ブルー）**: 「すべて見る」リンク、セカンダリボタン、お知らせバッジ

```tsx
<span className="bg-apple-red text-white">ピンクバッジ</span>
<span className="text-apple-blue border-b border-apple-blue">ブルーリンク</span>
```

## フォント

| 用途 | フォント | Tailwindクラス |
|------|---------|---------------|
| 見出し・ボタン・UI | M PLUS Rounded 1c | `font-heading` |
| 本文・説明文 | Noto Serif JP | `font-body` |

```tsx
<h2 className="font-heading font-bold">セクションタイトル</h2>
<p className="font-body text-muted-foreground">説明文</p>
```

## 共通スタイルパターン

### セクションタイトル（左カラーバー付き）
```tsx
<div className="flex items-center gap-3">
  <span className="w-1.5 h-[1.2em] bg-apple-orange rounded-sm flex-shrink-0" />
  <h2 className="text-2xl sm:text-3xl font-heading font-bold">タイトル</h2>
</div>
```

### 4色グラデーションボーダー
```tsx
<header className="gradient-border-bottom">...</header>
<footer className="gradient-border-top">...</footer>
```

### 「すべて見る」リンク
```tsx
<Link className="text-apple-blue font-heading font-bold border-b border-apple-blue hover:opacity-70">
  すべて見る <ArrowRight />
</Link>
```

### カードシャドウ
```tsx
<div className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all">
```

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

## 共通コンポーネント（src/components/common）

```typescript
import {
  // カード
  BaseCard, CardImage, CardContent, CardTitle, CardDescription, CardBadge,
  // フィルター
  FilterContainer, FilterSection, ChipFilter, SortButtons, ClearFilterButton, ResultCount, useFilterParams,
  // 画像ギャラリー
  ImageGallery,
  // リッチテキスト
  RichTextRenderer, ArticleBody,
  // バッジ
  CategoryBadge, AreaBadge, TagBadge, StatusBadge, DeadlineBadge, BadgeList, NewBadge, PickupBadge,
} from '@/components/common'
```

### ImageGallery
画像ギャラリー（ライトボックス、キーボード操作、スワイプ対応）

```tsx
<ImageGallery images={galleryImages} alt="団体名の活動写真" title="活動の様子" />
```

### RichTextRenderer / ArticleBody
リッチテキスト（HTML）のスタイリング表示

```tsx
<RichTextRenderer html={content} size="large" />
<ArticleBody html={article.body} />  // 見出しID自動付与
```

### バッジコンポーネント
```tsx
<CategoryBadge icon>子ども</CategoryBadge>      // 赤
<AreaBadge>上郷</AreaBadge>                      // 緑
<TagBadge>ボランティア</TagBadge>                // 青
<StatusBadge variant="open">受付中</StatusBadge> // open/closed/soon/urgent/info
<DeadlineBadge daysRemaining={5} />              // 日数から自動判定
```

## 会員募集バッジ

会員募集中の団体には赤→オレンジのグラデーション + パルスアニメーションバッジを表示：

```tsx
{organization.is_recruiting && (
  <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-3 py-1 text-white text-xs font-bold rounded-sm shadow-lg ring-2 ring-white/80 bg-gradient-to-r from-red-500 to-orange-400 animate-pulse-soft">
    <UserPlus className="h-3 w-3" />
    募集中
  </span>
)}
```

- `animate-pulse-soft`: globals.css で定義（2秒周期の明滅アニメーション）

表示場所：
- `/activities` 一覧ページ（カード右上）
- `/activities/[slug]` 詳細ページ（タイトル横）
- トップページ 新着情報（リスト内）
- トップページ ピックアップ団体（カード右上）

## 新着情報セクション（トップページ）

リスト形式で表示。各行: 日付 → NEWタグ → カテゴリバッジ → タイトル → 募集中バッジ

- **NEWタグ**: 公開7日以内の記事に表示。ムトス4色グラデーション（`linear-gradient(90deg, #F4A7B9, #F9C784, #A8D5A2, #90C8E0)`）+ `animate-pulse-soft`
- **一覧リンク**: リスト下部右寄せ「一覧を見る →」（現在は `/coming-soon`）

## 市民活動詳細ページのレイアウト

現在は2:1グリッド（`lg:grid-cols-3` + `lg:col-span-2`）：

```
[メインコンテンツ (2/3)]  | [サイドバー (1/3)]
```

メインコンテンツ: タイトル、画像、活動内容、ギャラリー
サイドバー: 基本情報、カテゴリ/エリア/タグ、関連インタビュー

### レイアウト情報の保存場所
過去のレイアウト変遷は `docs/layouts/` に保存：
- `docs/layouts/activities-detail-2-1.md` - 元の2:1レイアウト

## 画像アップロードの注意

### 推奨画像サイズ
- **ファイルサイズ**: 500KB〜2MB
- **解像度**: 1920×1280px以上
- **形式**: JPG（写真）、PNG（ロゴ・イラスト）

小さすぎる画像（例: 23KB）は画質が悪くなる。Next.jsの最適化では元画像以上の品質にはならない。
