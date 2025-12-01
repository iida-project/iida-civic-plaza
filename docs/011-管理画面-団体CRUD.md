# 011 管理画面 - 団体CRUD

## 概要
市民活動団体（organizations）の作成・読取・更新・削除機能を実装する。

## 関連要件
- 団体情報の登録・編集・削除
- 活動分野・エリア・タグの紐付け
- 画像アップロード
- 公開/下書き管理

## 技術仕様

### ページ構成
```
/admin/organizations           # 一覧ページ
/admin/organizations/new       # 新規作成
/admin/organizations/[id]      # 編集
```

### 一覧ページ機能
- テーブル表示（団体名、ステータス、更新日）
- 検索・フィルター
- ページネーション
- 新規作成ボタン
- 編集・削除アクション

### フォーム項目
```typescript
// 基本情報
name: string           // 団体名（必須）
short_name?: string    // 略称
slug: string           // URLスラッグ（自動生成/編集可）
summary: string        // 概要説明（必須）

// 連絡先
contact_name?: string
contact_email?: string
contact_phone?: string

// SNS・Web
website_url?: string
facebook_url?: string
twitter_url?: string
instagram_url?: string

// 参加情報
participation_info?: string  // 参加方法（リッチテキスト）

// 画像
main_image_url?: string      // メイン画像
gallery_images?: string[]    // ギャラリー（JSON）

// リレーション
categories: uuid[]     // 活動分野（複数選択）
areas: uuid[]          // 活動エリア（複数選択）
tags: uuid[]           // タグ（複数選択）

// 公開設定
is_published: boolean
published_at?: timestamp
```

### コンポーネント構成
```
src/app/(admin)/admin/organizations/
├─ page.tsx                    # 一覧
├─ new/page.tsx                # 新規作成
├─ [id]/page.tsx               # 編集
└─ _components/
    ├─ OrganizationList.tsx    # 一覧テーブル
    ├─ OrganizationForm.tsx    # 作成/編集フォーム
    └─ CategorySelect.tsx      # カテゴリ選択
```

### Server Actions
```typescript
// src/app/(admin)/admin/organizations/actions.ts
export async function createOrganization(formData: FormData)
export async function updateOrganization(id: string, formData: FormData)
export async function deleteOrganization(id: string)
export async function togglePublish(id: string)
```

## Todo
- [ ] 一覧ページ作成
- [ ] 新規作成フォーム作成
- [ ] 編集フォーム作成
- [ ] Server Actions 実装
- [ ] カテゴリ・エリア・タグの複数選択UI
- [ ] 画像アップロード機能
- [ ] スラッグ自動生成
- [ ] 公開/下書き切り替え
- [ ] 削除機能（確認ダイアログ付き）
- [ ] バリデーション

## 完了条件
- 団体の一覧表示ができる
- 新規作成・編集・削除ができる
- カテゴリ等のリレーションが正しく保存される
- 画像アップロードができる

## 備考
- 中間テーブル（organization_categories等）の更新も必要
- 削除時は関連データの扱いに注意
