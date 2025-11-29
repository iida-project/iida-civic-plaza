# 001 Supabase プロジェクト構築

## 概要
Supabaseプロジェクトを作成し、フロントエンド表示用のデータベース環境を構築する。

## 関連要件
- REQUIREMENTS.md: 9. 技術スタック・アーキテクチャ
- REQUIREMENTS.md: 11. Supabase データベース設計
- REQUIREMENTS.md: 16. 環境変数

## 技術仕様
- Supabase (PostgreSQL)
- Supabase Storage（画像ストレージ）
- Row Level Security (RLS)

## Todo
- [ ] Supabaseプロジェクト作成
- [ ] 環境変数の取得と設定（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY）
- [ ] .env.local ファイル作成
- [ ] Supabase クライアント設定ファイル作成
- [ ] Storageバケット「public」作成
- [ ] Storage のCORS設定

## 完了条件
- Supabaseプロジェクトが作成されている
- 環境変数が.env.localに設定されている
- Next.jsからSupabaseに接続できる

## 備考
- MCPサーバー経由でも操作可能
