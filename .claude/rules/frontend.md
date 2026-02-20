---
paths:
  - "src/app/(frontend)/**"
  - "src/components/common/**"
  - "src/lib/animations/**"
---

# フロントエンド（公開サイト）ルール

## デザイン方針

- 親しみやすい・信頼感・わくわく感
- コンテンポラリーで現代的 + アート寄り（行政3:アート7）
- 暖色系カラーパレット、曲線多め
- スマホ:PC = 5:5 を想定したレスポンシブ

## カラーパレット

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

## カラーパレット（Apple風4色）

| 用途 | 色名 | CSS変数 | 使用場面 |
|------|------|---------|----------|
| Primary | 赤 | `--apple-red` | メインボタン、アクセント、リンク |
| Secondary | 緑 | `--apple-green` | タグ、サブアクセント |
| Accent | オレンジ | `--apple-orange` | ハイライト、バッジ |
| Info | 青 | `--apple-blue` | 情報系アクセント |

```tsx
<span className="text-apple-red">赤</span>
<span className="bg-apple-green/10 text-apple-green">緑タグ</span>
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

会員募集中の団体には紫色（`bg-purple-500`）の四角形バッジを表示：

```tsx
{organization.is_recruiting && (
  <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500 text-white text-xs font-bold rounded-sm shadow-lg ring-2 ring-white">
    <UserPlus className="h-3 w-3" />
    募集中
  </span>
)}
```

表示場所：
- `/activities` 一覧ページ（カード右上）
- `/activities/[slug]` 詳細ページ（タイトル横）
- トップページ 新着情報（カード右上）
- トップページ ピックアップ団体（カード右上）

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
