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
      className={`rich-text-content prose ${sizeClass} max-w-none
        prose-headings:text-foreground
        prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2
        prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
        [&_p]:mb-5 [&_p]:leading-7
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:my-4 prose-ul:pl-6
        prose-ol:my-4 prose-ol:pl-6
        prose-li:text-foreground/80 prose-li:my-1
        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4
        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4
        [&_li]:my-1 [&_li]:marker:text-orange-500
        [&_li>p]:mb-0 [&_li>p]:inline
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-foreground/70
        prose-img:rounded-xl prose-img:my-8
        prose-hr:my-8 prose-hr:border-border
        prose-table:border-collapse prose-table:w-full
        prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-muted prose-th:font-semibold prose-th:text-left
        prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto
        [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:pl-4 [&_h2]:py-2 [&_h2]:border-l-4 [&_h2]:border-l-orange-500 [&_h2]:bg-gradient-to-r [&_h2]:from-orange-500/10 [&_h2]:to-transparent [&_h2]:rounded-r-lg
        [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:pl-4 [&_h3]:border-l-[3px] [&_h3]:border-l-emerald-500
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
