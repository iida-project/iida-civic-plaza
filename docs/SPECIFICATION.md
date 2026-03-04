# 飯田の市民活動ひろば - 実装仕様書

> 最終更新: 2026-03-04
> 本ドキュメントは現在の実装状態を正確に反映した仕様書です。
> 今後の大規模UI/UX変更の基準点（ベースライン）として使用してください。

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [技術スタック](#2-技術スタック)
3. [ディレクトリ構成](#3-ディレクトリ構成)
4. [データベース設計](#4-データベース設計)
5. [認証・ミドルウェア](#5-認証ミドルウェア)
6. [公開サイト](#6-公開サイト)
7. [管理画面](#7-管理画面)
8. [共通コンポーネント](#8-共通コンポーネント)
9. [リッチテキストエディタ](#9-リッチテキストエディタ)
10. [AI要約機能](#10-ai要約機能)
11. [メディア管理](#11-メディア管理)
12. [SEO・パフォーマンス](#12-seoパフォーマンス)
13. [環境変数・インフラ](#13-環境変数インフラ)
14. [未実装機能](#14-未実装機能)

---

## 1. プロジェクト概要

**サイト名**: 飯田の市民活動ひろば
**目的**: 飯田市内のNPO・市民活動を可視化し、つなげるWebサイト
**URL**: https://iida-civic-plaza.vercel.app

### コンテンツ種別

| 種別 | 説明 | 公開ルート |
|------|------|-----------|
| 市民活動団体 | NPO・ボランティア団体の紹介 | `/activities/[slug]` |
| インタビュー | 団体のロングインタビュー記事 | `/interviews/[slug]` |
| 助成金情報 | 応募可能な助成金・補助金 | `/grants/[slug]` |
| お知らせ | サイトからのお知らせ | `/news/[slug]` |
| FAQ | よくある質問 | `/faq` |

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン/備考 |
|---------|------|---------------|
| フレームワーク | Next.js 15 | App Router, Turbopack |
| 言語 | TypeScript | strict mode |
| スタイリング | Tailwind CSS | 3.4 |
| UIライブラリ | shadcn/ui | Radix UIベース |
| アイコン | Lucide Icons | - |
| アニメーション | Framer Motion | - |
| データベース | Supabase (PostgreSQL) | ap-northeast-1 |
| ストレージ | Supabase Storage | バケット: media |
| リッチテキスト | Tiptap 3.x + Prosemirror | カスタムメニュー |
| AI | Google Gemini 2.5 Flash Lite | 要約生成 |
| ホスティング | Vercel | Hobbyプラン, ISR |

---

## 3. ディレクトリ構成

```
src/
├── app/
│   ├── (frontend)/              # 公開サイト（Route Group）
│   │   ├── layout.tsx           # Header + Footer ラッパー
│   │   ├── page.tsx             # トップ /
│   │   ├── _components/         # Header.tsx, Footer.tsx
│   │   ├── activities/          # 市民活動 /activities, /activities/[slug]
│   │   ├── interviews/          # インタビュー /interviews, /interviews/[slug]
│   │   ├── grants/              # 助成金 /grants, /grants/[slug]
│   │   ├── news/                # お知らせ /news, /news/[slug]
│   │   ├── faq/                 # FAQ /faq
│   │   └── about/               # サイトについて /about
│   ├── (admin)/                 # 管理画面（Route Group）
│   │   ├── layout.tsx           # AdminLayout ラッパー
│   │   └── admin/
│   │       ├── login/           # ログイン /admin/login
│   │       ├── page.tsx         # ダッシュボード /admin
│   │       ├── organizations/   # 団体管理
│   │       ├── interviews/      # インタビュー管理
│   │       ├── grants/          # 助成金管理
│   │       ├── news/            # お知らせ管理
│   │       ├── faqs/            # FAQ管理
│   │       ├── master/          # マスター管理
│   │       └── media/           # メディアライブラリ
│   └── api/
│       ├── admin/login/         # POST: ログイン
│       ├── admin/logout/        # POST: ログアウト
│       └── keepalive/           # GET: スリープ防止
├── components/
│   ├── admin/                   # 管理画面用コンポーネント
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── MediaPickerDialog.tsx
│   │   └── editor/             # Tiptapエディタ関連
│   ├── common/                  # 共通コンポーネント
│   │   ├── BaseCard.tsx
│   │   ├── RichTextRenderer.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── FilterComponents.tsx
│   │   └── Badges.tsx
│   ├── animations/              # Framer Motionラッパー
│   └── ui/                      # shadcn/ui
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # ブラウザ用
│   │   ├── server.ts            # サーバー用（cookies管理）
│   │   ├── admin.ts             # 管理用（service_role, RLSバイパス）
│   │   └── public.ts            # 公開サイト用（SSG/ISR対応）
│   ├── gemini.ts                # AI要約（Gemini API）
│   └── utils.ts                 # stripHtml等
└── middleware.ts                # /admin認証チェック
```

### パスエイリアス
```typescript
"@/*" → "./src/*"
```

---

## 4. データベース設計

### Supabase設定
- **プロジェクトID**: gxsvyzvaalwywnylakgu
- **リージョン**: ap-northeast-1 (東京)

### 4.1 メインテーブル

#### organizations（市民活動団体）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| payload_id | text | YES | - | (レガシー) |
| slug | text | NO | - | URLスラッグ (UNIQUE) |
| name | text | NO | - | 団体名 |
| short_name | text | YES | - | 略称 |
| summary | text | NO | - | 概要 |
| contact_name | text | YES | - | 連絡先担当者名 |
| contact_email | text | YES | - | 連絡先メール |
| contact_phone | text | YES | - | 連絡先電話番号 |
| is_contact_public | boolean | NO | true | 連絡先公開フラグ |
| website_url | text | YES | - | Webサイト |
| facebook_url | text | YES | - | Facebook |
| twitter_url | text | YES | - | Twitter/X |
| instagram_url | text | YES | - | Instagram |
| participation_info | text | YES | - | 参加方法（リッチテキスト） |
| main_image_url | text | YES | - | メイン画像URL |
| gallery_images | jsonb | YES | '[]' | ギャラリー画像URL配列 |
| representative | text | YES | - | 代表者名 |
| established_year | integer | YES | - | 設立年（西暦） |
| member_count | text | YES | - | 会員数 |
| membership_fee | text | YES | - | 会費 |
| activity_location | text | YES | - | 活動場所 |
| activity_schedule | text | YES | - | 活動日程 |
| activity_description | text | YES | - | 活動内容（リッチテキスト） |
| is_recruiting | boolean | YES | false | 会員募集中フラグ |
| is_published | boolean | YES | false | 公開フラグ |
| published_at | timestamptz | YES | - | 公開日時 |
| is_featured | boolean | YES | false | ピックアップ（最大3団体） |
| created_at | timestamptz | YES | now() | 作成日時 |
| updated_at | timestamptz | YES | now() | 更新日時（トリガー自動更新） |

#### interviews（インタビュー）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| payload_id | text | YES | - | (レガシー) |
| slug | text | NO | - | URLスラッグ (UNIQUE) |
| title | text | NO | - | タイトル |
| lead_text | text | NO | - | リード文 |
| body | text | NO | - | 本文（リッチテキスト） |
| main_image_url | text | YES | - | メイン画像URL |
| gallery_images | jsonb | YES | '[]' | ギャラリー画像URL配列 |
| organization_id | uuid | YES | - | FK → organizations |
| summary_short | text | YES | - | AI要約（短:150字） |
| summary_medium | text | YES | - | AI要約（中:400字） |
| summary_long | text | YES | - | AI要約（長:800字） |
| is_featured | boolean | YES | false | ピックアップフラグ |
| is_published | boolean | YES | false | 公開フラグ |
| published_at | timestamptz | YES | - | 公開日時 |
| created_at | timestamptz | YES | now() | 作成日時 |
| updated_at | timestamptz | YES | now() | 更新日時 |

#### grants（助成金情報）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| payload_id | text | YES | - | (レガシー) |
| slug | text | NO | - | URLスラッグ (UNIQUE) |
| title | text | NO | - | 助成金名 |
| provider_name | text | NO | - | 提供元 |
| description | text | YES | - | 説明 |
| application_start_date | date | YES | - | 募集開始日 |
| application_end_date | date | NO | - | 募集締切日 |
| target_organizations | text[] | YES | '{}' | 対象団体種別 |
| subsidy_min_amount | integer | YES | - | 助成金額（下限） |
| subsidy_max_amount | integer | YES | - | 助成金額（上限） |
| apply_url | text | YES | - | 応募URL |
| guidelines_file_url | text | YES | - | 募集要項URL |
| contact_url | text | YES | 飯田市サイト | 問合せURL |
| thumbnail_url | text | YES | - | サムネイル画像 |
| is_published | boolean | YES | false | 公開フラグ |
| published_at | timestamptz | YES | - | 公開日時 |
| created_at | timestamptz | YES | now() | 作成日時 |
| updated_at | timestamptz | YES | now() | 更新日時 |

#### news_posts（お知らせ）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| payload_id | text | YES | - | (レガシー) |
| slug | text | NO | - | URLスラッグ (UNIQUE) |
| title | text | NO | - | タイトル |
| body | text | YES | - | 本文（リッチテキスト） |
| thumbnail_url | text | YES | - | サムネイル画像 |
| is_published | boolean | YES | false | 公開フラグ |
| published_at | timestamptz | YES | - | 公開日時 |
| created_at | timestamptz | YES | now() | 作成日時 |
| updated_at | timestamptz | YES | now() | 更新日時 |

#### faqs（よくある質問）

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| payload_id | text | YES | - | (レガシー) |
| question | text | NO | - | 質問 |
| answer | text | NO | - | 回答（リッチテキスト） |
| sort_order | integer | YES | 0 | 表示順 |
| is_published | boolean | YES | true | 公開フラグ |
| created_at | timestamptz | YES | now() | 作成日時 |
| updated_at | timestamptz | YES | now() | 更新日時 |

### 4.2 マスターテーブル

#### activity_categories（活動分野: 10件）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| name | text | 分野名 |
| slug | text | URLスラッグ (UNIQUE) |
| sort_order | integer | 表示順 |

**初期データ**: 子ども・青少年、福祉・介護、環境・自然、文化・芸術、まちづくり、国際交流、防災・防犯、教育・学習、スポーツ・健康、その他

#### activity_areas（活動エリア: 18件）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| name | text | エリア名 |
| slug | text | URLスラッグ (UNIQUE) |
| sort_order | integer | 表示順 |

**初期データ**: 市内全域、飯田地区、上郷地区、座光寺地区、松尾地区、竜丘地区、三穂地区、伊賀良地区、山本地区、下久堅地区、上久堅地区、千代地区、龍江地区、川路地区、鼎地区、上村地区、南信濃地区、オンライン

#### tags（タグ）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| name | text | タグ名 |
| slug | text | URLスラッグ (UNIQUE) |

### 4.3 中間テーブル

| テーブル | リレーション | 備考 |
|---------|-------------|------|
| organization_categories | organizations ↔ activity_categories | ON DELETE CASCADE |
| organization_areas | organizations ↔ activity_areas | ON DELETE CASCADE |
| organization_tags | organizations ↔ tags | ON DELETE CASCADE |
| grant_categories | grants ↔ activity_categories | ON DELETE CASCADE |

### 4.4 インデックス

| インデックス | テーブル | カラム | 種別 |
|-------------|---------|--------|------|
| idx_organizations_featured | organizations | is_featured | 部分 (WHERE true) |
| idx_interviews_organization_id | interviews | organization_id | FK |
| idx_organization_categories_category_id | organization_categories | category_id | FK逆方向 |
| idx_organization_areas_area_id | organization_areas | area_id | FK逆方向 |
| idx_organization_tags_tag_id | organization_tags | tag_id | FK逆方向 |
| idx_grant_categories_category_id | grant_categories | category_id | FK逆方向 |

### 4.5 トリガー

全メインテーブルに `updated_at` 自動更新トリガーを設定:
- 関数: `update_updated_at_column()` (SECURITY INVOKER, search_path = '')
- 対象: organizations, interviews, grants, news_posts, faqs

### 4.6 RLSポリシー

- **SELECT**: `is_published = true` のレコードのみ（マスターテーブルは全件）
- **INSERT/UPDATE/DELETE**: ポリシーなし = 暗黙的に拒否
- **管理画面**: `service_role` キーでRLSバイパス

---

## 5. 認証・ミドルウェア

### ログイン方式
- 簡易パスワード認証（単一パスワード）
- 環境変数 `ADMIN_PASSWORD` で設定

### APIエンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/admin/login` | パスワード検証、セッションCookie発行 |
| POST | `/api/admin/logout` | セッションCookie削除 |
| GET | `/api/keepalive?token=` | Vercelスリープ防止 |

### セッションCookie
- **名前**: `admin_session`
- **有効期限**: 7日間
- **属性**: httpOnly, secure (本番), sameSite: lax

### ミドルウェア (middleware.ts)
- **対象**: `/admin/*` (loginページ除く)
- **処理**: `admin_session` Cookie確認 → 未認証は `/admin/login` へリダイレクト

---

## 6. 公開サイト

### 6.1 共通レイアウト

#### Header
- 固定表示（sticky top-0 z-50）
- ロゴ + サイト名
- デスクトップ: 7リンクのナビゲーション
- モバイル: ハンバーガーメニュー（AnimatePresence）

#### Footer
- ダーク背景
- 3カラムレイアウト（md以上）
- ロゴ、ナビゲーション、連絡先

### 6.2 各ページ仕様

全公開ページ共通: `revalidate = 60` (ISR 60秒)

#### トップページ `/`

| セクション | 内容 |
|-----------|------|
| Hero | サイト紹介バナー |
| 最新記事 | 全コンテンツから最新6件（時系列統合） |
| 検索セクション | 活動分野・エリア別検索ドロップダウン |
| ピックアップ団体 | is_featured=true の団体（最大3件） |
| 注目インタビュー | is_featured=true のインタビュー（最大4件） |
| CTA | 行動喚起セクション |

**データ取得**: Promise.all で5クエリ並列実行

#### 市民活動一覧 `/activities`

| 項目 | 内容 |
|------|------|
| クエリパラメータ | `category`, `area` （スラッグでフィルタ） |
| フィルター | 活動分野チップ、活動エリアチップ |
| カード情報 | メイン画像、団体名、カテゴリ(最大2)、エリア、概要、タグ(最大3)、募集バッジ |
| レイアウト | 3カラムグリッド（lg） |
| アニメーション | カードごとのスタガード表示 |

**特記**: クライアントサイドフィルタリング（プリフェッチデータ）

#### 市民活動詳細 `/activities/[slug]`

**レイアウト**: 2:1グリッド（lg: 2/3 + 1/3）

| 左カラム（メイン） | 右カラム（サイドバー） |
|-------------------|---------------------|
| 団体名 + 略称 + 募集バッジ | 団体情報カード（代表者、設立年、会員数、会費、活動日程、活動場所） |
| メイン画像 | 連絡先カード（`is_contact_public=true`の場合のみ表示） |
| 概要（リッチテキスト） | 外部リンク/SNSカード |
| カテゴリ・エリア・タグバッジ | 他の団体（5件） |
| 活動内容（リッチテキスト） | - |
| 画像ギャラリー（ライトボックス付き） | - |
| 参加方法（リッチテキスト） | - |
| 関連インタビュー（最大3件） | - |

**連絡先表示条件**: `is_contact_public && (contact_email || contact_phone || contact_name)`

#### インタビュー一覧 `/interviews`

| 項目 | 内容 |
|------|------|
| ピックアップ | is_featured=true を上部に大きく表示（横レイアウト） |
| 通常記事 | 3カラムグリッド |
| カード情報 | メイン画像、団体名、タイトル、リード文 |

#### インタビュー詳細 `/interviews/[slug]`

**レイアウト**: 2:1グリッド（lg: 2/3 + 1/3）

| 左カラム（メイン） | 右カラム（サイドバー） |
|-------------------|---------------------|
| メイン画像 | AI要約スライダー（短/中/長切替） |
| メタ情報（団体名、公開日） | 目次（h2/h3見出し抽出） |
| タイトル | 他のインタビュー（3件） |
| リード文（引用スタイル） | - |
| 本文（見出しID自動付与） | - |
| 画像ギャラリー | - |
| 関連団体CTA | - |

**特記**: モバイル用目次コンポーネント（フローティング）あり

#### 助成金一覧 `/grants`

| 項目 | 内容 |
|------|------|
| クエリパラメータ | `showClosed` (締切済み表示), `sort` (newest/deadline) |
| ステータスバッジ | 募集終了(灰)、締切間近≤7日(赤)、もうすぐ≤14日(橙)、募集中(緑) |
| カード情報 | タイトル、提供元、説明、締切日、助成金額、対象団体タグ |
| 締切済み | opacity-60 で表示 |

#### 助成金詳細 `/grants/[slug]`

**レイアウト**: 2:1グリッド

| 左カラム | 右カラム |
|---------|---------|
| ステータスバッジ | 問合せ先情報 |
| タイトル + 提供元 | 他の助成金（5件） |
| 概要 | - |
| 詳細カード（募集期間、金額、対象） | - |
| CTAボタン（応募/要項） | - |

#### お知らせ一覧 `/news`

- 縦リスト表示（max-w-3xl）
- タイトル、公開日、本文プレビュー

#### お知らせ詳細 `/news/[slug]`

**レイアウト**: lg:grid-cols-4 (3:1)
- 記事本文 + サイドバー（他のお知らせ5件）

#### FAQ `/faq`

- アコーディオン形式
- sort_order順に表示

#### サイトについて `/about`

- 完全静的ページ（DB問合せなし）
- コンセプト、できること、運営情報、お問合せ

---

## 7. 管理画面

### 7.1 共通構造

#### サイドバーナビゲーション（8項目）
1. ダッシュボード `/admin`
2. 団体管理 `/admin/organizations`
3. インタビュー `/admin/interviews`
4. 助成金 `/admin/grants`
5. お知らせ `/admin/news`
6. FAQ `/admin/faqs`
7. メディア `/admin/media`
8. マスター `/admin/master`

#### レイアウト
- デスクトップ: 左サイドバー + メインエリア
- モバイル: ハンバーガーメニュー + フルワイド

#### 「サイトで確認」リンク
全編集ページ + 団体一覧に設置。公開/非公開状態に関係なくリンクを表示（管理者用プレビュー）。

### 7.2 ダッシュボード `/admin`

- 各コンテンツの件数カード表示
- クイックアクセスリンク
- `force-dynamic` (常に最新)

### 7.3 団体管理

**ルート**:
- `/admin/organizations` - 一覧
- `/admin/organizations/new` - 新規作成
- `/admin/organizations/[id]` - 編集

**一覧機能**:
- 名前順ソート
- 公開/非公開トグル（アイコンクリック）
- ピックアップトグル（最大3件制限）
- サイト確認リンク（ExternalLinkアイコン）
- 削除（インタビューが紐づく場合はエラー）

**フォームフィールド**:

| セクション | フィールド | 特記事項 |
|-----------|----------|---------|
| 基本情報 | 名前(必須)、略称、スラッグ(自動生成)、概要(必須) | - |
| 連絡先 | 担当者名、メール、電話 | 公開/非公開スイッチ付き |
| Web・SNS | Webサイト、Facebook、Twitter、Instagram | - |
| 団体情報 | 代表者、設立年、会員数、会費、活動場所、活動日程 | - |
| コンテンツ | 活動内容(リッチテキスト)、参加方法(リッチテキスト) | - |
| 画像 | メイン画像 | 最大5MB |
| 分類 | 活動分野(複数選択)、活動エリア(複数選択)、タグ(複数選択) | - |
| 公開設定 | 公開スイッチ、会員募集スイッチ、ピックアップボタン | ピックアップ最大3件 |

**Server Actions**: createOrganization, updateOrganization, deleteOrganization, togglePublish, toggleFeatured, getFeaturedCount

### 7.4 インタビュー管理

**フォームフィールド**:

| セクション | フィールド | 特記事項 |
|-----------|----------|---------|
| 基本情報 | タイトル(必須)、スラッグ(自動生成)、リード文(必須) | - |
| 本文 | 本文(必須、リッチテキスト) | 画像インライン挿入対応 |
| 画像 | メイン画像、ギャラリー画像(複数) | 並べ替え対応 |
| 団体紐づけ | 団体選択(ドロップダウン) | - |
| AI要約 | 短/中/長の3段階要約 | 自動生成 + 個別再生成 |
| 公開設定 | 公開スイッチ、ピックアップスイッチ | - |

### 7.5 助成金管理

**フォームフィールド**:

| セクション | フィールド |
|-----------|----------|
| 基本情報 | タイトル(必須)、スラッグ、提供元(必須)、説明 |
| 募集情報 | 開始日、締切日(必須)、応募URL、要項URL、問合せURL |
| 金額 | 助成金下限、助成金上限 |
| 分類 | 対象分野(複数選択)、対象団体種別(複数選択) |
| 公開設定 | 公開スイッチ |

### 7.6 お知らせ管理

**フォームフィールド**: タイトル(必須)、スラッグ、本文(リッチテキスト)、公開スイッチ

### 7.7 FAQ管理

**フォームフィールド**: 質問(必須)、回答(必須、リッチテキスト)、表示順、公開スイッチ

**特記**: 一覧画面で上下矢印ボタンによる並べ替え対応

### 7.8 マスター管理

**ルート**:
- `/admin/master` - ハブページ
- `/admin/master/categories` - 活動分野
- `/admin/master/areas` - 活動エリア
- `/admin/master/tags` - タグ

**機能**:
- CRUD + 並べ替え（カテゴリ/エリア）
- 使用数表示
- 使用中データの削除防止

---

## 8. 共通コンポーネント

### BaseCard (`src/components/common/BaseCard.tsx`)
- motion.article ラッパー
- ホバーアニメーション（y: -4）
- サブコンポーネント: CardImage, CardContent, CardTitle, CardDescription, CardBadge

### RichTextRenderer (`src/components/common/RichTextRenderer.tsx`)
- HTML → スタイル済みコンテンツ変換
- サイズバリエーション: sm, lg, xl
- 見出しID自動付与オプション（目次用）

### ImageGallery (`src/components/common/ImageGallery.tsx`)
- サムネイルグリッド
- ライトボックスモーダル（Framer Motion）
- キーボード操作（←→ Escape）
- タッチスワイプ対応

### FilterComponents (`src/components/common/FilterComponents.tsx`)
- FilterContainer, FilterSection, ChipFilter
- SortButtons, ClearFilterButton, ResultCount
- useFilterParams フック

### Badges (`src/components/common/Badges.tsx`)
- CategoryBadge, AreaBadge, TagBadge
- StatusBadge, DeadlineBadge
- NewBadge, PickupBadge

---

## 9. リッチテキストエディタ

### 構成ファイル
```
src/components/admin/editor/
├── RichTextEditor.tsx        # メインコンポーネント
├── EditorToolbar.tsx         # ツールバー
├── CustomBubbleMenu.tsx      # テキスト選択時メニュー
└── CustomFloatingMenu.tsx    # 空行・ブロック先頭時メニュー
```

### 対応フォーマット
テキスト: 太字、斜体、下線、取り消し線、インラインコード
ブロック: 見出し(H1-H3)、箇条書き、番号付きリスト、引用、コードブロック、水平線、テーブル
メディア: 画像（URL参照）、リンク

### カスタムメニュー（React Portal + Floating UI）

| メニュー | 表示条件 | 機能 |
|---------|---------|------|
| BubbleMenu | テキスト選択時 | Bold, Italic, Strike, Link, Code |
| FloatingMenu | 空行・ブロック先頭 | 画像、水平線、H1/H2/H3、引用、リスト |

**z-index: 9999** でサイドバーより前面に表示。
`shift({ padding: 8 })` で画面端でも切れない。

---

## 10. AI要約機能

### 技術仕様
- **API**: Google Generative AI (Gemini 2.5 Flash Lite)
- **ファイル**: `src/lib/gemini.ts`

### 要約レベル

| レベル | 名前 | 文字数制限 | 説明 |
|--------|------|-----------|------|
| short | さくっと | 150字以内 | 30秒で読める短い要約 |
| medium | ほどよく | 400字以内 | 1分で読める中程度の要約 |
| long | じっくり | 800字以内 | 3分で読める詳しい要約 |

### 動作フロー
1. 管理画面のインタビュー編集で「AI要約生成」ボタンをクリック
2. 本文HTMLからテキスト抽出
3. Gemini APIに送信、3段階の要約を生成
4. 個別レベルの再生成も可能

### 公開サイトでの表示
インタビュー詳細ページのサイドバーに **SummarySlider** コンポーネントとして表示。スライダーで短/中/長を切替。

---

## 11. メディア管理

### メディアライブラリ `/admin/media`

**機能**:
- ドラッグ&ドロップ画像アップロード
- グリッド表示（サムネイル、ファイル名、サイズ、日時）
- URLコピーボタン
- 使用状況チェック

### 使用状況チェック対象

| テーブル | カラム |
|---------|--------|
| organizations | main_image_url, gallery_images |
| interviews | main_image_url, gallery_images |
| grants | thumbnail_url |
| news_posts | thumbnail_url |

### 削除ワークフロー
1. 使用中の場合: 使用先の記事タイトル一覧を警告表示
2. 確認後: 関連カラムをNULLに更新 → Storageから削除

### ストレージ構成
- **バケット**: media（公開）
- **URL形式**: `https://gxsvyzvaalwywnylakgu.supabase.co/storage/v1/object/public/media/[path]`
- **ファイルサイズ制限**: 5MB

---

## 12. SEO・パフォーマンス

### SEOメタデータ

**グローバル**:
```typescript
title: { default: '飯田の市民活動ひろば', template: '%s | 飯田の市民活動ひろば' }
locale: 'ja_JP'
```

**動的メタデータ**: 各詳細ページで `generateMetadata()` によりタイトル・説明・OGP画像を動的生成

### ISR設定
- 全公開ページ: `revalidate = 60` (60秒)
- 管理画面: `force-dynamic`

### パフォーマンス最適化
- **React.cache()**: 詳細ページのデータ取得をリクエスト単位でキャッシュ
- **Promise.all**: 独立したクエリの並列実行
- **next/dynamic**: 重いコンポーネントの遅延読み込み
- **Next.js Image**: Supabase Storage画像の最適化配信

### 画像最適化
```typescript
// next.config.ts
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'gxsvyzvaalwywnylakgu.supabase.co',
    pathname: '/storage/v1/object/public/**',
  }]
}
```

---

## 13. 環境変数・インフラ

### 必須環境変数

| 変数名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 管理者キー |
| `NEXT_PUBLIC_SITE_URL` | サイトURL |
| `ADMIN_PASSWORD` | 管理画面パスワード |
| `GEMINI_API_KEY` | Gemini API キー |
| `KEEPALIVE_TOKEN` | Keepalive API 認証トークン |

### Supabaseクライアント（4種類）

| クライアント | ファイル | 用途 | キー |
|------------|--------|------|------|
| createClient | client.ts | ブラウザ | anon |
| createServerClient | server.ts | サーバー（cookies管理） | anon |
| createAdminClient | admin.ts | 管理画面（RLSバイパス） | service_role |
| createPublicClient | public.ts | 公開サイト（SSG/ISR） | anon |

### Vercelデプロイ
- **プラン**: Hobby
- **スリープ防止**: `/api/keepalive` エンドポイント（外部からの定期呼び出し）

---

## 14. 未実装機能

| No | 機能 | 概要 |
|----|------|------|
| 039 | サイトマップ生成 | sitemap.xml の自動生成 |
| 040 | 構造化データ (JSON-LD) | 検索エンジン向け構造化データ |
| 041 | 動的 OGP 画像生成 | ページごとのOG画像自動生成 |
| 044 | アクセシビリティ対応 | WCAG準拠の本格対応 |

---

## 付録: 共通パターン

### スラッグ自動生成
1. 小文字化
2. 非英数字・日本語以外を除去
3. スペース/アンダースコアをハイフンに
4. 50文字制限
5. 重複時はサフィックス付与 (-1, -2, ...)

### 公開管理パターン
- `is_published`: true/false
- `published_at`: 初回公開時にタイムスタンプ設定、非公開時にNULL

### Supabaseリレーションの型アサーション
```typescript
// ネストしたselectの戻り値は配列型として推論されるため
organization: data.organization as unknown as { name: string } | null
```

### レスポンシブグリッドパターン
```
一覧: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
詳細: grid-cols-1 lg:grid-cols-3 (メイン2:サイド1)
```
