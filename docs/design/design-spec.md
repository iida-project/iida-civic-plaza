# トップページ デザイン仕様書

> 最終更新: 2026-03-09
> トップページのデザイン変更における全体方針・ビジュアル仕様を定義

---

## 1. 現状のデザイン概要

### カラーパレット

| 名前 | HSL (Light) | HEX | 用途 |
|------|-------------|-----|------|
| Primary | 4 72% 56% | #E25555 | メインアクション、りんご赤 |
| Secondary | 140 45% 55% | #5DB075 | サブアクション、緑 |
| Accent | 36 90% 60% | #F5A623 | 強調、オレンジ |
| Apple Blue | 207 70% 59% | #4A9FD9 | お知らせバッジ |
| Apple Red | 4 72% 56% | #E25555 | 団体紹介バッジ |
| Apple Green | 140 45% 55% | #5DB075 | インタビューバッジ |
| Apple Orange | 36 90% 60% | #F5A623 | 助成金バッジ |

### タイポグラフィ

| 要素 | サイズ | ウェイト | 備考 |
|------|--------|---------|------|
| H1（Hero） | text-4xl → lg:text-6xl | bold | leading-tight |
| H2（セクション見出し） | text-2xl → sm:text-3xl | bold | - |
| H3（カードタイトル） | text-lg | semibold | line-clamp-1〜2 |
| 本文 | text-sm〜text-lg | normal | text-foreground/70〜80 |
| バッジ | text-xs | medium/bold | - |

### 角丸（border-radius）

| 要素 | 値 |
|------|-----|
| カード | rounded-2xl (16px) |
| ボタン（CTA） | rounded-full (pill) |
| 検索パネル | rounded-3xl (24px) |
| バッジ | rounded-full (pill) / rounded-sm |
| 画像コンテナ | rounded-xl (12px) |

### シャドウ

| 要素 | 値 | ホバー |
|------|-----|--------|
| カード | shadow-md | shadow-lg |
| CTAボタン | shadow-lg | shadow-xl |
| 検索パネル | shadow-lg | - |

### アニメーション

| 種別 | ライブラリ | 設定 |
|------|-----------|------|
| 表示アニメーション | Framer Motion | opacity: 0→1, y: 20→0, duration: 0.5 |
| スタガード | Framer Motion | delay: index * 0.1 |
| 画像ホバー | CSS | scale(1.05), duration-300 |
| ボタンホバー | CSS | translate-x-1 (矢印), bg opacity変化 |

### レスポンシブブレークポイント

| ブレークポイント | 幅 | 主な変化 |
|----------------|-----|---------|
| default (モバイル) | < 640px | 1カラム、ハンバーガーメニュー |
| sm | ≥ 640px | ボタン横並び、レイアウト微調整 |
| md | ≥ 768px | 2カラムグリッド |
| lg | ≥ 1024px | 3カラムグリッド、フルナビゲーション |

---

## 2. 現状のレイアウト構成

```
[Header] sticky, backdrop-blur
  ├─ ロゴ + サイト名
  └─ ナビゲーション（7リンク）

[HeroSection]
  ├─ 背景装飾（3つの blur circle）
  ├─ H1: 飯田の市民活動ひろば
  ├─ サブテキスト
  └─ CTA 2ボタン（活動団体を探す / インタビューを読む）

[LatestArticlesSection] bg-muted/30
  ├─ H2: 新着情報
  └─ 3x2 グリッド（6件、4種類混合、時系列順）

[SearchSection]
  ├─ H2: 市民活動を探す
  └─ 2カラム（活動分野チップ / 活動エリアチップ）

[PickupOrganizationsSection]
  ├─ H2: ピックアップ団体 + すべて見るリンク
  └─ 3カラムカード（画像 + 名前 + カテゴリ + エリア + 概要）

[FeaturedInterviewsSection] bg-gradient
  ├─ H2: おすすめインタビュー + すべて見るリンク
  └─ 2カラム（横長カード: 画像 + 団体名 + タイトル + リード文）

[CTASection]
  └─ グラデーション背景の行動喚起カード

[Footer] bg-foreground
  ├─ サイト情報
  ├─ ナビゲーション（2列）
  ├─ お問い合わせ
  └─ コピーライト
```

---

## 3. コンポーネント一覧と依存関係

### コンポーネントファイル

