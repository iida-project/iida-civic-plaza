export default function Loading() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー skeleton */}
        <div className="mb-8">
          <div className="h-10 w-32 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-56 bg-muted rounded animate-pulse" />
        </div>

        {/* リスト skeleton */}
        <div className="space-y-4 max-w-3xl">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border"
            >
              {/* 日付 skeleton */}
              <div className="w-16 flex-shrink-0">
                <div className="h-8 w-8 bg-muted rounded animate-pulse mx-auto mb-1" />
                <div className="h-3 w-14 bg-muted rounded animate-pulse mx-auto" />
              </div>

              {/* コンテンツ skeleton */}
              <div className="flex-1">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </div>

              {/* 矢印 skeleton */}
              <div className="w-5 h-5 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
