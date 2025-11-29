# 008 Payload CMS Users コレクション

## 概要
管理画面ユーザー（管理者・ライター）のコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-8. Users コレクション
- REQUIREMENTS.md: 14. 認証・権限

## 技術仕様
- Payload Auth
- role ベースの権限管理

## Todo
- [ ] Users コレクション定義作成
- [ ] auth: true 設定
- [ ] name フィールド追加
- [ ] role フィールド追加（admin / writer）
- [ ] アクセス制御設定（admin: 全権限、writer: 限定権限）
- [ ] 初期管理者アカウント作成

## 完了条件
- ユーザー管理ができる
- role による権限分離が機能する

## 備考
- Supabase には同期しない
