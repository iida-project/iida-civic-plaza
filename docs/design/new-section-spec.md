# セクション別実装仕様書 - 飯田の市民活動ひろば TOPページ

---

## 1. ヘッダー

### 変更内容

- ロゴを左端に配置（現状維持）
- ナビゲーションリンクのホバー時カラーを `var(--color-pink)` に変更
- ヘッダー下部のボーダーラインを4色グラデーションラインに変更（3px）

### CSS

```css
header {
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(
      to right,
      var(--color-pink),
      var(--color-orange),
      var(--color-green),
      var(--color-blue)
    )
    1;
}

nav a:hover {
  color: var(--color-pink);
  transition: color 0.2s ease;
}
```

---

## 2. ヒーローセクション

### テキスト構成

```
[COMMUNITY]  [SENIOR WISDOM]  [IIDA CITY]   ← バッジ 3つ（横並び）

みんなのムトスを応援                          ← h1 / M PLUS Rounded 1c Bold

つなげる、広がる、飯田市の市民活動              ← サブテキスト / Noto Serif JP

[活動をはじめる]   [団体を探す]               ← ボタン 2つ
```

### バッジ仕様

| バッジテキスト  | 背景色    | 文字色    |
| --------------- | --------- | --------- |
| `COMMUNITY`     | `#F4A7B9` | `#FFFFFF` |
| `SENIOR WISDOM` | `#F9C784` | `#FFFFFF` |
| `IIDA CITY`     | `#A8D5A2` | `#FFFFFF` |

### ボタン仕様

| ボタン名       | 背景色    | 文字色    | ボーダー            |
| -------------- | --------- | --------- | ------------------- |
| 活動をはじめる | `#F4A7B9` | `#FFFFFF` | なし                |
| 団体を探す     | `#FFFFFF` | `#90C8E0` | `2px solid #90C8E0` |

### 背景グラデーション CSS

```css
.hero {
  background: linear-gradient(
    135deg,
    rgba(244, 167, 185, 0.25) 0%,
    rgba(249, 199, 132, 0.2) 25%,
    rgba(168, 213, 162, 0.2) 60%,
    rgba(144, 200, 224, 0.25) 100%
  );
  padding: 100px 24px 80px;
  text-align: center;
}
```

### バッジ・ボタン CSS

```css
.hero-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 4px 16px;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 52px;
  font-weight: 800;
  color: var(--color-text-main);
  line-height: 1.3;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: 18px;
  color: var(--color-text-sub);
  margin-bottom: 40px;
}

.btn-primary {
  background: var(--color-pink);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 14px 36px;
  font-family: var(--font-ui);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  margin: 0 8px;
}

.btn-secondary {
  background: #ffffff;
  color: var(--color-blue);
  border: 2px solid var(--color-blue);
  border-radius: 999px;
  padding: 12px 36px;
  font-family: var(--font-ui);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  margin: 0 8px;
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}
```

---

## 3. 波線区切りコンポーネント（共通）

### 概要

全セクション間に挿入する共通コンポーネント。
4色の波線を上下にわずかにずらして重ねて表示する。

### HTML

```html
<div class="wave-divider" aria-hidden="true">
  <svg
    viewBox="0 0 1200 60"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="60"
  >
    <!-- グリーン波線（一番奥） -->
    <path
      d="M0,22 C200,2 400,42 600,22 C800,2 1000,42 1200,22"
      fill="none"
      stroke="#A8D5A2"
      stroke-width="3"
      stroke-linecap="round"
    />
    <!-- ブルー波線 -->
    <path
      d="M0,46 C200,26 400,56 600,36 C800,16 1000,46 1200,26"
      fill="none"
      stroke="#90C8E0"
      stroke-width="3"
      stroke-linecap="round"
    />
    <!-- オレンジ波線 -->
    <path
      d="M0,38 C200,18 400,58 600,38 C800,18 1000,58 1200,38"
      fill="none"
      stroke="#F9C784"
      stroke-width="3"
      stroke-linecap="round"
    />
    <!-- ピンク波線（一番手前） -->
    <path
      d="M0,30 C200,10 400,50 600,30 C800,10 1000,50 1200,30"
      fill="none"
      stroke="#F4A7B9"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</div>
```

### CSS

```css
.wave-divider {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  margin: 8px 0;
}

.wave-divider svg {
  display: block;
  width: 100%;
  height: 60px;
}
```

---

