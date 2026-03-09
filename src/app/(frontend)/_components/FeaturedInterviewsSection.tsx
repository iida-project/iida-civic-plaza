'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Mic } from 'lucide-react'

type Interview = {
  id: string
  slug: string
  title: string
  lead_text: string
  main_image_url: string | null
  organization: {
    name: string
  } | null
}

type Props = {
  interviews: Interview[]
}

export function FeaturedInterviewsSection({ interviews }: Props) {
  if (interviews.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-[1.2em] bg-apple-orange rounded-sm flex-shrink-0" />
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">おすすめインタビュー</h2>
          </div>
          <Link
            href="/interviews"
            className="hidden sm:inline-flex items-center gap-2 text-apple-blue font-heading font-bold border-b border-apple-blue hover:opacity-70 transition-opacity"
          >
            すべて見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {interviews.map((interview, index) => (
            <motion.article
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/interviews/${interview.slug}`}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all group border border-transparent hover:border-secondary/20"
              >
                {/* 画像 */}
                <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                  {interview.main_image_url ? (
                    <Image
                      src={interview.main_image_url}
                      alt={interview.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Mic className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* コンテンツ */}
                <div className="flex-1 min-w-0">
                  {interview.organization && (
                    <p className="text-sm font-heading text-secondary font-medium mb-1">
                      {interview.organization.name}
                    </p>
                  )}
                  <h3 className="text-lg font-heading font-semibold mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                    {interview.title}
                  </h3>
                  <p className="text-sm font-body text-muted-foreground line-clamp-2">
                    {interview.lead_text}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-heading font-medium hover:opacity-85 transition-opacity cursor-pointer"
          >
            すべてのインタビューを見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
