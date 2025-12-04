'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mic, Star, Building2 } from 'lucide-react'

type Interview = {
  id: string
  slug: string
  title: string
  lead_text: string
  main_image_url: string | null
  is_featured: boolean | null
  published_at: string | null
  organization: {
    name: string
    slug: string
  } | null
}

type Props = {
  interview: Interview
  featured?: boolean
}

export function InterviewCard({ interview, featured = false }: Props) {
  // ピックアップ用の横並びレイアウト
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group md:col-span-2"
      >
        <Link
          href={`/interviews/${interview.slug}`}
          className="flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow"
        >
          {/* 画像（左側） */}
          <div className="relative w-full md:w-2/5 aspect-video md:aspect-[4/3] bg-muted overflow-hidden">
            {interview.main_image_url ? (
              <Image
                src={interview.main_image_url}
                alt={interview.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Mic className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}

            {/* ピックアップバッジ */}
            <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-apple-orange text-white text-xs font-medium rounded-full">
              <Star className="h-3 w-3 fill-current" />
              ピックアップ
            </div>
          </div>

          {/* コンテンツ（右側） */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
            {/* 関連団体 */}
            {interview.organization && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Building2 className="h-3 w-3" />
                {interview.organization.name}
              </div>
            )}

            {/* タイトル */}
            <h2 className="font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2 text-xl md:text-2xl">
              {interview.title}
            </h2>

            {/* リード文 */}
            <p className="text-foreground/70 line-clamp-3 text-sm">
              {interview.lead_text}
            </p>
          </div>
        </Link>
      </motion.article>
    )
  }

  // 通常カード（縦並び）
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link
        href={`/interviews/${interview.slug}`}
        className="block bg-card rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow"
      >
        {/* 画像 */}
        <div className="relative w-full aspect-video bg-muted overflow-hidden">
          {interview.main_image_url ? (
            <Image
              src={interview.main_image_url}
              alt={interview.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Mic className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-5">
          {/* 関連団体 */}
          {interview.organization && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Building2 className="h-3 w-3" />
              {interview.organization.name}
            </div>
          )}

          {/* タイトル */}
          <h2 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 text-lg">
            {interview.title}
          </h2>

          {/* リード文 */}
          <p className="text-foreground/70 line-clamp-2 text-sm">
            {interview.lead_text}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
