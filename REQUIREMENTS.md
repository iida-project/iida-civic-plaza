# 飯田の市民活動ひろば 要件定義・システム設計書

> **バージョン**: v1.0  
> **最終更新**: 2025 年 5 月  
> **用途**: Claude Code バイブコーディング用

---

## 目次

### Part 1: 要件定義

- [1. プロジェクト概要](#1-プロジェクト概要)
- [2. 目的・ゴール](#2-目的ゴール)
- [3. 想定ユーザー・利用シーン](#3-想定ユーザー利用シーン)
- [4. コンテンツ要件](#4-コンテンツ要件)
- [5. 情報設計（ナビゲーション・ページ構成）](#5-情報設計ナビゲーションページ構成)
- [6. 投稿・運用フロー](#6-投稿運用フロー)
- [7. デザイン・UI/UX](#7-デザインuiux)
- [8. 検索・フィルタ機能](#8-検索フィルタ機能)

### Part 2: システム設計

- [9. 技術スタック・アーキテクチャ](#9-技術スタックアーキテクチャ)
- [10. Payload CMS コレクション設計](#10-payload-cms-コレクション設計)
- [11. Supabase データベース設計](#11-supabase-データベース設計)
- [12. Supabase 同期フック](#12-supabase-同期フック)
- [13. ルーティング設計](#13-ルーティング設計)
- [14. 認証・権限](#14-認証権限)
- [15. 非機能要件](#15-非機能要件)
- [16. 環境変数](#16-環境変数)
- [17. 将来拡張（Phase2 以降）](#17-将来拡張phase2-以降)

---

# Part 1: 要件定義

---

## 1. プロジェクト概要

### 1-1. 基本情報

| 項目         | 内容                                                      |
| ------------ | --------------------------------------------------------- |
| サイト名     | **飯田の市民活動ひろば**                                  |
| 構築方式     | Next.js 15（App Router）+ Payload CMS + Supabase + Vercel |
| 想定公開時期 | 未定（別途スケジュール策定）                              |

### 1-2. 担当

| 役割             | 担当              |
| ---------------- | ----------------- |
| コンテンツ作成   | 市側ライター 1 名 |
| サイト管理・開発 | ほほ笑みラボ      |

### 1-3. 既存媒体との関係

- 現時点で、既存パンフレットや他サイトとの明確な役割分担は未定
- 将来的に、紙媒体・既存広報との連携が必要な場合は別途検討

---

## 2. 目的・ゴール

### 2-1. 最重要目的

- 飯田市内の **NPO・市民活動の「見える化」** を実現する
- 単に団体数を増やすのではなく、「質の高い活動」が増える土台をつくる

### 2-2. 1 年後に目指す状態（定性的ゴール）

1. **活動の可視化**

   - 「活動しているのかよく分からない団体」が減る
   - 活動内容・頻度・参加方法が外から見て分かる状態になる

2. **市民参加の促進**

   - 質の高い取り組み・継続的な活動が可視化される
   - それを見た市民がイベント・学びの場に参加しやすくなる

3. **イメージ刷新**

   - 若い世代も興味を持ちやすい、魅力的な市民活動のイメージを発信できている

4. **対外的な評価**
   - 他自治体から見ても「飯田市は市民活動の情報発信が進んでいる」と認識される

### 2-3. 技術的な位置づけ

- **Next.js** を採用し、従来の「古い行政サイト」とは異なる現代的なサイトを構築
- 心地よい UI/UX を備え、アート寄りのデザインを打ち出す

---

## 3. 想定ユーザー・利用シーン

### 3-1. 主なユーザーと目的

| ユーザー              | 目的                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **市民**              | 週末や空いた時間に参加できる活動を探したい。どんな団体があり、どんな雰囲気なのかを知りたい                             |
| **NPO・市民活動団体** | 自分たちの活動内容・実績をわかりやすく紹介したい。助成金情報や他団体の事例を参考にしたい                               |
| **飯田市役所職員**    | 市民活動の状況を把握し、市民からの問い合わせに答えられるようにしたい。助成金情報・事例を整理し、施策検討の参考にしたい |
| **他自治体の担当者**  | 飯田市の市民活動・NPO の取り組み事例を参考にしたい                                                                     |

### 3-2. 利用環境

| 項目         | 内容                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| デバイス比率 | スマホ : PC ≒ **5 : 5**（半々程度）を想定                                                |
| 高齢者対応   | 初期段階では特別な機能（文字サイズ切替など）は設けず、実運用での様子を見ながら検討・追加 |

---

## 4. コンテンツ要件

### 4-1. 記事種別（Phase1）

| 種別                             | 説明                                         |
| -------------------------------- | -------------------------------------------- |
| **市民活動紹介（NPO 団体紹介）** | 団体の基本情報・活動内容・参加方法などを紹介 |
| **市民活動ロングインタビュー**   | 約 10,000 字の詳細なインタビュー記事         |
| **助成金情報**                   | 募集中の助成金・補助金情報                   |
| **お知らせ**                     | サイトからのお知らせ・更新情報               |
| **FAQ**                          | よくある質問と回答                           |
| **サイトについて**               | コンセプト・運営主体の説明                   |

※お問い合わせは、すべて「市役所のお問い合わせページ」へのリンクで対応

### 4-2. 市民活動紹介（NPO 団体）

#### 必須項目

| 項目             | 説明                                     |
| ---------------- | ---------------------------------------- |
| 団体名           | 正式名 + 略称                            |
| 活動分野         | 子ども / 福祉 / 環境 / 文化 など         |
| 活動エリア       | 市内全域 / 地区名 / オンライン 等        |
| 団体概要         | 目安：300〜400 字                        |
| 代表者名・連絡先 | 公開前提（メール / 電話 / フォームなど） |
| HP・SNS リンク   | 公式サイト、Facebook、X、Instagram など  |
| 参加方法         | 問い合わせ先、参加条件、活動頻度 など    |
| 活動写真         | 目安 4〜5 枚（団体により変動）           |
| タグ             | キーワード                               |

### 4-3. 市民活動ロングインタビュー

#### 想定構成

- リード文
- 見出し 1〜3 + 本文（構成は柔軟）
- 写真（人物・活動風景等）
- プロフィールブロック（団体・個人）
- 関連記事リンク（同団体の紹介記事 / 助成金事例 等）

#### 文字数目安

- 約 **10,000 字** の長文インタビューを想定

### 4-4. 助成金情報

#### 必須項目

| 項目         | 説明                                     |
| ------------ | ---------------------------------------- |
| 助成金名     | 正式名称                                 |
| 実施主体     | 市 / 県 / 民間財団 など                  |
| 募集期間     | 開始日・締切日                           |
| 対象団体     | NPO 法人 / 任意団体 / 個人 など          |
| 対象事業     | 分野・テーマ                             |
| 補助金額     | 上限・下限                               |
| 申請方法     | リンク・書式 DL など                     |
| お問い合わせ | 市役所のお問い合わせページへの統一リンク |

#### 任意・検討中

- 過去の採択事例へのリンク（Phase2 以降に検討）

---

## 5. 情報設計（ナビゲーション・ページ構成）

### 5-1. メインメニュー

| メニュー         | パス          | 説明                   |
| ---------------- | ------------- | ---------------------- |
| トップ           | `/`           | トップページ           |
| 市民活動紹介     | `/activities` | 団体一覧・詳細         |
| 団体インタビュー | `/interviews` | インタビュー一覧・詳細 |
| 助成金情報       | `/grants`     | 助成金一覧・詳細       |
| お知らせ         | `/news`       | お知らせ一覧・詳細     |
| よくある質問     | `/faq`        | FAQ                    |
| サイトについて   | `/about`      | コンセプト・運営主体   |

### 5-2. トップページで目立たせる要素

1. **新着記事一覧**（市民活動紹介・インタビュー・助成金・お知らせを横断）
2. **「市民活動を探す」エリア**（カテゴリ・エリアでの絞り込み）
3. **ピックアップ団体 / 特集記事**
4. **インタビューのおすすめ記事**（サブ要素）

### 5-3. 記事一覧ページの絞り込み

#### 共通の絞り込み（Phase1）

- 活動分野で絞り込み
- 活動エリアで絞り込み

#### 助成金一覧に特有のソート・フィルタ（Phase1）

- 新着順
- 締切が近い順
- 応募受付中のみ表示
- 対象団体（NPO 法人 / 任意団体 / 個人 等）

---

## 6. 投稿・運用フロー

### 6-1. 投稿者・権限

| 役割     | 担当            | 権限                       |
| -------- | --------------- | -------------------------- |
| ライター | 市側担当者 1 名 | 記事の作成・編集・公開     |
| 管理者   | ほほ笑みラボ    | 全権限（ユーザー管理含む） |

### 6-2. 運用方針

| 項目       | 内容                                              |
| ---------- | ------------------------------------------------- |
| 更新頻度   | 月に多くて 2 本程度                               |
| 承認フロー | なし（投稿状態は「公開 / 非公開」のシンプル設計） |
| 予約投稿   | 不要                                              |
| 編集履歴   | 不要（Phase1）                                    |

### 6-3. 投稿エディタ

- **Payload CMS** の管理画面を使用
- ライターはエンジニアではないため、管理画面からログイン → 記事作成・プレビュー → 公開のシンプルな運用
- リッチテキストエディタ（Lexical）で画像挿入・見出し・リンクなどに対応

---

## 7. デザイン・UI/UX

### 7-1. 全体コンセプト

#### 印象ワード（3 つ）

1. 親しみやすい
2. 信頼感
3. わくわく感

#### デザインキーワード

- コンテンポラリーで現代的 + 少しアート寄り
- 未来的なモダン
- 暖色系のカラーパレット
- 多めの曲線・柔らかい雰囲気

#### バランス

- 行政的フォーマルさ : アート寄り = **3 : 7**（アート寄り 70%）

#### 参考サイト

- https://demo.swell-theme.com/demo02/
- ベースは読みやすいブログ構成、そこにアート寄りのアクセントを加える

### 7-2. ビジュアル

| 項目             | 内容                                                                                |
| ---------------- | ----------------------------------------------------------------------------------- |
| 写真・ビジュアル | コラージュ風・少しアート寄りの表現をベースに、団体の実写写真も組み合わせる          |
| ロゴ             | 「飯田の市民活動ひろば」用に新規ロゴを作成。テキストロゴ + アイコンのシンプルな構成 |

### 7-3. アニメーション・モーション

- **Framer Motion** を使用
- スクロール時の軽いモーション（セクションのフェードイン・スライドイン）
- カードのホバー時のわずかな浮き上がり
- 読みやすさ・使いやすさを損なわない範囲に留める

---

## 8. 検索・フィルタ機能

### 8-1. Phase1（初期リリース）

一覧ページでのシンプルなフィルタリングのみ実装。

#### 市民活動一覧

- 活動分野で絞り込み
- 活動エリアで絞り込み

#### 助成金一覧

- 応募受付中のみ表示（`application_end_date >= today`）
- 締切が近い順ソート
- 対象団体種別での絞り込み

### 8-2. Phase2（将来拡張）

- キーワード検索（Supabase Full-Text Search）
- タグ検索
- 複合条件での絞り込み

---

# Part 2: システム設計

---

## 9. 技術スタック・アーキテクチャ

### 9-1. 技術スタック

| 区分                   | 技術                                   | 用途                             |
| ---------------------- | -------------------------------------- | -------------------------------- |
| フロントエンド         | Next.js 15（App Router）               | 公開サイト・管理画面             |
| 言語                   | TypeScript                             | 型安全な開発                     |
| スタイリング           | Tailwind CSS                           | ユーティリティファースト CSS     |
| アニメーション         | Framer Motion                          | スクロール・ホバーモーション     |
| UI ライブラリ          | shadcn/ui, Lucide Icons                | コンポーネント・アイコン         |
| CMS                    | Payload CMS 3.x                        | 管理画面・リッチテキストエディタ |
| データベース（表示用） | Supabase（PostgreSQL）                 | フロントエンド表示・検索         |
| データベース（CMS 用） | PostgreSQL（Payload 内蔵 or Supabase） | CMS 内部データ・下書き・履歴     |
| ストレージ             | Supabase Storage                       | 画像・メディアファイル           |
| 認証                   | Payload Auth                           | 管理画面ログイン                 |
| SEO                    | next-seo + 動的 OGP                    | 検索エンジン最適化               |
| ホスティング           | Vercel（ISR 構成）                     | 高速配信・自動デプロイ           |

### 9-2. アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js 15 App                          │
├─────────────────────────────────┬───────────────────────────────┤
│         公開サイト              │         管理画面              │
│    (静的生成 + ISR)             │      (Payload CMS)            │
│                                 │                               │
│  /                  トップ      │  /admin           ダッシュボード│
│  /activities        団体一覧    │  /admin/collections/...       │
│  /activities/[slug] 団体詳細    │                               │
│  /interviews        記事一覧    │                               │
│  /grants            助成金一覧  │                               │
│  /news              お知らせ    │                               │
└────────────┬────────────────────┴───────────────┬───────────────┘
             │                                    │
             │ データ取得                          │ 記事作成・編集
             ▼                                    ▼
┌─────────────────────────┐          ┌─────────────────────────┐
│      Supabase           │◀─────────│     Payload CMS         │
│    （表示用DB）          │  同期     │   （編集用DB）           │
│                         │  フック   │                         │
│  - organizations        │          │  - Organizations        │
│  - interviews           │          │  - Interviews           │
│  - grants               │          │  - Grants               │
│  - news_posts           │          │  - News                 │
│  - activity_categories  │          │  - ActivityCategories   │
│  - activity_areas       │          │  - ActivityAreas        │
│  - tags                 │          │  - Tags                 │
│  - faqs                 │          │  - FAQs                 │
└────────────┬────────────┘          │  - Users                │
             │                        │  - Media                │
             │                        └─────────────────────────┘
             ▼
┌─────────────────────────┐
│   Supabase Storage      │
│    （画像ストレージ）     │
└─────────────────────────┘
```

### 9-3. データフロー

```
ライター
  │
  │ ログイン・記事作成
  ▼
Payload CMS 管理画面
  │
  │ 保存（下書き or 公開）
  ▼
┌─────────────────────────────────────────┐
│  下書き → Payload DB のみに保存          │
│  公開   → afterChange フックで同期       │
└─────────────────────────────────────────┘
  │
  │ 公開時のみ
  ▼
Supabase（PostgreSQL + Storage）
  │
  │ ISR で自動反映
  ▼
公開サイト（フロントエンド）
```

---

## 10. Payload CMS コレクション設計

### 10-1. コレクション一覧

| コレクション名      | 日本語名     | 説明               | Supabase 同期 |
| ------------------- | ------------ | ------------------ | ------------- |
| organizations       | 市民活動団体 | NPO 団体紹介       | ✅            |
| interviews          | インタビュー | ロングインタビュー | ✅            |
| grants              | 助成金       | 助成金情報         | ✅            |
| news                | お知らせ     | お知らせ           | ✅            |
| activity-categories | 活動分野     | 分野マスター       | ✅            |
| activity-areas      | 活動エリア   | エリアマスター     | ✅            |
| tags                | タグ         | タグマスター       | ✅            |
| faqs                | FAQ          | よくある質問       | ✅            |
| users               | ユーザー     | 管理ユーザー       | ❌            |
| media               | メディア     | 画像・ファイル     | ✅（Storage） |

### 10-2. Organizations コレクション（市民活動紹介）

```typescript
{
  slug: 'organizations',
  labels: {
    singular: '市民活動団体',
    plural: '市民活動団体',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'updatedAt'],
  },
  fields: [
    // === 基本情報 ===
    {
      name: 'name',
      label: '団体名（正式）',
      type: 'text',
      required: true,
    },
    {
      name: 'shortName',
      label: '略称',
      type: 'text',
    },
    {
      name: 'slug',
      label: 'スラッグ',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'summary',
      label: '団体概要',
      type: 'textarea',
      required: true,
      admin: { description: '300〜400字程度' },
    },

    // === 分類 ===
    {
      name: 'categories',
      label: '活動分野',
      type: 'relationship',
      relationTo: 'activity-categories',
      hasMany: true,
    },
    {
      name: 'areas',
      label: '活動エリア',
      type: 'relationship',
      relationTo: 'activity-areas',
      hasMany: true,
    },
    {
      name: 'tags',
      label: 'タグ',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    // === 連絡先 ===
    {
      name: 'contact',
      label: '連絡先情報',
      type: 'group',
      fields: [
        { name: 'representativeName', label: '代表者名', type: 'text' },
        { name: 'email', label: 'メールアドレス', type: 'email' },
        { name: 'phone', label: '電話番号', type: 'text' },
      ],
    },

    // === SNS・リンク ===
    {
      name: 'links',
      label: '外部リンク',
      type: 'group',
      fields: [
        { name: 'website', label: '公式サイト', type: 'text' },
        { name: 'facebook', label: 'Facebook', type: 'text' },
        { name: 'twitter', label: 'X (Twitter)', type: 'text' },
        { name: 'instagram', label: 'Instagram', type: 'text' },
      ],
    },

    // === 参加情報 ===
    {
      name: 'participationInfo',
      label: '参加方法',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
        ],
      }),
    },

    // === 画像 ===
    {
      name: 'mainImage',
      label: 'メイン画像',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'galleryImages',
      label: 'ギャラリー画像',
      type: 'array',
      maxRows: 5,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', label: 'キャプション', type: 'text' },
      ],
    },

    // === 公開設定 ===
    {
      name: 'status',
      label: 'ステータス',
      type: 'select',
      options: [
        { label: '下書き', value: 'draft' },
        { label: '公開', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: '公開日時',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [syncToSupabase],
  },
}
```

### 10-3. Interviews コレクション（ロングインタビュー）

```typescript
{
  slug: 'interviews',
  labels: {
    singular: 'インタビュー',
    plural: 'インタビュー',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'タイトル',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'スラッグ',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'leadText',
      label: 'リード文',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      label: '本文',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          ImageFeature(),
          LinkFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
      admin: { description: '約10,000字のロングインタビュー' },
    },
    {
      name: 'mainImage',
      label: 'メイン画像',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'galleryImages',
      label: 'ギャラリー画像',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'caption', label: 'キャプション', type: 'text' },
      ],
    },
    {
      name: 'relatedOrganization',
      label: '関連団体',
      type: 'relationship',
      relationTo: 'organizations',
    },
    {
      name: 'isFeatured',
      label: 'ピックアップ',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      label: 'ステータス',
      type: 'select',
      options: [
        { label: '下書き', value: 'draft' },
        { label: '公開', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: '公開日時',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [syncToSupabase],
  },
}
```

### 10-4. Grants コレクション（助成金情報）

```typescript
{
  slug: 'grants',
  labels: {
    singular: '助成金',
    plural: '助成金',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: '助成金名',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'スラッグ',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'providerName',
      label: '実施主体',
      type: 'text',
      required: true,
      admin: { description: '市 / 県 / 民間財団 など' },
    },
    {
      name: 'description',
      label: '概要',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          LinkFeature(),
        ],
      }),
    },

    // === 募集期間 ===
    {
      name: 'applicationPeriod',
      label: '募集期間',
      type: 'group',
      fields: [
        { name: 'startDate', label: '開始日', type: 'date' },
        { name: 'endDate', label: '締切日', type: 'date', required: true },
      ],
    },

    // === 対象 ===
    {
      name: 'targetOrganizations',
      label: '対象団体',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'NPO法人', value: 'npo' },
        { label: '任意団体', value: 'voluntary' },
        { label: '個人', value: 'individual' },
        { label: '自治会', value: 'community' },
        { label: 'その他', value: 'other' },
      ],
    },
    {
      name: 'targetFields',
      label: '対象分野',
      type: 'relationship',
      relationTo: 'activity-categories',
      hasMany: true,
    },

    // === 補助金額 ===
    {
      name: 'subsidyAmount',
      label: '補助金額',
      type: 'group',
      fields: [
        { name: 'minAmount', label: '下限（円）', type: 'number' },
        { name: 'maxAmount', label: '上限（円）', type: 'number' },
      ],
    },

    // === リンク ===
    {
      name: 'applyUrl',
      label: '申請URL',
      type: 'text',
    },
    {
      name: 'guidelinesFile',
      label: '要項PDF',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactUrl',
      label: 'お問い合わせURL',
      type: 'text',
      defaultValue: 'https://www.city.iida.lg.jp/contact/',
      admin: { description: '基本は市役所のお問い合わせページ' },
    },

    // === 公開設定 ===
    {
      name: 'status',
      label: 'ステータス',
      type: 'select',
      options: [
        { label: '下書き', value: 'draft' },
        { label: '公開', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: '公開日時',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [syncToSupabase],
  },
}
```

### 10-5. News コレクション（お知らせ）

```typescript
{
  slug: 'news',
  labels: {
    singular: 'お知らせ',
    plural: 'お知らせ',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'タイトル',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'スラッグ',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'body',
      label: '本文',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          LinkFeature(),
        ],
      }),
    },
    {
      name: 'status',
      label: 'ステータス',
      type: 'select',
      options: [
        { label: '下書き', value: 'draft' },
        { label: '公開', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: '公開日時',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [syncToSupabase],
  },
}
```

### 10-6. マスターデータ コレクション

#### ActivityCategories（活動分野）

```typescript
{
  slug: 'activity-categories',
  labels: { singular: '活動分野', plural: '活動分野' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', label: '分野名', type: 'text', required: true },
    { name: 'slug', label: 'スラッグ', type: 'text', unique: true },
    { name: 'sortOrder', label: '表示順', type: 'number', defaultValue: 0 },
  ],
  hooks: { afterChange: [syncToSupabase] },
}
```

#### ActivityAreas（活動エリア）

```typescript
{
  slug: 'activity-areas',
  labels: { singular: '活動エリア', plural: '活動エリア' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', label: 'エリア名', type: 'text', required: true },
    { name: 'slug', label: 'スラッグ', type: 'text', unique: true },
    { name: 'sortOrder', label: '表示順', type: 'number', defaultValue: 0 },
  ],
  hooks: { afterChange: [syncToSupabase] },
}
```

#### Tags（タグ）

```typescript
{
  slug: 'tags',
  labels: { singular: 'タグ', plural: 'タグ' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', label: 'タグ名', type: 'text', required: true },
    { name: 'slug', label: 'スラッグ', type: 'text', unique: true },
  ],
  hooks: { afterChange: [syncToSupabase] },
}
```

#### FAQs（よくある質問）

```typescript
{
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  admin: { useAsTitle: 'question' },
  fields: [
    { name: 'question', label: '質問', type: 'text', required: true },
    {
      name: 'answer',
      label: '回答',
      type: 'richText',
      required: true,
    },
    { name: 'sortOrder', label: '表示順', type: 'number', defaultValue: 0 },
    { name: 'isPublished', label: '公開', type: 'checkbox', defaultValue: true },
  ],
  hooks: { afterChange: [syncToSupabase] },
}
```

### 10-7. Media コレクション

```typescript
{
  slug: 'media',
  labels: { singular: 'メディア', plural: 'メディア' },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    { name: 'alt', label: '代替テキスト', type: 'text' },
    { name: 'caption', label: 'キャプション', type: 'text' },
  ],
  hooks: {
    afterChange: [uploadToSupabaseStorage],
  },
}
```

### 10-8. Users コレクション

```typescript
{
  slug: 'users',
  labels: { singular: 'ユーザー', plural: 'ユーザー' },
  auth: true,
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', label: '名前', type: 'text', required: true },
    {
      name: 'role',
      label: '権限',
      type: 'select',
      options: [
        { label: '管理者', value: 'admin' },
        { label: 'ライター', value: 'writer' },
      ],
      defaultValue: 'writer',
      required: true,
    },
  ],
}
```

---

## 11. Supabase データベース設計

### 11-1. 設計方針

- Supabase は **フロントエンド表示専用** のデータベースとして使用
- Payload CMS から同期されたデータを格納し、高速なクエリを提供
- 各テーブルに `payload_id` カラムを追加（Payload との紐付け用）
- 公開済みデータのみ同期（下書きは同期しない）
- リレーションは中間テーブルで管理

### 11-2. テーブル定義

#### organizations（市民活動団体）

```sql
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_name text,
  summary text NOT NULL,
  contact_name text,
  contact_email text,
  contact_phone text,
  website_url text,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  participation_info text,
  main_image_url text,
  gallery_images jsonb DEFAULT '[]',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_organizations_published ON organizations(is_published, published_at DESC);
CREATE INDEX idx_organizations_slug ON organizations(slug);
```

#### interviews（ロングインタビュー）

```sql
CREATE TABLE interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  lead_text text NOT NULL,
  body text NOT NULL,
  main_image_url text,
  gallery_images jsonb DEFAULT '[]',
  organization_id uuid REFERENCES organizations(id),
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_interviews_published ON interviews(is_published, published_at DESC);
CREATE INDEX idx_interviews_featured ON interviews(is_featured, is_published);
```

#### grants（助成金）

```sql
CREATE TABLE grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  provider_name text NOT NULL,
  description text,
  application_start_date date,
  application_end_date date NOT NULL,
  target_organizations text[] DEFAULT '{}',
  subsidy_min_amount int,
  subsidy_max_amount int,
  apply_url text,
  guidelines_file_url text,
  contact_url text DEFAULT 'https://www.city.iida.lg.jp/contact/',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_grants_published ON grants(is_published, published_at DESC);
CREATE INDEX idx_grants_deadline ON grants(application_end_date);
```

#### news_posts（お知らせ）

```sql
CREATE TABLE news_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_news_published ON news_posts(is_published, published_at DESC);
```

#### activity_categories（活動分野）

```sql
CREATE TABLE activity_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_categories_sort ON activity_categories(sort_order);
```

#### activity_areas（活動エリア）

```sql
CREATE TABLE activity_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_areas_sort ON activity_areas(sort_order);
```

#### tags（タグ）

```sql
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

#### faqs（よくある質問）

```sql
CREATE TABLE faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_id text UNIQUE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_faqs_published ON faqs(is_published, sort_order);
```

### 11-3. 中間テーブル（リレーション用）

```sql
-- 団体 × 活動分野
CREATE TABLE organization_categories (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  category_id uuid REFERENCES activity_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, category_id)
);

-- 団体 × 活動エリア
CREATE TABLE organization_areas (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  area_id uuid REFERENCES activity_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, area_id)
);

-- 団体 × タグ
CREATE TABLE organization_tags (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, tag_id)
);

-- 助成金 × 対象分野
CREATE TABLE grant_categories (
  grant_id uuid REFERENCES grants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES activity_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (grant_id, category_id)
);
```

---

## 12. Supabase 同期フック

### 12-1. 同期の基本方針

| 項目           | 方針                                |
| -------------- | ----------------------------------- |
| 同期タイミング | `status === 'published'` の場合のみ |
| 削除の扱い     | 論理削除（`is_published = false`）  |
| リッチテキスト | Lexical → HTML に変換して保存       |
| リレーション   | 中間テーブルを都度更新              |

### 12-2. 同期フックの実装例

```typescript
// src/payload/hooks/syncToSupabase.ts

import { createClient } from '@supabase/supabase-js';
import { convertLexicalToHTML } from '../utils/lexicalToHTML';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const syncOrganizationToSupabase = async ({ doc, operation }) => {
  // 公開状態でない場合はSupabaseから論理削除
  if (doc.status !== 'published') {
    await supabase
      .from('organizations')
      .update({ is_published: false })
      .eq('payload_id', doc.id);
    return doc;
  }

  // 公開データの整形
  const data = {
    payload_id: doc.id,
    slug: doc.slug,
    name: doc.name,
    short_name: doc.shortName || null,
    summary: doc.summary,
    contact_name: doc.contact?.representativeName || null,
    contact_email: doc.contact?.email || null,
    contact_phone: doc.contact?.phone || null,
    website_url: doc.links?.website || null,
    facebook_url: doc.links?.facebook || null,
    twitter_url: doc.links?.twitter || null,
    instagram_url: doc.links?.instagram || null,
    participation_info: doc.participationInfo
      ? convertLexicalToHTML(doc.participationInfo)
      : null,
    main_image_url: doc.mainImage?.url || null,
    gallery_images:
      doc.galleryImages?.map((g) => ({
        url: g.image?.url,
        caption: g.caption,
      })) || [],
    is_published: true,
    published_at: doc.publishedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Upsert（存在すれば更新、なければ挿入）
  const { data: org, error } = await supabase
    .from('organizations')
    .upsert(data, { onConflict: 'payload_id' })
    .select()
    .single();

  if (error) {
    console.error('Supabase sync error:', error);
    return doc;
  }

  // リレーションの同期
  await syncOrganizationRelations(org.id, doc);

  return doc;
};

async function syncOrganizationRelations(orgId: string, doc: any) {
  // カテゴリの同期
  await supabase
    .from('organization_categories')
    .delete()
    .eq('organization_id', orgId);

  if (doc.categories?.length > 0) {
    for (const catPayloadId of doc.categories) {
      const { data: cat } = await supabase
        .from('activity_categories')
        .select('id')
        .eq('payload_id', catPayloadId)
        .single();

      if (cat) {
        await supabase.from('organization_categories').insert({
          organization_id: orgId,
          category_id: cat.id,
        });
      }
    }
  }

  // エリアの同期（同様の処理）
  await supabase
    .from('organization_areas')
    .delete()
    .eq('organization_id', orgId);

  if (doc.areas?.length > 0) {
    for (const areaPayloadId of doc.areas) {
      const { data: area } = await supabase
        .from('activity_areas')
        .select('id')
        .eq('payload_id', areaPayloadId)
        .single();

      if (area) {
        await supabase.from('organization_areas').insert({
          organization_id: orgId,
          area_id: area.id,
        });
      }
    }
  }

  // タグの同期（同様の処理）
  await supabase
    .from('organization_tags')
    .delete()
    .eq('organization_id', orgId);

  if (doc.tags?.length > 0) {
    for (const tagPayloadId of doc.tags) {
      const { data: tag } = await supabase
        .from('tags')
        .select('id')
        .eq('payload_id', tagPayloadId)
        .single();

      if (tag) {
        await supabase.from('organization_tags').insert({
          organization_id: orgId,
          tag_id: tag.id,
        });
      }
    }
  }
}
```

### 12-3. 画像アップロードフック

```typescript
// src/payload/hooks/uploadToSupabaseStorage.ts

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const uploadToSupabaseStorage = async ({ doc, operation }) => {
  if (!doc.filename) return doc;

  const filePath = `media/${doc.id}/${doc.filename}`;

  // ローカルファイルを読み込み
  const fileBuffer = fs.readFileSync(`./media/${doc.filename}`);

  // Supabase Storage にアップロード
  const { data, error } = await supabase.storage
    .from('public')
    .upload(filePath, fileBuffer, {
      contentType: doc.mimeType,
      upsert: true,
    });

  if (error) {
    console.error('Storage upload error:', error);
    return doc;
  }

  // 公開URLを取得
  const {
    data: { publicUrl },
  } = supabase.storage.from('public').getPublicUrl(filePath);

  doc.url = publicUrl;

  return doc;
};
```

---

## 13. ルーティング設計

### 13-1. ディレクトリ構造

```
app/
├─ (public)/                          # 公開サイト
│   ├─ page.tsx                       # トップページ
│   ├─ activities/
│   │   ├─ page.tsx                   # 市民活動一覧
│   │   └─ [slug]/
│   │       └─ page.tsx               # 団体詳細
│   ├─ interviews/
│   │   ├─ page.tsx                   # インタビュー一覧
│   │   └─ [slug]/
│   │       └─ page.tsx               # インタビュー詳細
│   ├─ grants/
│   │   ├─ page.tsx                   # 助成金一覧
│   │   └─ [slug]/
│   │       └─ page.tsx               # 助成金詳細
│   ├─ news/
│   │   ├─ page.tsx                   # お知らせ一覧
│   │   └─ [slug]/
│   │       └─ page.tsx               # お知らせ詳細
│   ├─ faq/
│   │   └─ page.tsx                   # FAQ
│   └─ about/
│       └─ page.tsx                   # サイトについて
│
├─ (payload)/                         # Payload CMS 管理画面
│   └─ admin/
│       └─ [[...segments]]/
│           └─ page.tsx               # Payload 管理画面
│
├─ api/                               # API Routes
│   └─ [...payload]/
│       └─ route.ts                   # Payload API
│
└─ layout.tsx                         # ルートレイアウト
```

### 13-2. ページ一覧

| パス                 | ページ名         | 説明                     | データソース |
| -------------------- | ---------------- | ------------------------ | ------------ |
| `/`                  | トップ           | 新着・ピックアップ表示   | Supabase     |
| `/activities`        | 市民活動一覧     | フィルタ付き一覧         | Supabase     |
| `/activities/[slug]` | 団体詳細         | 団体の詳細情報           | Supabase     |
| `/interviews`        | インタビュー一覧 | 記事一覧                 | Supabase     |
| `/interviews/[slug]` | インタビュー詳細 | 記事本文                 | Supabase     |
| `/grants`            | 助成金一覧       | フィルタ・ソート付き一覧 | Supabase     |
| `/grants/[slug]`     | 助成金詳細       | 助成金の詳細情報         | Supabase     |
| `/news`              | お知らせ一覧     | お知らせ一覧             | Supabase     |
| `/news/[slug]`       | お知らせ詳細     | お知らせ本文             | Supabase     |
| `/faq`               | FAQ              | よくある質問             | Supabase     |
| `/about`             | サイトについて   | コンセプト・運営主体     | 静的         |
| `/admin/*`           | 管理画面         | Payload CMS              | Payload      |

### 13-3. 公開ページの実装方針

- **静的生成 + ISR**: `generateStaticParams` + `revalidate`
- **データ取得**: Supabase から直接取得
- **フィルタリング**: クエリパラメータで絞り込み

```typescript
// app/(public)/activities/page.tsx

export const revalidate = 60; // 60秒ごとに再検証

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: { category?: string; area?: string };
}) {
  const supabase = createServerClient();

  let query = supabase
    .from('organizations')
    .select(
      `
      *,
      organization_categories(category:activity_categories(*)),
      organization_areas(area:activity_areas(*))
    `
    )
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  // フィルタリング
  if (searchParams.category) {
    // カテゴリでフィルタ
  }
  if (searchParams.area) {
    // エリアでフィルタ
  }

  const { data: organizations } = await query;

  return <OrganizationList organizations={organizations} />;
}
```

---

## 14. 認証・権限

### 14-1. 管理画面認証

| 項目         | 内容                              |
| ------------ | --------------------------------- |
| 認証方式     | Payload CMS 組み込み認証          |
| ログイン方法 | メール + パスワード               |
| ユーザー作成 | 管理者が Payload 管理画面から作成 |
| URL          | `/admin/login`                    |

### 14-2. ユーザー権限

| 操作                 | ライター       | 管理者 |
| -------------------- | -------------- | ------ |
| 記事作成・編集       | ✅             | ✅     |
| 記事削除             | ✅（自分のみ） | ✅     |
| カテゴリ・エリア管理 | ❌             | ✅     |
| タグ管理             | ✅             | ✅     |
| ユーザー管理         | ❌             | ✅     |
| メディアアップロード | ✅             | ✅     |

### 14-3. 初期ユーザー

| 役割     | 名前         | メール           | 備考               |
| -------- | ------------ | ---------------- | ------------------ |
| 管理者   | ほほ笑みラボ | （設定時に決定） | 全権限             |
| ライター | 市側担当者   | （設定時に決定） | 記事作成・編集のみ |

---

## 15. 非機能要件

### 15-1. パフォーマンス

| 項目         | 対応                                  |
| ------------ | ------------------------------------- |
| レスポンス   | ISR（revalidate: 60〜300 秒）         |
| 画像最適化   | 自動リサイズ（thumbnail, card, hero） |
| 遅延読み込み | Lazy Load 実装                        |
| CDN          | Vercel Edge Network                   |

### 15-2. アクセシビリティ

| 項目         | 対応                   |
| ------------ | ---------------------- |
| HTML         | セマンティックな構造   |
| コントラスト | WCAG 2.1 AA 準拠を目標 |
| 画像         | 代替テキスト必須       |
| キーボード   | ナビゲーション対応     |

### 15-3. SEO

| 項目         | 対応                 |
| ------------ | -------------------- |
| メタタグ     | next-seo による設定  |
| OGP          | 動的 OGP 画像生成    |
| サイトマップ | sitemap.xml 自動生成 |
| 構造化データ | JSON-LD              |

### 15-4. セキュリティ

| 項目     | 対応                           |
| -------- | ------------------------------ |
| 認証     | Payload Auth                   |
| API      | Payload の組み込みセキュリティ |
| 環境変数 | Vercel で管理                  |

---

## 16. 環境変数

```env
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# === Payload CMS ===
PAYLOAD_SECRET=xxx
DATABASE_URI=postgres://...  # Payload用DB

# === Vercel ===
VERCEL_URL=xxx

# === その他 ===
NEXT_PUBLIC_SITE_URL=https://xxx.vercel.app  # 本番時は独自ドメイン
```

---

## 17. 将来拡張（Phase2 以降）

### 17-1. 検索機能の強化

- サイト内キーワード検索（Supabase Full-Text Search）
- タグ検索
- 複合条件での絞り込み

### 17-2. コンテンツ拡張

- イベントカレンダー
- 活動レポート（市主催の講座や交流会など）
- 事例集（助成金 × 団体 × 成果）

### 17-3. ユーザー向け機能

- お気に入り・ブックマーク
- 団体同士のマッチング機能

### 17-4. プッシュ型情報発信

- LINE 連携
- メールマガジン配信

---

## 付録: 初期データ（マスター）

### 活動分野（activity_categories）

| name           | slug                | sort_order |
| -------------- | ------------------- | ---------- |
| 子ども・青少年 | children            | 1          |
| 福祉・介護     | welfare             | 2          |
| 環境・自然     | environment         | 3          |
| 文化・芸術     | culture             | 4          |
| まちづくり     | community           | 5          |
| 国際交流       | international       | 6          |
| 防災・防犯     | disaster-prevention | 7          |
| 教育・学習     | education           | 8          |
| スポーツ・健康 | sports              | 9          |
| その他         | other               | 99         |

### 活動エリア（activity_areas）

| name       | slug          | sort_order |
| ---------- | ------------- | ---------- |
| 市内全域   | city-wide     | 1          |
| 飯田地区   | iida          | 2          |
| 上郷地区   | kamisato      | 3          |
| 座光寺地区 | zakoji        | 4          |
| 松尾地区   | matsuo        | 5          |
| 竜丘地区   | tatsugaoka    | 6          |
| 三穂地区   | miho          | 7          |
| 伊賀良地区 | igara         | 8          |
| 山本地区   | yamamoto      | 9          |
| 下久堅地区 | shimohisakata | 10         |
| 上久堅地区 | kamihisakata  | 11         |
| 千代地区   | chiyo         | 12         |
| 龍江地区   | tatsue        | 13         |
| 川路地区   | kawaji        | 14         |
| 鼎地区     | kanae         | 15         |
| 上村地区   | kamimura      | 16         |
| 南信濃地区 | minamishinano | 17         |
| オンライン | online        | 99         |

---

## 付録: 開発チェックリスト

### Phase1 必須機能

- [ ] Payload CMS セットアップ
- [ ] コレクション定義（Organizations, Interviews, Grants, News, FAQs）
- [ ] マスターデータ登録（活動分野、活動エリア）
- [ ] Supabase テーブル作成
- [ ] 同期フック実装
- [ ] 画像アップロード → Supabase Storage
- [ ] 公開ページ実装（トップ、一覧、詳細）
- [ ] フィルタリング機能（カテゴリ、エリア）
- [ ] レスポンシブ対応
- [ ] SEO 基本設定
- [ ] Vercel デプロイ
- [ ] 管理者・ライターアカウント作成
- [ ] 仮データ投入（市役所確認用）

### 初期リリース時の確認項目

- [ ] Payload 管理画面にログインできる
- [ ] 記事を作成・公開できる
- [ ] Supabase に正しく同期される
- [ ] 公開サイトに記事が表示される
- [ ] 画像が正しく表示される
- [ ] フィルタリングが動作する
- [ ] スマホで正常に表示される
- [ ] OGP が正しく設定される
