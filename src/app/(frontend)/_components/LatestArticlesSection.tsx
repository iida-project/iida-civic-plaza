'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Mic, Wallet, Bell, UserPlus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { stripHtml } from '@/lib/utils'

type Article = {
  id: string
  slug: string
  title: string
  type: 'organization' | 'interview' | 'grant' | 'news'
  published_at: string
  summary?: string
  is_recruiting?: boolean | null
}

type Props = {
  articles: Article[]
}

const typeConfig = {
  organization: {
    label: '団体紹介',
    icon: Users,
    color: 'bg-apple-red',
    textColor: 'text-apple-red',
    href: '/activities',
  },
  interview: {
    label: 'インタビュー',
    icon: Mic,
    color: 'bg-apple-green',
    textColor: 'text-apple-green',
    href: '/interviews',
  },
  grant: {
    label: '助成金',
    icon: Wallet,
    color: 'bg-apple-orange',
    textColor: 'text-apple-orange',
    href: '/grants',
  },
  news: {
    label: 'お知らせ',
    icon: Bell,
    color: 'bg-apple-blue',
    textColor: 'text-apple-blue',
    href: '/news',
  },
}

function getArticleHref(article: Article): string {
  switch (article.type) {
    case 'organization':
      return `/activities/${article.slug}`
    case 'interview':
      return `/interviews/${article.slug}`
    case 'grant':
      return `/grants/${article.slug}`
    case 'news':
      return `/news/${article.slug}`
  }
}

export function LatestArticlesSection({ articles }: Props) {
  if (articles.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">新着情報</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => {
            const config = typeConfig[article.type]
            const Icon = config.icon
            return (
              <motion.article
                key={`${article.type}-${article.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={getArticleHref(article)}
                  className="relative block h-full p-6 bg-card rounded-2xl shadow-md hover:shadow-lg transition-all group border border-transparent hover:border-primary/20"
                >
                  {/* 会員募集中バッジ */}
                  {article.type === 'organization' && article.is_recruiting && (
                    <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500 text-white text-xs font-bold rounded-sm shadow-lg ring-2 ring-white">
                      <UserPlus className="h-3 w-3" />
                      募集中
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.color} text-white text-xs font-medium rounded-full`}
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(article.published_at), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {stripHtml(article.summary)}
                    </p>
                  )}
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
