export default function Loading() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー skeleton */}
        <div className="mb-8">
          <div className="h-10 w-56 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-80 bg-muted rounded animate-pulse" />
        </div>

        {/* ピックアップセクション skeleton */}
        <div className="mb-12">
          <div className="h-6 w-32 bg-muted rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl overflow-hidden shadow-md border border-border"
              >
                <div className="w-full aspect-[2/1] bg-muted animate-pulse" />
                <div className="p-6">
                  <div className="h-3 w-24 bg-muted rounded animate-pulse mb-3" />
                  <div className="h-7 w-3/4 bg-muted rounded animate-pulse mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 通常記事 skeleton */}
        <div>
          <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl overflow-hidden shadow-md border border-border"
              >
                <div className="w-full aspect-video bg-muted animate-pulse" />
                <div className="p-5">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-6 w-4/5 bg-muted rounded animate-pulse mb-2" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
