# 004 Framer Motion セットアップ

## 概要
アニメーションライブラリ Framer Motion を導入し、モーション基盤を構築する。

## 関連要件
- REQUIREMENTS.md: 7-3. アニメーション・モーション
- REQUIREMENTS.md: 9. 技術スタック・アーキテクチャ

## 技術仕様
- Framer Motion
- スクロールアニメーション
- ホバーエフェクト

## Todo
- [x] framer-motion パッケージインストール
- [x] 共通アニメーション設定ファイル作成
- [x] フェードイン/スライドインのバリアント定義
- [x] カードホバーアニメーション定義
- [x] スクロールトリガーユーティリティ作成

## 作成されたファイル
- `src/lib/animations/variants.ts` - アニメーションバリアント定義
- `src/lib/animations/motion.tsx` - 再利用可能なモーションコンポーネント
- `src/lib/animations/index.ts` - エクスポート

## 利用可能なバリアント
- `fadeIn` - フェードイン
- `fadeInUp` - 下からフェードイン
- `slideInLeft` - 左からスライドイン
- `slideInRight` - 右からスライドイン
- `scaleIn` - スケールイン
- `staggerContainer` - 子要素を順番にアニメーション
- `cardHover` - カードホバー効果
- `buttonHover` - ボタンホバー効果
- `pageTransition` - ページトランジション

## 利用可能なコンポーネント
- `FadeInOnScroll` - スクロールでフェードイン
- `StaggerContainer` - スタガードコンテナ
- `StaggerItem` - スタガードアイテム
- `HoverCard` - ホバーで浮き上がるカード
- `HoverScale` - ホバーでスケール

## 使用例
```tsx
import { FadeInOnScroll, HoverCard } from '@/lib/animations'

<FadeInOnScroll>
  <h1>スクロールでフェードイン</h1>
</FadeInOnScroll>

<HoverCard>
  <Card>ホバーで浮き上がる</Card>
</HoverCard>
```

## 完了条件
- Framer Motionが動作する
- 再利用可能なアニメーション設定がある

## 備考
- 読みやすさ・使いやすさを損なわない範囲のアニメーション
- 'use client'ディレクティブが必要なコンポーネントは motion.tsx で定義
