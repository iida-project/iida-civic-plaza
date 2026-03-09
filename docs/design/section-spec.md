# トップページ セクション仕様書

> 最終更新: 2026-03-09
> 各セクションの詳細仕様（現状の実装ベース）

---

## 概要

トップページは6つのセクション + Header/Footerで構成。
全セクションはClient Component（`'use client'`）でFramer Motionアニメーション対応。

### セクション順序

| # | セクション | コンポーネント | 背景 | データソース |
|---|-----------|--------------|------|------------|
| 1 | Hero | HeroSection | 透明 + blur装飾 | なし（静的） |
| 2 | 新着情報 | LatestArticlesSection | bg-muted/30 | 4テーブル混合 (6件) |
| 3 | 検索 | SearchSection | 透明 | categories + areas |
| 4 | ピックアップ団体 | PickupOrganizationsSection | 透明 | organizations (3件) |
| 5 | おすすめインタビュー | FeaturedInterviewsSection | グラデーション | interviews (4件) |
| 6 | CTA | CTASection | グラデーション | なし（静的） |

---

## セクション1: HeroSection

### 目的
サイトの第一印象。サイト名・コンセプト・主要CTAを提示。

### ファイル
`src/app/(frontend)/_components/HeroSection.tsx`

### 構造
```
<section> py-16 sm:py-24 lg:py-32, relative overflow-hidden
  ├─ 背景装飾 (absolute, -z-10)
  │   ├─ Circle 1: top-10 left-10, w-64/72, bg-primary/10, blur-3xl
  │   ├─ Circle 2: bottom-10 right-10, w-80/96, bg-secondary/10, blur-3xl
  │   └─ Circle 3: center, w-96, bg-accent/5, blur-3xl
  ├─ container
  │   └─ motion.div (fade-up, 0.6s)
  │       ├─ H1: "飯田の市民活動ひろば"
  │       │   └─ "飯田" は text-primary、モバイルで改行
  │       ├─ P: サブテキスト (text-lg/xl, max-w-2xl)
  │       └─ motion.div (fade-up, 0.6s, delay 0.2s)
  │           ├─ CTA Primary: "活動団体を探す" → /activities
  │           │   └─ Search + ArrowRight アイコン、rounded-full
  │           └─ CTA Secondary: "インタビューを読む" → /interviews
  │               └─ bg-card, border-border、rounded-full
```

### Props
なし（完全静的コンポーネント）

### レスポンシブ
| 画面 | H1サイズ | パディング | ボタン配置 |
|------|---------|----------|----------|
| モバイル | text-4xl | py-16 | 縦並び (flex-col) |
| sm | text-5xl | py-24 | 横並び (flex-row) |
| lg | text-6xl | py-32 | 横並び |

---

## セクション2: LatestArticlesSection

### 目的
サイト全体の新着コンテンツを横断的に表示。ユーザーに最新の動きを伝える。

### ファイル
`src/app/(frontend)/_components/LatestArticlesSection.tsx`

### データ
```typescript
type Article = {
  id: string
  slug: string
  title: string
  type: 'organization' | 'interview' | 'grant' | 'news'
  published_at: string
  summary?: string
  is_recruiting?: boolean | null
}
```

**取得ロジック** (page.tsx内):
- organizations: 3件、interviews: 2件、grants: 2件、news: 2件を並列取得
- 全件統合 → published_at降順ソート → 先頭6件

### 構造
```
<section> py-16 sm:py-24, bg-muted/30
  ├─ container
  │   ├─ motion.div (fade-up)
  │   │   └─ H2: "新着情報"
  │   └─ grid: 1/2/3カラム (gap-6)
  │       └─ [6件] motion.article (fade-up, stagger 0.1s)
  │           └─ Link → 各詳細ページ
  │               ├─ [募集中バッジ] (org && is_recruiting の場合)
  │               │   └─ bg-purple-500, UserPlus icon
  │               ├─ タイプバッジ + 経過時間
  │               │   └─ {icon} {label} | formatDistanceToNow
  │               ├─ H3: タイトル (line-clamp-2)
  │               └─ P: 要約 (line-clamp-2, stripHtml)
```

