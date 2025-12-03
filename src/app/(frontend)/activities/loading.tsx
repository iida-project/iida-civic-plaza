export default function Loading() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-72 bg-muted rounded animate-pulse" />
        </div>

        {/* フィルタセクション skeleton */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border mb-8">
          <div className="mb-6">
            <div className="h-6 w-24 bg-muted rounded animate-pulse mb-3" />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-muted rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
          <div>
            <div className="h-6 w-24 bg-muted rounded animate-pulse mb-3" />
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-16 bg-muted rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* カード一覧 skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl shadow-md overflow-hidden border border-border"
            >
              <div className="w-full h-48 bg-muted animate-pulse" />
              <div className="p-5">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-3" />
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                  <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
