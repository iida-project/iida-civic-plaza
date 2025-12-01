# 002 Payload CMS セットアップ

## 概要
Payload CMS 3.xをNext.jsプロジェクトに統合し、管理画面の基盤を構築する。

## 関連要件
- REQUIREMENTS.md: 9. 技術スタック・アーキテクチャ
- REQUIREMENTS.md: 10. Payload CMS コレクション設計
- REQUIREMENTS.md: 14. 認証・権限

## 技術仕様
- Payload CMS 3.x
- Lexical エディタ
- Payload Auth（管理画面認証）
- PostgreSQL（Payload用DB）

## Todo
- [x] Payload CMS パッケージインストール
- [x] payload.config.ts 作成
- [x] 管理画面ルート設定（/admin）
- [x] Payload API ルート設定（/api/[...slug]）
- [x] DATABASE_URI 環境変数設定（Supabaseダッシュボードから取得）
- [x] PAYLOAD_SECRET 環境変数設定
- [x] 初期管理者ユーザー作成（初回アクセス時に作成）
- [x] 管理画面の動作確認

## 完了条件
- /admin で管理画面にアクセスできる
- 管理者アカウントでログインできる
- Payload APIが動作する

## 作成されたファイル
- `src/payload.config.ts` - Payload設定ファイル
- `src/app/(payload)/layout.tsx` - Payload管理画面レイアウト
- `src/app/(payload)/admin/[[...segments]]/page.tsx` - 管理画面ページ
- `src/app/(payload)/admin/[[...segments]]/not-found.tsx` - 404ページ
- `src/app/(payload)/admin/importMap.js` - インポートマップ
- `src/app/(payload)/api/[...slug]/route.ts` - REST API
- `src/app/(payload)/api/graphql/route.ts` - GraphQL API
- `src/app/(payload)/custom.scss` - カスタムスタイル

## 備考
- Payload 3.xはNext.js App Routerにネイティブ対応
- 初回 /admin アクセス時に管理者アカウント作成画面が表示される
