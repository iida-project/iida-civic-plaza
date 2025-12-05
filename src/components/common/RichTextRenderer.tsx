'use client'

import { useEffect, useRef } from 'react'

type RichTextSize = 'default' | 'large' | 'small'

type Props = {
  html: string
  size?: RichTextSize
  addHeadingIds?: boolean
  className?: string
}

/**
 * リッチテキスト（HTML）をスタイリングして表示するコンポーネント
 *
 * - Tailwind Typographyを使用
 * - XSS対策として信頼できるソースからのHTMLのみ使用すること
 * - 見出しに自動でIDを付与（目次連携用）
 */
export function RichTextRenderer({
  html,
  size = 'default',
  addHeadingIds = false,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !addHeadingIds) return

    // 見出しにIDを付与（目次との連携用）
    const headings = containerRef.current.querySelectorAll('h2, h3')
    headings.forEach((el, index) => {
      el.id = `heading-${index}`
    })
  }, [html, addHeadingIds])

  // サイズに応じたproseクラス
  const sizeClass = {
    small: 'prose-sm',
    default: 'prose-lg',
    large: 'prose-xl',
  }[size]

  return (
    <div
      ref={containerRef}
      className={`prose ${sizeClass} max-w-none
        prose-headings:font-bold prose-headings:text-foreground
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2
        prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
        prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
        prose-li:text-foreground/80 prose-li:my-1
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-foreground/70
        prose-img:rounded-xl prose-img:my-8
        prose-hr:my-8 prose-hr:border-border
        prose-table:border-collapse prose-table:w-full
        prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-muted prose-th:font-semibold prose-th:text-left
        prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/**
 * 記事本文用のリッチテキストレンダラー
 * 見出しID自動付与あり（目次連携用）
 */
export function ArticleBody({ html }: { html: string }) {
  return (
    <RichTextRenderer
      html={html}
      size="large"
      addHeadingIds={true}
    />
  )
}
