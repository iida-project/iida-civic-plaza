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
- **フォント**: M PLUS Rounded 1c (見出し/UI) + Noto Serif JP (本文) ※公開サイト
- **ホスティング**: Vercel (ISR)
- **管理画面**: 自作

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
│   ├─ activities/     # 活動団体紹介 /activities, /activities/[slug]
│   ├─ coming-soon/    # 準備中ページ /coming-soon
│   ├─ interviews/     # インタビュー /interviews, /interviews/[slug]
│   ├─ grants/         # 助成金情報 /grants, /grants/[slug]
│   ├─ news/           # お知らせ /news, /news/[slug]
│   ├─ faq/            # FAQ /faq
│   └─ about/          # サイトについて /about
├─ (admin)/            # 管理画面
│   └─ admin/          # /admin
└─ api/                # API Routes
```

### ヘッダーナビゲーション（ドロップダウン形式）

5グループ + 1単体リンクの構成：
- ムトス市民活動ひろば（準備中）
- 市民活動団体紹介 → 活動団体紹介(/activities), 活動レポート(/interviews)
- ムトス飯田事業（準備中）
- ムトス飯田以外の助成金・講座情報（準備中）
- 一般社団法人ムトス飯田市民ファンド（単体リンク、準備中）
- ムトス飯田事業のあらまし（準備中）

未実装ページは `/coming-soon` にリダイレクト。

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
- `GEMINI_API_KEY` - Google Gemini API（AI要約機能用）
- `KEEPALIVE_TOKEN` - Keepalive API認証用トークン

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
- INSERT/UPDATE/DELETE は暗黙的に拒否（ポリシーなし = 拒否）
- 管理画面は `service_role` で RLS をバイパス

### データベースインデックス

FKカラムおよび頻出クエリパターンにインデックスを設定済み：

| インデックス名 | テーブル | カラム | 種別 |
|--------------|---------|--------|------|
| `idx_interviews_organization_id` | interviews | organization_id | FK |
| `idx_organization_categories_category_id` | organization_categories | category_id | FK（逆方向） |
| `idx_organization_areas_area_id` | organization_areas | area_id | FK（逆方向） |
| `idx_organization_tags_tag_id` | organization_tags | tag_id | FK（逆方向） |
| `idx_grant_categories_category_id` | grant_categories | category_id | FK（逆方向） |
| `idx_organizations_featured` | organizations | is_featured | 部分インデックス（`WHERE is_featured = true`） |

### updated_at トリガー

全メインテーブルに `updated_at` 自動更新トリガーを設定済み：
- `organizations`, `interviews`, `grants`, `news_posts`, `faqs`
- 関数: `update_updated_at_column()`（`search_path = ''` 設定済み、SECURITY INVOKER）

### Supabase リレーションの型アサーション

Supabaseのネストしたselectでは型が配列として推論されるため、`as unknown as` を使用：

```typescript
organization: interview.organization as unknown as { name: string } | null
```

## 共通ユーティリティ関数

### stripHtml（src/lib/utils.ts）

HTMLタグを除去してプレーンテキストに変換：

```typescript
import { stripHtml } from '@/lib/utils'
const plainText = stripHtml('<p>HTMLコンテンツ</p>')  // "HTMLコンテンツ"
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
- [x] 047 - Organizations テーブル拡張（8カラム追加、会員募集バッジ）
- [x] 048 - メディアライブラリ（Supabase Storage管理、使用状況チェック、削除機能）
- [x] 049 - カスタムBubbleMenu（React Portal + Floating UI）
- [x] 050 - カスタムFloatingMenu（React Portal + Floating UI）
- [x] AI要約機能（Gemini API連携、3段階要約生成）※docsチケットなし

### 公開サイト
- [x] 021 - 共通レイアウト（Header/Footer）
- [x] 022 - トップページ
- [x] 023 - 市民活動一覧ページ
- [x] 024 - 市民活動詳細ページ
- [x] 025 - インタビュー一覧ページ
- [x] 026 - インタビュー詳細ページ
- [x] 027 - 助成金一覧ページ
- [x] 028 - 助成金詳細ページ
- [x] 029 - お知らせ一覧ページ
- [x] 030 - お知らせ詳細ページ
- [x] 031 - FAQページ
- [x] 032 - サイトについてページ

### 共通コンポーネント
- [x] 033 - カードコンポーネント（BaseCard）
- [x] 034 - フィルターコンポーネント
- [x] 035 - 画像ギャラリー（ImageGallery）
- [x] 036 - リッチテキストレンダラー（RichTextRenderer）
- [x] 037 - バッジ・タグコンポーネント

### SEO・パフォーマンス
- [x] 038 - SEO メタデータ基盤（generateMetadata）
- [ ] 039 - サイトマップ生成
- [ ] 040 - 構造化データ（JSON-LD）
- [ ] 041 - 動的 OGP 画像生成
- [x] 042 - ISR 設定（revalidate=60）
- [x] 043 - 画像最適化設定（next/image + remotePatterns）
- [ ] 044 - アクセシビリティ対応（部分的）

### デプロイ・テスト
- [x] 045 - Vercel デプロイ設定
- [x] 046 - 仮データ投入・動作確認

### パフォーマンス最適化
- [x] Vercel React Best Practices 監査・修正（React.cache, Promise.all, dynamic import）
- [x] Supabase Postgres Best Practices 監査・修正（FKインデックス, updated_atトリガー, search_path修正）

## 要件定義書

詳細な仕様は `REQUIREMENTS.md` を参照。

## 備考

- Payload CMSは互換性問題のため削除済み
- 管理画面は自作で実装
- 認証は本番前にセキュリティ強化予定（チケット045）
- 全テーブルの`payload_id`カラムはNULL許可に変更済み
- Vercelにデプロイ済み（Hobbyプラン）