| ファイル | 種別 | 'use client' | 依存ライブラリ |
|---------|------|-------------|---------------|
| `page.tsx` | Server Component | No | supabase/public |
| `HeroSection.tsx` | Client Component | Yes | framer-motion, lucide |
| `LatestArticlesSection.tsx` | Client Component | Yes | framer-motion, lucide, date-fns |
| `SearchSection.tsx` | Client Component | Yes | framer-motion, lucide |
| `PickupOrganizationsSection.tsx` | Client Component | Yes | framer-motion, lucide, next/image |
| `FeaturedInterviewsSection.tsx` | Client Component | Yes | framer-motion, lucide, next/image |
| `CTASection.tsx` | Client Component | Yes | framer-motion, lucide |

### データ取得（page.tsx - Server Component）

```
Promise.all([
  getLatestArticles()         → Article[] (6件: org3 + interview2 + grant2 + news2 → 時系列ソート)
  getCategories()             → Category[] (10件: activity_categories)
  getAreas()                  → Area[] (18件: activity_areas)
  getFeaturedInterviews()     → Interview[] (最大4件: is_featured=true)
  getPickupOrganizations()    → Organization[] (最大3件: is_featured=true + categories/areas)
])
```

---

## 4. デザイントークン

### 背景パターン

| セクション | 背景 |
|-----------|------|
| Hero | 透明 + blur circles (primary/10, secondary/10, accent/5) |
| 新着情報 | bg-muted/30 |
| 検索 | 透明 |
| ピックアップ | 透明 |
| インタビュー | bg-gradient-to-br from-secondary/5 to-primary/5 |
| CTA | bg-gradient-to-br from-primary via-primary to-secondary |

### コンテナ幅

```css
container mx-auto px-4 sm:px-6 lg:px-8
/* max-width は Tailwind デフォルト: sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px */
```

### セクション間隔

```css
py-16 sm:py-24    /* 大セクション: 64px → 96px */
lg:py-32          /* Hero のみ追加: → 128px */
```

---

## 5. インタラクション仕様

### カード

| 状態 | スタイル |
|------|---------|
| デフォルト | shadow-md, border-transparent |
| ホバー | shadow-lg, border-primary/20（or secondary/20） |
| 画像ホバー | scale(1.05), transition-transform duration-300 |
| タイトルホバー | text-primary（or text-secondary） |

### ボタン

| 種別 | デフォルト | ホバー |
|------|----------|--------|
| Primary CTA | bg-primary, shadow-lg | bg-primary/90, shadow-xl |
| Secondary CTA | bg-card, border-border, shadow-md | bg-muted, shadow-lg |
| テキストリンク | text-primary | underline |
| チップフィルター | bg-muted | bg-primary text-primary-foreground |

### バッジ

| 種別 | スタイル |
|------|---------|
| カテゴリタイプ | bg-{color} text-white rounded-full (アイコン付き) |
| 会員募集中 | bg-purple-500 text-white rounded-sm, ring-2 ring-white |
| カテゴリ（カード内） | bg-primary/10 text-primary rounded-full |
| エリア（カード内） | bg-muted text-muted-foreground rounded-full (MapPin付き) |

---

## 6. 画像仕様

### カード内画像

| 要素 | サイズ | 表示方式 |
|------|--------|---------|
| ピックアップ団体 | w-full h-48 | object-cover, Image fill |
| インタビュー | sm:w-48 h-48 sm:h-32 | object-cover, Image fill |
| 画像なし | 同上 | アイコンプレースホルダー (text-muted-foreground/30) |

### ロゴ

| 場所 | サイズ |
|------|--------|
| Header | 40x40px |
| Footer | テキストアイコン (w-10 h-10 グラデーション円) |

---

## 7. ダークモード対応

CSS変数でライト/ダーク切替対応済み:
- `prefers-color-scheme: dark` でダークテーマ適用
- Primary/Secondary は明度を若干調整
- カード背景、テキスト色は自動反転

---

## 8. 改善検討ポイント

以下は現状のデザインで検討すべき点:

1. **Hero セクション**: テキストのみで画像・イラストがない。ビジュアルインパクトが弱い
2. **新着情報**: 画像なしのテキストカードのみ。他セクションと比べて視覚的に弱い
3. **検索セクション**: チップが多く、特にエリア（18件）は情報過多の可能性
4. **セクション間の視覚的リズム**: 背景色の切替パターンが不規則
5. **モバイルでのCTA配置**: Hero の2ボタンが縦並びになり冗長
6. **ファーストビュー**: Hero のみでコンテンツが見えない可能性
7. **全セクション use client**: アニメーション依存でServer Componentの利点が薄い
