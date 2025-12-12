'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from 'lucide-react'

type Heading = {
  id: string
  text: string
  level: number
}

type Props = {
  html: string
}

export function MobileTableOfContents({ html }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)

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
        // スクロール中は更新しない
        if (isScrolling) return

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
  }, [headings, isScrolling])

  // ドロワーが開いているときはスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (headings.length === 0) {
    return null
  }

  const handleClick = (headingId: string) => {
    // スクロール中フラグをON（IntersectionObserverの更新を一時停止）
    setIsScrolling(true)
    // クリックした見出しを即座にアクティブに設定
    setActiveId(headingId)

    const element = document.getElementById(headingId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)

    // スクロール完了後にフラグをOFF（通常のスクロール監視を再開）
    setTimeout(() => {
      setIsScrolling(false)
    }, 800)
  }

  const currentHeading = headings.find((h) => h.id === activeId)

  return (
    <>
      {/* フローティングボタン - モバイルのみ表示 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all active:scale-95"
        aria-label="目次を開く"
      >
        <List className="h-5 w-5" />
        <span className="text-sm font-medium max-w-[120px] truncate">
          {currentHeading ? currentHeading.text : '目次'}
        </span>
      </button>

      {/* オーバーレイ + ドロワー */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景オーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* ドロワー */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl max-h-[70vh] overflow-hidden"
            >
              {/* ヘッダー */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <List className="h-5 w-5 text-primary" />
                  目次
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="閉じる"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 目次リスト */}
              <nav className="p-4 overflow-y-auto max-h-[calc(70vh-60px)]">
                <ul className="space-y-1">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
                    >
                      <button
                        type="button"
                        onClick={() => handleClick(heading.id)}
                        className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
                          activeId === heading.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
