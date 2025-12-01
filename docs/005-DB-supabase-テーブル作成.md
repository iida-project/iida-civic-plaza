# 005 Supabase テーブル作成

## 概要
Supabaseにフロントエンド表示用のテーブルを作成する。

## 関連要件
- REQUIREMENTS.md: 11. Supabase データベース設計
- REQUIREMENTS.md: 11-2. テーブル定義

## 技術仕様
- PostgreSQL
- UUID主キー
- payload_id による Payload CMS との紐付け
- インデックス設計

## Todo
- [x] activity_categories テーブル作成
- [x] activity_areas テーブル作成
- [x] tags テーブル作成
- [x] organizations テーブル作成
- [x] interviews テーブル作成
- [x] grants テーブル作成
- [x] news_posts テーブル作成
- [x] faqs テーブル作成
- [x] 中間テーブル作成（organization_categories, organization_areas, organization_tags, grant_categories）
- [x] 各テーブルのインデックス作成
- [x] RLS ポリシー設定（公開データは誰でも読める）

## 作成されたテーブル
### メインテーブル（RLS有効）
- `activity_categories` - 活動分野マスター
- `activity_areas` - 活動エリアマスター
- `tags` - タグマスター
- `organizations` - 市民活動団体
- `interviews` - ロングインタビュー
- `grants` - 助成金情報
- `news_posts` - お知らせ
- `faqs` - よくある質問

### 中間テーブル（RLS有効）
- `organization_categories` - 団体 × 活動分野
- `organization_areas` - 団体 × 活動エリア
- `organization_tags` - 団体 × タグ
- `grant_categories` - 助成金 × 対象分野

## RLSポリシー
- 公開データ（`is_published = true`）は誰でもSELECT可能
- マスターテーブルは全データSELECT可能

## 完了条件
- 全テーブルが作成されている
- インデックスが設定されている
- RLSが有効化されている

## 備考
- REQUIREMENTS.md 11-2 のSQL定義を参照
- Supabase MCP経由でマイグレーション実行済み
