# 012 Payload CMS Tags コレクション

## 概要
タグマスターのコレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-6. マスターデータ コレクション - Tags

## 技術仕様
- name, slug フィールド
- Supabase 同期フック

## Todo
- [ ] tags コレクション定義作成
- [ ] name フィールド追加（必須）
- [ ] slug フィールド追加（ユニーク）
- [ ] Supabase 同期フック実装
- [ ] 管理画面からの登録テスト

## 完了条件
- タグの CRUD ができる
- Supabase に同期される

## 備考
- writer も編集可能
