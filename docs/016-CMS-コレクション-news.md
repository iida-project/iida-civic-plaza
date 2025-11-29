# 016 Payload CMS News コレクション

## 概要
お知らせのコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-5. News コレクション
- REQUIREMENTS.md: 4-1. 記事種別 - お知らせ

## 技術仕様
- Lexical リッチテキストエディタ
- Supabase 同期フック

## Todo
- [ ] news コレクション定義作成
- [ ] フィールド追加
  - title（タイトル・必須）
  - slug（ユニーク）
  - body（本文・richText）
- [ ] 公開設定追加
  - status（draft/published）
  - publishedAt
- [ ] Supabase 同期フック実装

## 完了条件
- お知らせの CRUD ができる
- 公開時に Supabase に同期される

## 備考
- シンプルな構成
