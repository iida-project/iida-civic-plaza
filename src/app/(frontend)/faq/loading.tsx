export default function Loading() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー skeleton */}
        <div className="mb-8 text-center">
          <div className="h-10 w-48 bg-muted rounded-lg animate-pulse mx-auto mb-2" />
          <div className="h-5 w-72 bg-muted rounded animate-pulse mx-auto" />
        </div>

        {/* FAQ skeleton */}
        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
