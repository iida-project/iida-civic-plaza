'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Mic, Wallet, Bell, UserPlus } from 'lucide-react'

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
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="w-1.5 h-[1.2em] bg-apple-orange rounded-sm flex-shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">新着情報</h2>
        </motion.div>

        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden divide-y divide-border">
          {articles.map((article, index) => {
            const config = typeConfig[article.type]
            const Icon = config.icon
            const date = new Date(article.published_at)
            const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
            return (
              <motion.article
                key={`${article.type}-${article.id}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={getArticleHref(article)}
                  className="flex items-start sm:items-center gap-3 sm:gap-4 px-5 py-4 hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-sm text-muted-foreground font-heading whitespace-nowrap pt-0.5 sm:pt-0">
                    {dateStr}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 ${config.color} text-white text-xs font-heading font-medium rounded-full whitespace-nowrap flex-shrink-0`}
                  >
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                  <span className="font-heading font-medium text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                  {article.type === 'organization' && article.is_recruiting && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-white text-[10px] font-bold rounded-sm bg-gradient-to-r from-red-500 to-orange-400 animate-pulse-soft whitespace-nowrap flex-shrink-0">
                      <UserPlus className="h-2.5 w-2.5" />
                      募集中
                    </span>
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