## 4. 新着情報セクション

### 変更内容

- セクションタイトル左側に `var(--color-orange)` の縦カラーバー（幅4px・高さ1em）を追加
- カードにホバーエフェクト：`transform: translateY(-4px)` ＋シャドウ強調
- カードのカテゴリバッジ色をロゴ4色でローテーション（順番：ピンク→オレンジ→グリーン→ブルー→繰り返し）

### CSS

```css
.section-title {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 1.2em;
  background: var(--color-orange);
  border-radius: 3px;
  flex-shrink: 0;
}

.news-card {
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  background: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

/* カテゴリバッジ 4色ローテーション */
.badge:nth-child(4n + 1) {
  background: var(--color-pink);
}
.badge:nth-child(4n + 2) {
  background: var(--color-orange);
}
.badge:nth-child(4n + 3) {
  background: var(--color-green);
}
.badge:nth-child(4n + 0) {
  background: var(--color-blue);
}

.badge {
  color: #ffffff;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  display: inline-block;
}
```

---

## 5. 市民活動を探すセクション

### 変更内容

- セクション背景をごく薄い4色グラデーション（opacity 0.08）に変更
- 「分野から探す」「地域から探す」の見出しに `var(--color-green)` のアンダーラインを追加
- セクションタイトル左にカラーバー（新着情報セクションと共通スタイル）

### CSS

```css
.explore-section {
  background: linear-gradient(
    135deg,
    rgba(244, 167, 185, 0.08) 0%,
    rgba(249, 199, 132, 0.08) 33%,
    rgba(168, 213, 162, 0.08) 66%,
    rgba(144, 200, 224, 0.08) 100%
  );
  padding: 64px 24px;
}

.explore-subtitle {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-main);
  border-bottom: 3px solid var(--color-green);
  display: inline-block;
  padding-bottom: 4px;
  margin-bottom: 20px;
}
```

---

## 6. ピックアップ団体セクション

### 変更内容

- カード左端に縦カラーバー（幅4px）を4色でローテーション配置
- 「すべて見る」リンクカラーを `var(--color-blue)` に変更
- カードホバーエフェクト（新着情報セクションと共通）

### CSS

```css
.pickup-card {
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  background: #ffffff;
  border-left: 4px solid transparent;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
}

.pickup-card:nth-child(4n + 1) {
  border-left-color: var(--color-pink);
}
.pickup-card:nth-child(4n + 2) {
  border-left-color: var(--color-orange);
}
.pickup-card:nth-child(4n + 3) {
  border-left-color: var(--color-green);
}
.pickup-card:nth-child(4n + 0) {
  border-left-color: var(--color-blue);
}

.pickup-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.link-all {
  color: var(--color-blue);
  font-family: var(--font-ui);
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid var(--color-blue);
  transition: opacity 0.2s ease;
}

.link-all:hover {
  opacity: 0.7;
}
```

---

## 7. CTAセクション（さあ、あなたも参加しませんか？）

### 変更内容

- 背景を4色の淡いグラデーション（ヒーローセクションと同様）に変更
- ボタン2つのカラーをりんごピンク・りんごブルーに統一
- セクションタイトルフォントを `M PLUS Rounded 1c` Bold に変更

### CSS

```css
.cta-section {
  background: linear-gradient(
    135deg,
    rgba(244, 167, 185, 0.25) 0%,
    rgba(249, 199, 132, 0.2) 25%,
    rgba(168, 213, 162, 0.2) 60%,
    rgba(144, 200, 224, 0.25) 100%
  );
  padding: 80px 24px;
  text-align: center;
}

.cta-title {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text-main);
  margin-bottom: 16px;
}

.cta-subtitle {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text-sub);
  margin-bottom: 40px;
}
```

---

## 8. フッター

### 変更内容

- フッター上部のボーダーラインを4色グラデーションラインに変更（ヘッダーと統一）
- フッター背景：`#F9F9F9`（薄いグレー）
- フッター内リンクのホバーカラーを `var(--color-pink)` に変更

### CSS

```css
footer {
  background: #f9f9f9;
  border-top: 3px solid transparent;
  border-image: linear-gradient(
      to right,
      var(--color-pink),
      var(--color-orange),
      var(--color-green),
      var(--color-blue)
    )
    1;
  padding: 48px 24px 24px;
}

footer a:hover {
  color: var(--color-pink);
  transition: color 0.2s ease;
}
```
