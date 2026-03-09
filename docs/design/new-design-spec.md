# デザイン仕様書 - 飯田の市民活動ひろば TOPページ改修

## 概要

| 項目       | 内容                                                        |
| ---------- | ----------------------------------------------------------- |
| 対象サイト | https://iida-civic-plaza.vercel.app/                        |
| 対象ページ | TOPページ（index）＋全ページ共通ヘッダー・フッター          |
| 作業方式   | バイブコーディング（AI実装）                                |
| 目的       | ロゴ4色を常に意識できるデザインへ刷新・全体を明るくポップに |

---

## カラーパレット

ロゴ（りんご4色）を基準に、以下の色を全体で統一使用する。

| カラー名       | HEX       | 用途                             |
| -------------- | --------- | -------------------------------- |
| りんごピンク   | `#F4A7B9` | グラデーション・波線・アクセント |
| りんごオレンジ | `#F9C784` | グラデーション・波線・アクセント |
| りんごグリーン | `#A8D5A2` | グラデーション・波線・アクセント |
| りんごブルー   | `#90C8E0` | グラデーション・波線・アクセント |
| ホワイト       | `#FFFFFF` | 背景・テキスト                   |
| テキストメイン | `#333333` | 本文テキスト                     |
| テキストサブ   | `#666666` | サブテキスト・説明文             |

> ※ HEXはロゴ画像から近似値で設定。実装時にロゴ画像からスポイトで正確な値を取得して調整すること。

---

## CSS カスタムプロパティ定義

```css
:root {
  --color-pink: #f4a7b9;
  --color-orange: #f9c784;
  --color-green: #a8d5a2;
  --color-blue: #90c8e0;
  --color-white: #ffffff;
  --color-text-main: #333333;
  --color-text-sub: #666666;
  --color-bg: #fafafa;

  --font-heading: 'M PLUS Rounded 1c', sans-serif;
  --font-body: 'Noto Serif JP', serif;
  --font-ui: 'M PLUS Rounded 1c', sans-serif;

  --radius-card: 12px;
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 6px 20px rgba(0, 0, 0, 0.14);
}
```

---

## フォント

### 使用フォント（Google Fonts）

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&family=Noto+Serif+JP:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

| 用途               | フォント名          | ウェイト  |
| ------------------ | ------------------- | --------- |
| 見出し（h1〜h3）   | `M PLUS Rounded 1c` | 700 / 800 |
| 本文・説明文       | `Noto Serif JP`     | 400 / 500 |
| ボタン・バッジ・UI | `M PLUS Rounded 1c` | 500       |

### フォントサイズ基準

| 要素                     | PC   | SP   |
| ------------------------ | ---- | ---- |
| h1（ヒーロータイトル）   | 52px | 32px |
| h2（セクションタイトル） | 32px | 24px |
| h3（カードタイトル）     | 20px | 18px |
| 本文                     | 16px | 14px |
| サブテキスト             | 14px | 12px |
| バッジ                   | 12px | 11px |

---

## 全体レイアウト方針

- 背景は基本ホワイト（`#FFFFFF`）またはごく薄いオフホワイト（`#FAFAFA`）
- セクションとセクションの間には**必ず4色の波線区切りコンポーネント**を挿入する
- カードは角丸（`border-radius: 12px`）＋ 薄いドロップシャドウ
- 全体的に余白（padding / margin）を広めに取り、読みやすさを確保する
- スマートフォン対応（レスポンシブ）必須
- ブレークポイント：768px（SP / PC 切り替え）
