# 011 Payload CMS ActivityAreas コレクション

## 概要
活動エリアマスターのコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-6. マスターデータ コレクション - ActivityAreas

## 技術仕様
- name, slug, sortOrder フィールド
- Supabase 同期フック

## Todo
- [ ] activity-areas コレクション定義作成
- [ ] name フィールド追加（必須）
- [ ] slug フィールド追加（ユニーク）
- [ ] sortOrder フィールド追加
- [ ] Supabase 同期フック実装
- [ ] 管理画面からの登録テスト

## 完了条件
- 活動エリアの CRUD ができる
- Supabase に同期される

## 備考
- admin のみ編集可能
