export default function Loading() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー skeleton */}
        <div className="mb-8">
          <div className="h-10 w-40 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-64 bg-muted rounded animate-pulse" />
        </div>

        {/* フィルターセクション skeleton */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-muted rounded-full animate-pulse" />
                <div className="h-8 w-16 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* カード一覧 skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-5 shadow-md border border-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-6 w-4/5 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse mb-3" />
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
