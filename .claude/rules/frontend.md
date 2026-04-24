---
paths:
  - "src/app/(frontend)/**"
  - "src/components/common/**"
  - "src/lib/animations/**"
---

# フロントエンド（公開サイト）ルール

## デザイン方針

- ロゴ4色（レッド・オレンジ・グリーン・ブルー）を常に意識できるデザイン
- くっきりした彩度高めのカラーで視認性を確保（色覚特性に配慮）
- 角丸12px + 薄いドロップシャドウ
- スマホ:PC = 5:5 を想定したレスポンシブ（ブレークポイント: 768px）
- セクション間に4色波線区切り（WaveDivider）を配置

## カラーパレット（ムトス4色・くっきり系）

色覚特性のある方にも視認しやすいよう、従来のパステル4色（#F4A7B9 / #F9C784 / #A8D5A2 / #90C8E0）から**彩度高めのくっきり4色**へ全面移行済み。

| 用途 | 色名 | HEX | CSS変数 | Tailwind |
|------|------|-----|---------|----------|
| Primary | レッド | `#E05555` | `--apple-red` / `--primary` / `--ring` | `bg-apple-red` / `bg-primary` |
| Secondary | グリーン | `#78BF5A` | `--apple-green` / `--secondary` | `bg-apple-green` / `bg-secondary` |
| Accent | オレンジ | `#F7BD36` | `--apple-orange` / `--accent` | `bg-apple-orange` / `bg-accent` |
| Info | ブルー | `#6EB1E0` | `--apple-blue` | `bg-apple-blue` |
| Text Main | ダークグレー | `#333333` | `--foreground` | `text-foreground` |
| Text Sub | グレー | `#666666` | `--muted-foreground` | `text-muted-foreground` |
| Background | ホワイト | `#FFFFFF` | `--background` | `bg-background` |

> `globals.css` の HSL 定義（ライト / ダーク）:
> - Primary(赤): `0 69% 61%` / `0 65% 55%`
> - Secondary(緑): `102 44% 55%` / `102 40% 48%`
> - Accent(橙): `42 92% 59%` / `42 80% 50%`
> - Info(青): `205 65% 65%` / `205 55% 55%`
>
> 4色はヒーロー大タイトル「あなたの**ム**ト**ス**を**応援**！」の文字色とも一致（ム/応=赤, ト=青, ス=橙, 援=緑）。

### バッジ・アクセント赤

バッジ用の濃い赤は Primary と同色（`#E05555`）に統一済み。
`bg-apple-red` / `text-apple-red` / `bg-primary` / `text-primary` で利用可能。
従来の `bg-[#E05555]` arbitrary value でも同じ色が出る（互換）。

### 使用ガイドライン

- **Primary（ピンク）**: CTAボタン、ナビアクティブ、メインアクション、汎用ホバー色
- **Secondary（グリーン）**: サブタイトルアンダーライン、エリア系チップ
- **Accent（オレンジ）**: セクションタイトル左カラーバー、助成金バッジ
- **Info（ブルー）**: 「すべて見る」リンク、セカンダリボタン、お知らせバッジ
- **バッジ赤**: カテゴリ・ステータス・ピックアップなどの視認性が必要なバッジ

```tsx
<span className="bg-[#E05555] text-white">カテゴリバッジ</span>
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

### トップページ系セクションは Server Component + FadeInOnScroll

`LatestArticlesSection`, `PickupOrganizationsSection`, `FeaturedInterviewsSection`, `CTASection` は
**Server Component のまま**、アニメ部分を `FadeInOnScroll` でラップする方針。
セクション全体を `'use client'` にしない（静的 JSX まで hydrate されバンドル肥大化するため）。

唯一 `HeroSection` だけは即時マウントの複雑な演出（`motion.div` の `initial+animate`）があるため `'use client'` 維持。

## next/image 使用ルール

- `fill` を使う場合は **必ず `sizes` 属性を指定**（未指定だと `100vw` で最大解像度配信）
- レスポンシブグリッドなら `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- 固定幅なら実寸: `sizes="192px"` など
- LCP 対象（詳細ページのメイン画像）には `priority` を付ける

