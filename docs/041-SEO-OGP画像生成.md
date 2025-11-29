# 041 動的 OGP 画像生成

## 概要
各ページの OGP 画像を動的に生成する。

## 関連要件
- REQUIREMENTS.md: 15-3. SEO - OGP

## 技術仕様
- Next.js ImageResponse
- @vercel/og

## Todo
- [ ] app/api/og/route.tsx 作成
- [ ] 共通 OGP テンプレート作成
- [ ] ページタイトル・説明文の埋め込み
- [ ] サイトロゴの埋め込み
- [ ] フォント設定（日本語対応）
- [ ] 各ページの generateMetadata で指定
- [ ] SNS シェアテスト

## 完了条件
- 動的 OGP 画像が生成される
- Twitter/Facebook で正しく表示される
- 日本語が正しく表示される

## 備考
- 画像サイズ: 1200x630
