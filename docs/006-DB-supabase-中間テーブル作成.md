# 006 Supabase 中間テーブル作成

## 概要
多対多リレーション用の中間テーブルを作成する。

## 関連要件
- REQUIREMENTS.md: 11-3. 中間テーブル（リレーション用）

## 技術仕様
- 複合主キー
- 外部キー制約（CASCADE DELETE）

## Todo
- [x] organization_categories 中間テーブル作成
- [x] organization_areas 中間テーブル作成
- [x] organization_tags 中間テーブル作成
- [x] grant_categories 中間テーブル作成
- [x] 外部キー制約の設定
- [x] RLS ポリシー設定

## 完了条件
- 全中間テーブルが作成されている
- 外部キー制約が正しく設定されている
- CASCADE DELETE が機能する

## 備考
- REQUIREMENTS.md 11-3 のSQL定義を参照
- 005チケットで全中間テーブル作成済み（マイグレーション: create_junction_tables）