### タイプ別カラー

| タイプ | ラベル | アイコン | バッジ色 |
|--------|--------|---------|---------|
| organization | 団体紹介 | Users | bg-apple-red |
| interview | インタビュー | Mic | bg-apple-green |
| grant | 助成金 | Wallet | bg-apple-orange |
| news | お知らせ | Bell | bg-apple-blue |

### カードスタイル
- テキストのみ（画像なし）
- `p-6 bg-card rounded-2xl shadow-md`
- ホバー: `shadow-lg, border-primary/20`
- タイトルホバー: `text-primary`

### 依存
- `date-fns`: formatDistanceToNow + ja locale
- `stripHtml`: HTML除去ユーティリティ

---

## セクション3: SearchSection

### 目的
活動分野・エリアからの団体検索を促す。フィルタリングへの導線。

### ファイル
`src/app/(frontend)/_components/SearchSection.tsx`

### データ
```typescript
type Category = { id: string; name: string; slug: string }  // 10件
type Area = { id: string; name: string; slug: string }       // 18件
```

### 構造
```
<section> py-16 sm:py-24
  ├─ container
  │   ├─ motion.div (fade-up, center)
  │   │   ├─ H2: "市民活動を探す"
  │   │   └─ P: 説明文
  │   └─ grid: 1/2カラム (gap-8)
  │       ├─ motion.div (slide-right) 活動分野カード
  │       │   ├─ アイコン (Folder) + H3: "活動分野から探す"
  │       │   ├─ チップ群 (全10件)
  │       │   │   └─ Link → /activities?category={slug}
  │       │   │       └─ px-4 py-2 bg-muted rounded-full
  │       │   │           hover: bg-primary text-primary-foreground
  │       │   └─ Link: "すべての団体を見る" → /activities
  │       └─ motion.div (slide-left) 活動エリアカード
  │           ├─ アイコン (MapPin) + H3: "活動エリアから探す"
  │           ├─ チップ群 (先頭12件)
  │           │   └─ Link → /activities?area={slug}
  │           │       └─ hover: bg-secondary text-secondary-foreground
  │           ├─ [残件数表示] (18件 > 12件の場合: "他 6 エリア")
  │           └─ Link: "すべてのエリアを見る" → /activities
```

### カードスタイル
- `bg-card rounded-3xl p-6 sm:p-8 shadow-lg border-border`
- アイコン: `w-12 h-12 bg-{color}/10 rounded-xl`

### 遷移先
- 各チップ → `/activities?category={slug}` or `/activities?area={slug}`
- フッターリンク → `/activities`

---

## セクション4: PickupOrganizationsSection

### 目的
管理者が選んだ注目団体を大きく紹介。団体詳細への導線。

### ファイル
`src/app/(frontend)/_components/PickupOrganizationsSection.tsx`

### データ
```typescript
type Organization = {
  id: string
  slug: string
  name: string
  short_name: string | null
  summary: string
  main_image_url: string | null
  is_recruiting: boolean | null
  categories: { name: string }[]  // 中間テーブル経由
  areas: { name: string }[]       // 中間テーブル経由
}
```

**最大3件**: `is_published=true AND is_featured=true`

