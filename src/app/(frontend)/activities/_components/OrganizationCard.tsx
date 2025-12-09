'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, MapPin, UserPlus } from 'lucide-react'
import { stripHtml } from '@/lib/utils'

type Organization = {
  id: string
  slug: string
  name: string
  short_name: string | null
  summary: string
  main_image_url: string | null
  is_recruiting: boolean | null
  categories: { name: string; slug: string }[]
  areas: { name: string; slug: string }[]
  tags: { name: string; slug: string }[]
}

type Props = {
  organization: Organization
  index?: number
}

export function OrganizationCard({ organization, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/activities/${organization.slug}`}
        className="block h-full bg-card rounded-2xl shadow-md hover:shadow-lg transition-all group overflow-hidden border border-transparent hover:border-primary/20"
      >
        {/* 画像 */}
        <div className="relative w-full h-48 bg-muted">
          {organization.main_image_url ? (
            <Image
              src={organization.main_image_url}
              alt={organization.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          {/* 会員募集中バッジ */}
          {organization.is_recruiting && (
            <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500 text-white text-xs font-bold rounded-sm shadow-lg ring-2 ring-white">
              <UserPlus className="h-3 w-3" />
              募集中
            </span>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {organization.short_name || organization.name}
          </h3>

          {/* カテゴリ・エリア */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {organization.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.slug}
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
              >
                {cat.name}
              </span>
            ))}
            {organization.areas.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                <MapPin className="h-3 w-3" />
                {organization.areas[0].name}
                {organization.areas.length > 1 && (
                  <span> 他{organization.areas.length - 1}エリア</span>
                )}
              </span>
            )}
          </div>

          <p className="text-sm text-foreground/70 line-clamp-2">
            {stripHtml(organization.summary)}
          </p>

          {/* タグ */}
          {organization.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {organization.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.slug}
                  className="px-2 py-0.5 bg-apple-green/10 text-apple-green text-xs rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}
