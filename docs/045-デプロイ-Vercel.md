# 045 Vercel デプロイ設定

## 概要
Vercel へのデプロイ設定を行う。

## 関連要件
- REQUIREMENTS.md: 9. 技術スタック - ホスティング

## 技術仕様
- Vercel
- 環境変数設定
- プレビューデプロイ

## Todo
- [ ] Vercel プロジェクト作成
- [ ] GitHub リポジトリ連携
- [ ] 環境変数設定（Production/Preview）
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - PAYLOAD_SECRET
  - DATABASE_URI
  - NEXT_PUBLIC_SITE_URL
- [ ] ビルド設定確認
- [ ] ドメイン設定（必要に応じて）
- [ ] プレビューデプロイ確認
- [ ] 本番デプロイ確認

## 完了条件
- 自動デプロイが機能する
- 環境変数が正しく設定されている
- サイトが公開される

## 備考
- 独自ドメインは後日設定
