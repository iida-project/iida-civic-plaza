# 015 管理画面 - FAQ CRUD

## 概要
よくある質問（faqs）の作成・読取・更新・削除機能を実装する。

## 関連要件
- FAQの登録・編集・削除
- 表示順の管理
- シンプルなQ&A形式

## 技術仕様

### ページ構成
```
/admin/faqs           # 一覧ページ（並び替え可能）
/admin/faqs/new       # 新規作成
/admin/faqs/[id]      # 編集
```

### フォーム項目
```typescript
question: string       // 質問（必須）
answer: string         // 回答（必須、プレーンテキスト or リッチテキスト）
sort_order: number     // 表示順（デフォルト: 0）
is_published: boolean  // 公開状態
```

### 一覧ページ機能
- ドラッグ&ドロップで並び替え（オプション）
- sort_order での手動並び替え
- 公開/非公開フィルター

### コンポーネント構成
```
src/app/(admin)/admin/faqs/
├─ page.tsx              # 一覧（並び替え機能付き）
├─ new/page.tsx          # 新規作成
├─ [id]/page.tsx         # 編集
└─ _components/
    ├─ FAQList.tsx       # 一覧（ドラッグ可能）
    └─ FAQForm.tsx       # 作成/編集フォーム
```

## Todo
- [ ] 一覧ページ作成
- [ ] 新規作成フォーム作成
- [ ] 編集フォーム作成
- [ ] Server Actions 実装
- [ ] 表示順の管理
- [ ] ドラッグ&ドロップ並び替え（オプション）

## 完了条件
- FAQの一覧表示ができる
- Q&Aの作成・編集・削除ができる
- 表示順を変更できる

## 備考
- 回答はプレーンテキストで十分な場合が多い
- 必要ならリッチテキスト対応も可能
