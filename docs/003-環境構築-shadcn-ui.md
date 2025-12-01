# 003 shadcn/ui セットアップ

## 概要
UIコンポーネントライブラリ shadcn/ui を導入し、デザインシステムの基盤を構築する。

## 関連要件
- REQUIREMENTS.md: 9. 技術スタック・アーキテクチャ
- REQUIREMENTS.md: 7. デザイン・UI/UX

## 技術仕様
- shadcn/ui
- Tailwind CSS 3.4
- Lucide Icons
- CSS変数によるテーマ管理

## Todo
- [x] shadcn/ui 初期化（npx shadcn@latest init）
- [x] components.json 設定
- [x] グローバルCSS変数設定（暖色系カラーパレット）
- [x] 基本コンポーネント追加（Button, Card, Input, Badge）
- [x] Lucide Icons 設定確認
- [x] ダークモード対応設定（CSS変数で対応済み）

## 作成されたファイル
- `components.json` - shadcn/ui設定
- `src/lib/utils.ts` - ユーティリティ関数（cn）
- `src/components/ui/button.tsx` - ボタンコンポーネント
- `src/components/ui/card.tsx` - カードコンポーネント
- `src/components/ui/input.tsx` - 入力フィールド
- `src/components/ui/badge.tsx` - バッジコンポーネント
- `src/app/globals.css` - 暖色系カラーパレット設定

## カラーパレット設定
- **Primary**: orange-500（#F97316）- CTAボタン、リンク
- **Secondary**: rose-400（#FB7185）- サブアクセント、タグ
- **Accent**: amber-500（#F59E0B）- ハイライト、バッジ
- **Background**: amber-50（#FFFBEB）- 背景色
- **Foreground**: orange-950（#451A03）- テキスト色
- **Border**: orange-300（#FDBA74）- ボーダー
- **Radius**: 0.75rem - 曲線多めのデザイン

## 完了条件
- shadcn/ui コンポーネントが使用できる
- プロジェクトのデザイン方針に沿ったカラー設定

## 備考
- 暖色系・曲線多めのデザイン方針を反映
- 追加コンポーネントは `npx shadcn@latest add [component]` で追加可能
