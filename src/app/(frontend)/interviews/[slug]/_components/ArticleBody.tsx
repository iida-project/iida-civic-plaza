'use client'

import { useEffect, useRef } from 'react'

type Props = {
  html: string
}

export function ArticleBody({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 見出しにIDを付与
    const headings = containerRef.current.querySelectorAll('h2, h3')
    headings.forEach((el, index) => {
      el.id = `heading-${index}`
    })
  }, [html])

  return (
    <div
      ref={containerRef}
      className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-foreground
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:my-4 prose-ol:my-4
        prose-li:text-foreground/80 prose-li:my-1
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-6 prose-blockquote:italic
        prose-img:rounded-xl prose-img:my-8
        prose-hr:my-8 prose-hr:border-border
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
