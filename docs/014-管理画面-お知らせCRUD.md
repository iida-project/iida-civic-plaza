# 014 管理画面 - お知らせCRUD

## 概要
お知らせ（news_posts）の作成・読取・更新・削除機能を実装する。

## 関連要件
- お知らせの登録・編集・削除
- リッチテキストで本文作成
- 公開日時の指定

## 技術仕様

### ページ構成
```
/admin/news           # 一覧ページ
/admin/news/new       # 新規作成
/admin/news/[id]      # 編集
```

### フォーム項目
```typescript
title: string              // タイトル（必須）
slug: string               // URLスラッグ
body?: string              // 本文（リッチテキスト）
is_published: boolean      // 公開状態
published_at?: timestamp   // 公開日時
```

### 一覧ページ機能
- 公開日時でソート（新しい順）
- 下書き/公開済みフィルター
- 検索

### コンポーネント構成
```
src/app/(admin)/admin/news/
├─ page.tsx              # 一覧
├─ new/page.tsx          # 新規作成
├─ [id]/page.tsx         # 編集
└─ _components/
    ├─ NewsList.tsx      # 一覧テーブル
    └─ NewsForm.tsx      # 作成/編集フォーム
```

## Todo
- [ ] 一覧ページ作成
- [ ] 新規作成フォーム作成（リッチテキストエディタ使用）
- [ ] 編集フォーム作成
- [ ] Server Actions 実装
- [ ] 公開日時の日時選択UI
- [ ] 予約公開ロジック（オプション）

## 完了条件
- お知らせの一覧表示ができる
- リッチテキストで本文作成ができる
- 公開/下書きの切り替えができる

## 備考
- シンプルな構造（リレーションなし）
- 010のリッチテキストエディタを使用
