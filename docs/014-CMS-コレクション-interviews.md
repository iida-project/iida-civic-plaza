# 014 Payload CMS Interviews コレクション

## 概要
ロングインタビュー記事のコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-3. Interviews コレクション
- REQUIREMENTS.md: 4-3. 市民活動ロングインタビュー

## 技術仕様
- Lexical リッチテキストエディタ（見出し、画像、リンク対応）
- relationship（relatedOrganization）
- 約10,000字の長文対応

## Todo
- [ ] interviews コレクション定義作成
- [ ] 基本情報フィールド追加
  - title（タイトル・必須）
  - slug（ユニーク）
  - leadText（リード文・必須）
- [ ] 本文フィールド追加（richText・見出しh2-h4対応）
- [ ] 画像フィールド追加
  - mainImage, galleryImages
- [ ] 関連団体フィールド追加（relationship）
- [ ] ピックアップフラグ追加（isFeatured）
- [ ] 公開設定追加
  - status（draft/published）
  - publishedAt
- [ ] Supabase 同期フック実装

## 完了条件
- インタビュー記事の CRUD ができる
- 長文が正しく保存・表示される
- 公開時に Supabase に同期される

## 備考
- 約10,000字のロングインタビューを想定
