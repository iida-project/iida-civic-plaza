# 017 Payload CMS FAQs コレクション

## 概要
よくある質問のコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-6. マスターデータ コレクション - FAQs
- REQUIREMENTS.md: 4-1. 記事種別 - FAQ

## 技術仕様
- richText（回答）
- sortOrder による並び順管理
- Supabase 同期フック

## Todo
- [ ] faqs コレクション定義作成
- [ ] フィールド追加
  - question（質問・必須）
  - answer（回答・richText・必須）
  - sortOrder（表示順）
  - isPublished（公開フラグ）
- [ ] Supabase 同期フック実装

## 完了条件
- FAQ の CRUD ができる
- 表示順が管理できる
- Supabase に同期される

## 備考
- シンプルな Q&A 形式
