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
- [ ] activity_categories テーブル作成
- [ ] activity_areas テーブル作成
- [ ] tags テーブル作成
- [ ] organizations テーブル作成
- [ ] interviews テーブル作成
- [ ] grants テーブル作成
- [ ] news_posts テーブル作成
- [ ] faqs テーブル作成
- [ ] 各テーブルのインデックス作成
- [ ] RLS ポリシー設定（公開データは誰でも読める）

## 完了条件
- 全テーブルが作成されている
- インデックスが設定されている
- RLSが有効化されている

## 備考
- REQUIREMENTS.md 11-2 のSQL定義を参照