```tsx
<Image src={url} alt={...} fill
  sizes="(max-width: 1024px) 100vw, 66vw"
  className="object-cover" priority />
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

- **NEWタグ**: 公開7日以内の記事に表示。ムトス4色グラデーション（`linear-gradient(90deg, #E05555, #F7BD36, #78BF5A, #6EB1E0)`）+ `animate-pulse-soft`
- **一覧リンク**: リスト下部右寄せ「一覧を見る →」（現在は `/coming-soon`）

## 紹介誌掲載タグ

タグ名に「紹介誌」を含むタグがある団体は、詳細ページのサイドバー「団体情報」タイトル横にバッジ表示。
管理画面でタグを付け外しするだけで制御可能。

## Coming Soonページ

`/preview` に配置（`(frontend)` グループ外、Header/Footerなし）。
ミドルウェアの `COMING_SOON_MODE = true` で未認証ユーザーをリダイレクト。
公開時は `COMING_SOON_MODE = false` に変更するだけ。

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

## ロゴ画像

`public/images/` に3種類のロゴを配置。すべて `next/image` で読み込み、元ファイルは事前に `sharp` で最適化済み（元サイズ数MB → 数十KB）。

| ファイル | サイズ | 用途 | 配置 |
|---------|--------|------|------|
| `logo.png` | 512×528px (19KB) | シンボルロゴ（りんご型） | ヘッダー左（`h-14`）、過去フッター |
| `logo-text.png` | 600×113px (4.6KB) | 「ムトス飯田」ワードマーク | ヘッダー右（`h-6 -mt-1`、`sm:block`で非モバイル表示） |
| `logo-footer.png` | 512×650px (24KB) | 縦長ロゴ（フッター専用） | フッター（`h-28`） |

- Next.js Image の `width` / `height` は実画像のアスペクト比と一致させる（ずれていると表示が歪む）
- ロゴ画像を差し替える際は `sharp` で事前最適化：
  ```bash
  node -e "const s=require('sharp'); s('input.png').resize(600,null,{withoutEnlargement:true}).png({compressionLevel:9,quality:90}).toFile('output.png').then(i=>console.log(i))"
  ```

## ヒーローセクション

ポスターのキャッチコピーを反映した構成。ファイル: `src/app/(frontend)/_components/HeroSection.tsx`

### 小キャッチ（ポップなフローティングステッカー）

3つのフレーズを**白背景 + カラー枠線 + 同色ソリッドシャドウ**のピル型チップとして配置。綺麗に並べず、各チップに異なる傾き・浮上位置・フロート遅延を設定して「貼ったシールがフワフワ揺れている」印象を作る。

| テキスト | 色 | 傾き | 初期ベースY | フロート遅延 |
|---------|----|------|----------|------------|
| してみる！ | `#E05555` | `-5°` | `0` | `0s` |
| せむとす！ | `#F7BD36` | `+4°` | `-6` | `0.6s` |
| やってみよう！ | `#78BF5A` | `-3°` | `+2` | `1.2s` |

- **登場**: `scale 0 → 1` と `rotate -25° → 定位置` をスプリング（stiffness 280, damping 14）で弾ませ、`i * 0.12s` でスタガー
- **常時**: `y: [base, base - 6, base]` を 2.8s の easeInOut 無限ループ、各チップで `floatDelay` をずらしてバラバラに漂わせる
- **ホバー**: `scale 1.12` + `rotate 0`（スプリング）でピシッと姿勢を正す反応 ＝ 小さなご褒美
- **ボックスシャドウ**: `3px 3px 0 ${color}, 0 6px 18px rgba(0,0,0,0.06)`（ソリッド色影でステッカー感、ベースに薄い暗影で浮遊感）

### 大タイトル（h1）

「あなたの**ムトス**を応援！」
- あなたの/を: `#0A4585`（`text-[0.7em]` で小さく）
- ム: `#E05555`（赤）
- ト: `#6EB1E0`（青）
- ス: `#F7BD36`（橙）
- 応: `#E05555`（赤、「ム」と同色）
- 援: `#78BF5A`（緑）
- ！: `#6EB1E0`（青、「ト」と同色）

文字には白の縁取り（`textShadow` 1px白4方向）＋ 薄いドロップシャドウを適用。

### サブタイトル
「つなげる、広がる、飯田市の市民活動」

## 画像アップロードの注意

### 推奨画像サイズ
- **ファイルサイズ**: 500KB〜2MB
- **解像度**: 1920×1280px以上
- **形式**: JPG（写真）、PNG（ロゴ・イラスト）

小さすぎる画像（例: 23KB）は画質が悪くなる。Next.jsの最適化では元画像以上の品質にはならない。