### 構造
```
<section> py-16 sm:py-24
  ├─ container
  │   ├─ motion.div (fade-up)
  │   │   ├─ Users icon (w-10 h-10 bg-primary rounded-xl)
  │   │   ├─ H2: "ピックアップ団体"
  │   │   └─ [desktop] Link: "すべて見る" → /activities
  │   ├─ grid: 1/2/3カラム (gap-6)
  │   │   └─ [3件] motion.article (fade-up, stagger)
  │   │       └─ Link → /activities/{slug}
  │   │           ├─ 画像エリア (w-full h-48)
  │   │           │   ├─ Image (object-cover, hover:scale-105)
  │   │           │   ├─ OR プレースホルダー (Users icon)
  │   │           │   └─ [募集中バッジ] (is_recruiting)
  │   │           └─ コンテンツ (p-5)
  │   │               ├─ H3: short_name || name (line-clamp-1)
  │   │               ├─ バッジ群
  │   │               │   ├─ カテゴリ (最大2件, bg-primary/10)
  │   │               │   └─ エリア (先頭1件, bg-muted, MapPin)
  │   │               └─ P: 概要 (line-clamp-2, stripHtml)
  │   └─ [mobile] Link: "すべての団体を見る" → /activities
```

### 画像仕様
| 項目 | 値 |
|------|-----|
| コンテナ | w-full h-48 (192px), bg-muted |
| 表示方式 | next/image, fill, object-cover |
| ホバー | scale(1.05), transition 300ms |
| フォールバック | Users アイコン (h-16 w-16, text-muted-foreground/30) |

### 条件表示
- `organizations.length === 0` → セクション全体を非表示 (`return null`)
- 「すべて見る」リンク: デスクトップはヘッダー横、モバイルはセクション下部

---

## セクション5: FeaturedInterviewsSection

### 目的
注目インタビュー記事を紹介。ストーリーへの興味を喚起。

### ファイル
`src/app/(frontend)/_components/FeaturedInterviewsSection.tsx`

### データ
```typescript
type Interview = {
  id: string
  slug: string
  title: string
  lead_text: string
  main_image_url: string | null
  organization: { name: string } | null
}
```

**最大4件**: `is_published=true AND is_featured=true`

### 構造
```
<section> py-16 sm:py-24, bg-gradient-to-br from-secondary/5 to-primary/5
  ├─ container
  │   ├─ motion.div (fade-up)
  │   │   ├─ Mic icon (w-10 h-10 bg-secondary rounded-xl)
  │   │   ├─ H2: "おすすめインタビュー"
  │   │   └─ [desktop] Link: "すべて見る" → /interviews
  │   ├─ grid: 1/2カラム (gap-6)
  │   │   └─ [4件] motion.article (fade-up, stagger)
  │   │       └─ Link → /interviews/{slug}
  │   │           └─ flex (col → sm:row) gap-4
  │   │               ├─ 画像 (w-full/sm:w-48, h-48/sm:h-32, rounded-xl)
  │   │               │   ├─ Image (fill, object-cover, hover:scale-105)
  │   │               │   └─ OR プレースホルダー (Mic icon)
  │   │               └─ コンテンツ (flex-1)
  │   │                   ├─ [団体名] text-sm text-secondary
  │   │                   ├─ H3: タイトル (line-clamp-2)
  │   │                   └─ P: リード文 (line-clamp-2)
  │   └─ [mobile] Link: "すべてのインタビューを見る" → /interviews
```

### カードスタイル
- 横長カード: `flex flex-col sm:flex-row`
- `p-4 bg-card rounded-2xl shadow-md`
- ホバー: `shadow-lg, border-secondary/20`
- タイトルホバー: `text-secondary`

### レスポンシブ
| 画面 | カード | 画像 |
|------|--------|------|
| モバイル | 縦並び (1列) | w-full h-48 |
| sm | 横並びカード | w-48 h-32 |
| lg | 2列グリッド | w-48 h-32 |

---

## セクション6: CTASection

### 目的
ページ末尾で行動を促す。団体探し・FAQ への最終導線。

### ファイル
`src/app/(frontend)/_components/CTASection.tsx`

### 構造
```
<section> py-16 sm:py-24
  └─ container
      └─ motion.div (scale-in)
          └─ カード: rounded-3xl p-8 sm:p-12, gradient背景
              ├─ 背景装飾 (2つの白 blur circle)
              ├─ H2: "市民活動に参加してみませんか？"
              ├─ P: 説明文 (max-w-2xl)
              └─ ボタン群 (col → sm:row)
                  ├─ Primary: "団体を探す" → /activities
                  │   └─ bg-white text-primary rounded-full
                  └─ Secondary: "よくある質問" → /faq
                      └─ bg-white/20 text-white rounded-full backdrop-blur-sm
```

