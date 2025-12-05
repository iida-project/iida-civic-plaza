import Link from 'next/link'
import { Bell, ArrowLeft } from 'lucide-react'

export default function NewsNotFound() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Bell className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            お知らせが見つかりません
          </h1>
          <p className="text-muted-foreground mb-8">
            お探しのお知らせは削除されたか、URLが変更された可能性があります。
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            お知らせ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
