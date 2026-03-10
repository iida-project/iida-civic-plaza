import type { Metadata } from 'next'
import Link from 'next/link'
import { Construction, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ページ準備中',
}

export default function ComingSoonPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-apple-orange/20 rounded-full flex items-center justify-center">
          <Construction className="h-8 w-8 text-apple-orange" />
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-4">
          ページ準備中
        </h1>
        <p className="font-body text-muted-foreground mb-8 leading-relaxed">
          このページは現在準備中です。
          <br />
          公開までもうしばらくお待ちください。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-apple-red text-white rounded-full font-heading font-bold hover:opacity-85 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          トップページへ戻る
        </Link>
      </div>
    </div>
  )
}
