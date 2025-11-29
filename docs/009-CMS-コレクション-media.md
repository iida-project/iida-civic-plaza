# 009 Payload CMS Media コレクション

## 概要
画像・ファイルアップロード用の Media コレクションを作成する。

## 関連要件
- REQUIREMENTS.md: 10-7. Media コレクション

## 技術仕様
- Payload Upload
- 画像リサイズ（thumbnail, card, hero）
- Supabase Storage 連携

## Todo
- [ ] Media コレクション定義作成
- [ ] upload 設定（mimeTypes, imageSizes）
- [ ] alt フィールド追加
- [ ] caption フィールド追加
- [ ] Supabase Storage アップロードフック作成
- [ ] 画像サイズ設定
  - thumbnail: 400x300
  - card: 768x432
  - hero: 1920x1080
- [ ] アップロードテスト

## 完了条件
- 画像アップロードができる
- 自動リサイズが機能する
- Supabase Storage に保存される

## 備考
- PDF対応も含む