### グラデーション
```css
bg-gradient-to-br from-primary via-primary to-secondary
```

### Props
なし（完全静的コンポーネント）

---

## Header / Footer 仕様

### Header

| 項目 | 値 |
|------|-----|
| 配置 | sticky top-0 z-50 |
| 背景 | bg-background/95 backdrop-blur (supports対応) |
| 高さ | h-16 (64px) |
| ナビ項目 | 7リンク（トップ、市民活動紹介、団体インタビュー、助成金情報、お知らせ、よくある質問、サイトについて） |
| アクティブ状態 | bg-primary text-primary-foreground rounded-full shadow-md |
| モバイルメニュー | AnimatePresence、height:0→auto、stagger表示 |
| ブレークポイント | lg (1024px) でハンバーガー/フルナビ切替 |

### Footer

| 項目 | 値 |
|------|-----|
| 背景 | bg-foreground (ダーク) |
| テキスト | text-background |
| レイアウト | 3カラムグリッド (md以上) |
| セクション1 | ロゴ + サイト説明 |
| セクション2 | ナビゲーション (2列: コンテンツ4件 + サイト情報3件) |
| セクション3 | お問い合わせ + 飯田市役所リンク |
| コピーライト | border-t, text-background/60 |

---

## データフロー図

```
page.tsx (Server Component)
  │
  ├─ Promise.all([5クエリ])
  │   ├─ getLatestArticles()         → organizations(3) + interviews(2) + grants(2) + news(2) → sort → 6件
  │   ├─ getCategories()             → activity_categories(10件, sort_order順)
  │   ├─ getAreas()                  → activity_areas(18件, sort_order順)
  │   ├─ getFeaturedInterviews()     → interviews(max 4, is_featured + is_published)
  │   └─ getPickupOrganizations()    → organizations(max 3, is_featured + is_published)
  │                                      └─ + organization_categories + organization_areas (並列)
  │
  └─ レンダリング
      ├─ <HeroSection />                              (props なし)
      ├─ <LatestArticlesSection articles={...} />     (Article[])
      ├─ <SearchSection categories={...} areas={...}  (Category[], Area[])
      ├─ <PickupOrganizationsSection organizations={...} />  (Organization[])
      ├─ <FeaturedInterviewsSection interviews={...} />      (Interview[])
      └─ <CTASection />                               (props なし)
```

---

## パフォーマンス特性

| 項目 | 現状 |
|------|------|
| ISR | revalidate = 60 |
| サーバーデータ取得 | 5クエリ並列 (Promise.all) |
| Client Component数 | 6/6 (全セクション use client) |
| バンドル影響 | framer-motion (全セクション), date-fns (新着のみ), next/image (2セクション) |
| 画像最適化 | next/image + Supabase Storage CDN |
| アニメーション | whileInView + viewport:once (一度だけ発火) |

---

## 改善余地メモ

### UI/UX
1. Hero に写真やイラストがなく、テキスト中心でインパクトが弱い
2. 新着情報カードに画像がない（他セクションとの視覚的統一感不足）
3. 検索セクションのエリアチップが12/18件で中途半端な表示
4. ピックアップ団体が0件の場合、セクションが消えてレイアウトが飛ぶ
5. インタビューカードのモバイル表示が縦長になりすぎる
6. CTAの文言がやや汎用的（ターゲットに響く具体性が不足）

### 技術
1. 全セクション Client Component → Server Component + 部分的 Client 化の余地
2. framer-motion の viewport アニメーションは IntersectionObserver で代替可能（バンドル削減）
3. 新着情報の date-fns 依存は Intl.RelativeTimeFormat で代替可能
4. ピックアップ団体の categories/areas 取得が N+1 的（改善済みだが join に変更可能）
