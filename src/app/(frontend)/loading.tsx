export default function Loading() {
  return (
    <div className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="h-10 w-2/3 bg-muted rounded-lg animate-pulse mb-4 mx-auto" />
          <div className="h-5 w-1/2 bg-muted rounded animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  )
}
