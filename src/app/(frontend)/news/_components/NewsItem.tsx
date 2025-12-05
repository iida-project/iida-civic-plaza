'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

type NewsPost = {
  id: string
  slug: string
  title: string
  body: string | null
  published_at: string | null
}

type Props = {
  news: NewsPost
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function NewsItem({ news }: Props) {
  const excerpt = news.body ? truncate(stripHtml(news.body), 100) : ''

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/news/${news.slug}`}
        className="flex items-start gap-4 p-4 sm:p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
      >
        {/* 日付 */}
        <div className="flex-shrink-0 text-center">
          {news.published_at ? (
            <div className="w-16">
              <div className="text-2xl font-bold text-primary">
                {format(new Date(news.published_at), 'd', { locale: ja })}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(news.published_at), 'yyyy年M月', { locale: ja })}
              </div>
            </div>
          ) : (
            <div className="w-16 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {news.title}
          </h2>
          {excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>

        {/* 矢印 */}
        <div className="flex-shrink-0 self-center">
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </motion.article>
  )
}
