# 013 管理画面 - 助成金CRUD

## 概要
助成金情報（grants）の作成・読取・更新・削除機能を実装する。

## 関連要件
- 助成金情報の登録・編集・削除
- 対象分野の紐付け
- 申請期間の管理
- 締切間近の表示

## 技術仕様

### ページ構成
```
/admin/grants           # 一覧ページ
/admin/grants/new       # 新規作成
/admin/grants/[id]      # 編集
```

### フォーム項目
```typescript
title: string                    // 助成金名（必須）
slug: string                     // URLスラッグ
provider_name: string            // 提供元（必須）
description?: string             // 説明
application_start_date?: date    // 申請開始日
application_end_date: date       // 申請締切日（必須）
target_organizations?: string[]  // 対象団体種別
subsidy_min_amount?: number      // 助成金額（下限）
subsidy_max_amount?: number      // 助成金額（上限）
apply_url?: string               // 申請URL
guidelines_file_url?: string     // 募集要項PDF
contact_url?: string             // 問い合わせURL
categories: uuid[]               // 対象分野（複数選択）
is_published: boolean            // 公開状態
published_at?: timestamp         // 公開日時
```

### 一覧ページ特有機能
- 締切日でソート
- 締切間近（7日以内）をハイライト
- 締切済みをグレーアウト or 非表示オプション

### コンポーネント構成
```
src/app/(admin)/admin/grants/
├─ page.tsx                # 一覧
├─ new/page.tsx            # 新規作成
├─ [id]/page.tsx           # 編集
└─ _components/
    ├─ GrantList.tsx       # 一覧テーブル
    └─ GrantForm.tsx       # 作成/編集フォーム
```

## Todo
- [ ] 一覧ページ作成
- [ ] 新規作成フォーム作成
- [ ] 編集フォーム作成
- [ ] Server Actions 実装
- [ ] 日付選択UI（DatePicker）
- [ ] 金額入力（カンマ区切り表示）
- [ ] 対象分野の複数選択
- [ ] 締切表示ロジック
- [ ] PDFアップロード（募集要項）

## 完了条件
- 助成金の一覧表示ができる
- 締切日での並び替えができる
- 対象分野との紐付けができる
- PDF/URLの登録ができる

## 備考
- 締切済み助成金の扱い（非表示 or アーカイブ）
- 毎年同じ助成金を複製する機能は将来検討
