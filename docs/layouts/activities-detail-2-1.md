# 市民活動紹介 詳細ページ - 2:1レイアウト

このファイルは元の2:1レイアウトの構造を保存しています。
現在のレイアウトから戻す場合に参照してください。

## レイアウト構造

```
┌─────────────────────────────────┬─────────────────┐
│ メインコンテンツ (2/3)           │ サイドバー (1/3) │
│ ├─ 戻るリンク                   │ ├─ 団体情報      │
│ ├─ タイトル + 募集バッジ         │ ├─ 連絡先       │
│ ├─ メイン画像                   │ ├─ 外部リンク    │
│ ├─ 概要説明                     │ └─ 他の活動団体  │
│ ├─ 活動分野/エリア/タグ          │                 │
│ ├─ 活動内容                     │                 │
│ ├─ 画像ギャラリー               │                 │
│ ├─ 参加方法                     │                 │
│ └─ 関連インタビュー              │                 │
└─────────────────────────────────┴─────────────────┘
```

## 実装コード（グリッド部分）

```tsx
// ページコンポーネント内
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* メインコンテンツ（左側 2/3） */}
  <div className="lg:col-span-2 space-y-8">
    {/* タイトル */}
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold">{org.name}</h1>
        {org.is_recruiting && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white text-sm font-bold rounded-sm shadow-md">
            <UserPlus className="h-4 w-4" />
            会員募集中
          </span>
        )}
      </div>
      {org.short_name && org.short_name !== org.name && (
        <p className="text-lg text-muted-foreground">{org.short_name}</p>
      )}
    </div>

    {/* メイン画像 */}
    <div className="relative w-full aspect-video bg-muted rounded-2xl overflow-hidden">
      {org.main_image_url ? (
        <Image
          src={org.main_image_url}
          alt={org.name}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Users className="h-24 w-24 text-muted-foreground/30" />
        </div>
      )}
    </div>

    {/* 概要説明 */}
    <div className="text-foreground/80">
      <RichTextRenderer html={org.summary} size="default" />
    </div>

    {/* 活動分野・エリア・タグ */}
    <div className="space-y-3">
      {/* 活動分野 */}
      {org.categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Folder className="h-4 w-4" />
            活動分野:
          </span>
          {org.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/activities?category=${cat.slug}`}
              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* 活動エリア */}
      {org.areas.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            活動エリア:
          </span>
          {org.areas.map((area) => (
            <Link
              key={area.id}
              href={`/activities?area=${area.slug}`}
              className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full hover:bg-secondary/20 transition-colors"
            >
              {area.name}
            </Link>
          ))}
        </div>
      )}

      {/* タグ */}
      {org.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4" />
            タグ:
          </span>
          {org.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-apple-green/10 text-apple-green text-sm rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* 活動内容 */}
    {org.activity_description && (
      <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
          <Users className="h-5 w-5 text-primary" />
          活動内容
        </h2>
        <RichTextRenderer html={org.activity_description} size="default" />
      </div>
    )}

    {/* 画像ギャラリー */}
    {galleryImages.length > 0 && (
      <ImageGallery images={galleryImages} alt={`${org.name}の活動写真`} title="活動の様子" />
    )}

    {/* 参加方法 */}
    {org.participation_info && (
      <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
          <UserPlus className="h-5 w-5 text-primary" />
          参加方法
        </h2>
        <RichTextRenderer html={org.participation_info} size="default" />
      </div>
    )}

    {/* 関連インタビュー */}
    {relatedInterviews.length > 0 && (
      <RelatedInterviews interviews={relatedInterviews} />
    )}
  </div>

  {/* サイドバー（右側 1/3） */}
  <div className="space-y-6">
    {/* 団体情報 */}
    {hasOrgInfo && (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">団体情報</h2>
        <dl className="space-y-3">
          {/* 代表者、設立年、会員数、会費、活動日、活動場所 */}
        </dl>
      </div>
    )}

    {/* 連絡先 */}
    {hasContactInfo && (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">連絡先</h2>
        {/* 担当者、メール、電話 */}
      </div>
    )}

    {/* 外部リンク */}
    {hasSocialLinks && (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">外部リンク</h2>
        {/* Website, Facebook, Twitter, Instagram */}
      </div>
    )}

    {/* 他の活動団体 */}
    {otherOrganizations.length > 0 && (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Users className="h-5 w-5 text-primary" />
          他の活動団体
        </h2>
        {/* 団体リスト */}
      </div>
    )}
  </div>
</div>
```

## 特徴

- **グリッド**: `lg:grid-cols-3` で3カラム、メインが `lg:col-span-2` で2/3幅
- **レスポンシブ**: モバイルでは1カラム、PCで2:1
- **サイドバー**: 固定幅（1/3）でスクロールに追従しない

## 戻し方

1. `src/app/(frontend)/activities/[slug]/page.tsx` を開く
2. 現在の1:1:1グリッドを上記の2:1グリッド構造に置き換える
3. サイドバーの `md:row-span-2` を削除
4. 活動内容の `md:col-span-2` を削除し、メインコンテンツ内に移動
