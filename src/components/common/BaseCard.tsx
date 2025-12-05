'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

type BaseCardProps = {
  href: string
  children: ReactNode
  className?: string
}

/**
 * カードの基本コンポーネント
 * ホバー時の浮き上がりアニメーションと共通スタイルを提供
 */
export function BaseCard({ href, children, className = '' }: BaseCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link
        href={href}
        className={`block h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all ${className}`}
      >
        {children}
      </Link>
    </motion.article>
  )
}

type CardImageProps = {
  src: string | null
  alt: string
  aspectRatio?: 'video' | 'square' | '4/3' | '3/2'
  fallbackIcon?: LucideIcon
  priority?: boolean
}

/**
 * カード用の画像コンポーネント
 */
export function CardImage({
  src,
  alt,
  aspectRatio = 'video',
  fallbackIcon: FallbackIcon,
  priority = false,
}: CardImageProps) {
  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
  }[aspectRatio]

  return (
    <div className={`relative w-full ${aspectClass} bg-muted overflow-hidden`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
      ) : FallbackIcon ? (
        <div className="w-full h-full flex items-center justify-center">
          <FallbackIcon className="h-12 w-12 text-muted-foreground/30" />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-muted-foreground/10" />
        </div>
      )}
    </div>
  )
}

type CardContentProps = {
  children: ReactNode
  className?: string
}

/**
 * カードのコンテンツエリア
 */
export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>
}

type CardTitleProps = {
  children: ReactNode
  className?: string
}

/**
 * カードのタイトル
 */
export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3
      className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 ${className}`}
    >
      {children}
    </h3>
  )
}

type CardDescriptionProps = {
  children: ReactNode
  className?: string
}

/**
 * カードの説明文
 */
export function CardDescription({
  children,
  className = '',
}: CardDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground line-clamp-2 ${className}`}>
      {children}
    </p>
  )
}

type CardBadgeProps = {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'accent'
  className?: string
}

/**
 * カード用のバッジ
 */
export function CardBadge({
  children,
  variant = 'default',
  className = '',
}: CardBadgeProps) {
  const variantClass = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-apple-green/10 text-apple-green',
    accent: 'bg-apple-orange/10 text-apple-orange',
  }[variant]

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`}
    >
      {children}
    </span>
  )
}
