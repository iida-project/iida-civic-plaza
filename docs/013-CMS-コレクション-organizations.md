# 013 Payload CMS Organizations コレクション

## 概要
市民活動団体（NPO団体紹介）のコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-2. Organizations コレクション
- REQUIREMENTS.md: 4-2. 市民活動紹介（NPO団体）

## 技術仕様
- Lexical リッチテキストエディタ
- relationship（categories, areas, tags）
- group（contact, links）
- Supabase 同期フック

## Todo
- [ ] organizations コレクション定義作成
- [ ] 基本情報フィールド追加
  - name（団体名・必須）
  - shortName（略称）
  - slug（ユニーク）
  - summary（団体概要・必須）
- [ ] 分類フィールド追加
  - categories（活動分野・relationship）
  - areas（活動エリア・relationship）
  - tags（タグ・relationship）
- [ ] 連絡先グループ追加
  - representativeName, email, phone
- [ ] 外部リンクグループ追加
  - website, facebook, twitter, instagram
- [ ] 参加方法フィールド追加（richText）
- [ ] 画像フィールド追加
  - mainImage, galleryImages
- [ ] 公開設定追加
  - status（draft/published）
  - publishedAt
- [ ] Supabase 同期フック実装
- [ ] リレーション同期処理実装

## 完了条件
- 団体情報の CRUD ができる
- 公開時に Supabase に同期される
- リレーションが正しく同期される

## 備考
- REQUIREMENTS.md 10-2 のフィールド定義を参照
