# 012 管理画面 - インタビューCRUD

## 概要
インタビュー記事（interviews）の作成・読取・更新・削除機能を実装する。

## 関連要件
- インタビュー記事の登録・編集・削除
- 団体との紐付け
- リッチテキストで本文作成
- 画像ギャラリー

## 技術仕様

### ページ構成
```
/admin/interviews           # 一覧ページ
/admin/interviews/new       # 新規作成
/admin/interviews/[id]      # 編集
```

### フォーム項目
```typescript
title: string              // タイトル（必須）
slug: string               // URLスラッグ
lead_text: string          // リード文（必須）
body: string               // 本文（リッチテキスト、必須）
main_image_url?: string    // メイン画像
gallery_images?: string[]  // ギャラリー画像（JSON）
organization_id?: uuid     // 紐付け団体（セレクト）
is_featured: boolean       // ピックアップ表示
is_published: boolean      // 公開状態
published_at?: timestamp   // 公開日時
```

### コンポーネント構成
```
src/app/(admin)/admin/interviews/
├─ page.tsx                  # 一覧
├─ new/page.tsx              # 新規作成
├─ [id]/page.tsx             # 編集
└─ _components/
    ├─ InterviewList.tsx     # 一覧テーブル
    ├─ InterviewForm.tsx     # 作成/編集フォーム
    └─ OrganizationSelect.tsx # 団体選択
```

## Todo
- [ ] 一覧ページ作成
- [ ] 新規作成フォーム作成（リッチテキストエディタ使用）
- [ ] 編集フォーム作成
- [ ] Server Actions 実装
- [ ] 団体選択UI（既存団体から選択）
- [ ] ギャラリー画像アップロード
- [ ] ピックアップ設定
- [ ] プレビュー機能（オプション）

## 完了条件
- インタビューの一覧表示ができる
- リッチテキストで本文作成ができる
- 団体との紐付けができる
- 画像ギャラリーが機能する

## 備考
- 010のリッチテキストエディタを使用
- 団体が未登録の場合は紐付けなしでも可
