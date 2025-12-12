'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'

type Heading = {
  id: string
  text: string
  level: number
}

type Props = {
  html: string
}

export function TableOfContents({ html }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // HTMLから見出しを抽出
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const elements = doc.querySelectorAll('h2, h3')

    const extracted: Heading[] = []
    elements.forEach((el, index) => {
      const id = `heading-${index}`
      const text = el.textContent || ''
      const level = parseInt(el.tagName.charAt(1))
      extracted.push({ id, text, level })
    })

    setHeadings(extracted)
  }, [html])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="hidden lg:block bg-card rounded-2xl p-5 border border-border sticky top-24 z-10">
      <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
        <List className="h-4 w-4 text-primary" />
        目次
      </h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors hover:text-primary ${
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  const offset = 100 // ヘッダー分のオフセット
                  const elementPosition = element.getBoundingClientRect().top + window.scrollY
                  window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                  })
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
