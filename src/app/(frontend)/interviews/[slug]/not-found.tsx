import Link from 'next/link'
import { Mic, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="w-24 h-24 mx-auto mb-8 bg-muted rounded-full flex items-center justify-center">
          <Mic className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">インタビューが見つかりません</h1>
        <p className="text-muted-foreground mb-8">
          お探しの記事は存在しないか、公開されていない可能性があります。
        </p>
        <Link
          href="/interviews"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          インタビュー一覧に戻る
        </Link>
      </div>
    </div>
  )
}
