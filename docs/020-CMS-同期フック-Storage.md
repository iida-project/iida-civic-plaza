# 020 Supabase Storage アップロードフック

## 概要
画像・ファイルを Supabase Storage にアップロードするフックを実装する。

## 関連要件
- REQUIREMENTS.md: 12-3. 画像アップロードフック

## 技術仕様
- Supabase Storage API
- ファイルパス: media/{doc.id}/{filename}
- 公開URL取得

## Todo
- [ ] uploadToSupabaseStorage フック作成
- [ ] ファイル読み込み処理
- [ ] Storage バケットへのアップロード処理
- [ ] 公開URL取得・設定
- [ ] 既存ファイルの上書き対応（upsert: true）
- [ ] エラーハンドリング
- [ ] 画像リサイズ版のアップロード対応

## 完了条件
- 画像が Supabase Storage にアップロードされる
- 公開URLが取得できる
- 各コレクションで画像URLが使用できる

## 備考
- REQUIREMENTS.md 12-3 の実装例を参照
