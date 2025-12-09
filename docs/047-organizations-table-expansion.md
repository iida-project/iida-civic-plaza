# 038 organizations テーブル拡張

## 概要
市民活動紹介（organizations）の詳細ページに必要な情報を追加するため、テーブルにカラムを追加し、管理画面・公開サイトを修正する。

## 追加カラム一覧

| 項目 | カラム名 | データ型 | NULL許可 | 備考 |
|-----|---------|---------|---------|------|
| 活動日 | `activity_schedule` | TEXT | YES | 「不定期」「月2回第4土曜日」など |
| 会員数 | `member_count` | TEXT | YES | 「約30名」など文字列 |
| 会費 | `membership_fee` | TEXT | YES | 「年会費3,000円」など |
| 活動場所 | `activity_location` | TEXT | YES | |
| 代表者 | `representative` | TEXT | YES | |
| 設立 | `established_year` | INTEGER | YES | 西暦のみ |
| 活動内容 | `activity_description` | TEXT | YES | リッチテキスト（HTML） |
| 会員募集 | `is_recruiting` | BOOLEAN | YES | デフォルトfalse |

## 既存カラムの変更

| カラム名 | 変更内容 |
|---------|---------|
| `participation_info` | リッチテキストとして使用（変更なし、運用変更のみ） |

## 管理画面フォームの構成

### メインエリア（左側）
1. 団体名 `name` *
2. 略称 `short_name`
3. スラッグ `slug` *
4. 活動日 `activity_schedule` ← 新規
5. 概要説明 `summary` * （リッチテキスト）
6. 活動内容 `activity_description` ← 新規（リッチテキスト）
7. 参加方法 `participation_info`（リッチテキスト）

### サイドバー（右側）
1. 公開設定 `is_published`
2. メイン画像 `main_image_url`
3. ギャラリー `gallery_images`
4. 会員数 `member_count` ← 新規
5. 会費 `membership_fee` ← 新規
6. 活動分野（中間テーブル）
7. 活動エリア（中間テーブル）
8. 活動場所 `activity_location` ← 新規
9. タグ（中間テーブル）
10. 代表者 `representative` ← 新規
11. 設立 `established_year` ← 新規
12. 連絡先担当者 `contact_name`
13. メールアドレス `contact_email`
14. 電話番号 `contact_phone`
15. Webサイト `website_url`
16. Facebook `facebook_url`
17. Twitter/X `twitter_url`
18. Instagram `instagram_url`
19. 会員募集 `is_recruiting` ← 新規

## 公開サイト詳細ページの表示

### 会員募集バッジ
- `is_recruiting = true`: 緑バッジ「🙋 会員募集中」を表示
- `is_recruiting = false`: 非表示（後で案A「グレーバッジ表示」に変更可能）

## Todo

- [x] DBマイグレーション実行（8カラム追加）
- [x] 管理画面 OrganizationForm 修正
- [x] 公開サイト詳細ページ修正
- [x] ビルドテスト・動作確認

## 完了条件

- 管理画面で新規フィールドが入力・保存できる
- 公開サイト詳細ページで新規情報が表示される
- 会員募集バッジが正しく表示される
- ビルドが成功する

## 備考

- 既存データには影響なし（全て NULL許可）
- 会員募集バッジは後で表示方法を変更する可能性あり
