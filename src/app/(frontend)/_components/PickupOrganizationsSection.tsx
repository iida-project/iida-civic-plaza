'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Users, MapPin, UserPlus } from 'lucide-react'
import { stripHtml } from '@/lib/utils'

type Organization = {
  id: string
  slug: string
  name: string
  short_name: string | null
  summary: string
  main_image_url: string | null
  is_recruiting: boolean | null
  categories: { name: string }[]
  areas: { name: string }[]
}

type Props = {
  organizations: Organization[]
}

const cardBorderColors = [
  'border-l-apple-red',
  'border-l-apple-orange',
  'border-l-apple-green',
  'border-l-apple-blue',
]

export function PickupOrganizationsSection({ organizations }: Props) {
  if (organizations.length === 0) return null

  return (
    <section className="py-16 sm:py-24">
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
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">ピックアップ団体</h2>
          </div>
          <Link
            href="/activities"
            className="hidden sm:inline-flex items-center gap-2 text-apple-blue font-heading font-bold border-b border-apple-blue hover:opacity-70 transition-opacity"
          >
            すべて見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org, index) => (
            <motion.article
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/activities/${org.slug}`}
                className={`block h-full bg-card rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all group overflow-hidden border-l-4 ${cardBorderColors[index % 4]}`}
              >
                {/* 画像 */}
                <div className="relative w-full h-48 bg-muted">
                  {org.main_image_url ? (
                    <Image
                      src={org.main_image_url}
                      alt={org.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* 会員募集中バッジ */}
                  {org.is_recruiting && (
                    <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500 text-white text-xs font-bold rounded-sm shadow-lg ring-2 ring-white">
                      <UserPlus className="h-3 w-3" />
                      募集中
                    </span>
                  )}
                </div>

                {/* コンテンツ */}
                <div className="p-5">
                  <h3 className="text-lg font-heading font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {org.short_name || org.name}
                  </h3>

                  {/* カテゴリ・エリア */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {org.categories.slice(0, 2).map((cat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {org.areas.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        <MapPin className="h-3 w-3" />
                        {org.areas[0].name}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-body text-muted-foreground line-clamp-2">
                    {stripHtml(org.summary)}
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
            href="/activities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-apple-blue text-white rounded-full font-heading font-medium hover:opacity-85 transition-opacity cursor-pointer"
          >
            すべての団体を見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
