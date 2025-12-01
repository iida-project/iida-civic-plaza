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
- [x] Supabaseプロジェクト作成
- [x] 環境変数の取得と設定（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY）
- [x] .env.local ファイル作成
- [x] Supabase クライアント設定ファイル作成
- [x] Storageバケット「media」作成（ダッシュボードから手動設定）
- [x] Storage のCORS設定（不要 - デフォルトで問題なし）

## 作成されたリソース
- **プロジェクトID**: gxsvyzvaalwywnylakgu
- **URL**: https://gxsvyzvaalwywnylakgu.supabase.co
- **リージョン**: ap-northeast-1（東京）
- **Storageバケット**: media（公開）

## 作成されたファイル
- `.env.local` - 環境変数
- `src/lib/supabase/client.ts` - クライアントサイド用
- `src/lib/supabase/server.ts` - サーバーサイド用
- `src/lib/supabase/admin.ts` - 管理者用（同期処理）
- `src/lib/supabase/index.ts` - エクスポート

## 完了条件
- Supabaseプロジェクトが作成されている
- 環境変数が.env.localに設定されている
- Next.jsからSupabaseに接続できる

## 備考
- MCPサーバー経由でも操作可能
