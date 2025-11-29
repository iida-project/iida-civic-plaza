# 015 Payload CMS Grants コレクション

## 概要
助成金情報のコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-4. Grants コレクション
- REQUIREMENTS.md: 4-4. 助成金情報

## 技術仕様
- 日付フィールド（募集期間）
- select（対象団体種別）
- group（subsidyAmount）
- Supabase 同期フック

## Todo
- [ ] grants コレクション定義作成
- [ ] 基本情報フィールド追加
  - title（助成金名・必須）
  - slug（ユニーク）
  - providerName（実施主体・必須）
  - description（概要・richText）
- [ ] 募集期間グループ追加
  - startDate, endDate
- [ ] 対象フィールド追加
  - targetOrganizations（select・複数選択）
  - targetFields（relationship）
- [ ] 補助金額グループ追加
  - minAmount, maxAmount
- [ ] リンクフィールド追加
  - applyUrl, guidelinesFile, contactUrl
- [ ] 公開設定追加
  - status（draft/published）
  - publishedAt
- [ ] Supabase 同期フック実装

## 完了条件
- 助成金情報の CRUD ができる
- 募集期間が正しく管理される
- 公開時に Supabase に同期される

## 備考
- contactUrl のデフォルトは市役所お問い合わせページ
