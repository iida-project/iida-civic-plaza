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
- [ ] Payload CMS パッケージインストール
- [ ] payload.config.ts 作成
- [ ] 管理画面ルート設定（/admin）
- [ ] Payload API ルート設定（/api/[...payload]）
- [ ] DATABASE_URI 環境変数設定
- [ ] PAYLOAD_SECRET 環境変数設定
- [ ] 初期管理者ユーザー作成
- [ ] 管理画面の動作確認

## 完了条件
- /admin で管理画面にアクセスできる
- 管理者アカウントでログインできる
- Payload APIが動作する

## 備考
- Payload 3.xはNext.js App Routerにネイティブ対応
