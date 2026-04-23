'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function FrontendError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
            エラーが発生しました
          </h1>
          <p className="text-muted-foreground font-body mb-8">
            申し訳ありません。ページの読み込み中に問題が発生しました。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-heading font-medium hover:opacity-85 transition-opacity"
            >
              <RefreshCw className="h-4 w-4" />
              再読み込み
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-full font-heading font-medium hover:bg-muted transition-colors"
            >
              <Home className="h-4 w-4" />
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
