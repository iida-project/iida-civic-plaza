'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, Construction, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type LatestNews = {
  slug: string
  title: string
  published_at: string
}

function NewsTicker({ news }: { news: LatestNews }) {
  const publishedDate = new Date(news.published_at)
  const daysSince =
    (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
  const isNew = daysSince <= 7

  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-full bg-white/70 border border-border/40 hover:bg-white hover:border-border/70 transition-all min-w-0 max-w-full"
    >
      {isNew && (
        <span
          className="shrink-0 inline-flex items-center px-2 py-0.5 text-[10px] font-heading font-extrabold text-white rounded-full animate-pulse-soft"
          style={{
            background:
              'linear-gradient(90deg, #E05555, #F7BD36, #78BF5A, #6EB1E0)',
          }}
        >
          NEW
        </span>
      )}
      <span
        className="shrink-0 text-xs font-heading font-bold"
        style={{ color: '#0A4585' }}
      >
        お知らせ
      </span>
      <span className="truncate text-sm font-body text-foreground/80 group-hover:text-foreground">
        {news.title}
      </span>
      <ArrowRight className="shrink-0 h-3.5 w-3.5 text-muted-foreground group-hover:text-apple-blue group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

type SubItem = {
  name: string
  href: string
  comingSoon?: boolean
}

type NavGroup = {
  label: string
  items: SubItem[]
}

type NavLink = {
  label: string
  href: string
}

type NavEntry = NavGroup | NavLink

function isNavLink(entry: NavEntry): entry is NavLink {
  return 'href' in entry
}

const navEntries: NavEntry[] = [
  {
    label: 'ムトス市民活動ひろば',
    items: [
      { name: 'ムトス市民活動ひろばとは', href: '/about-hiroba' },
      { name: '相談窓口', href: '/coming-soon', comingSoon: true },
    ],
  },
  {
    label: '市民活動団体紹介',
    items: [
      { name: '活動団体紹介', href: '/activities' },
      { name: '活動レポート', href: '/interviews' },
    ],
  },
  {
    label: 'ムトス飯田事業',
    items: [
      { name: 'ムトス飯田助成事業', href: '/mutos-grants' },
      { name: 'ムトス飯田賞', href: '/mutos-award' },
      { name: 'ムトス飯田学習交流会/各種講座', href: '/mutos-exchange' },
    ],
  },
  {
    label: 'ムトス飯田以外の助成金・講座情報',
    items: [
      { name: '他団体主催の助成金事業', href: '/other-grants' },
      { name: '他団体主催の講座情報', href: '/other-courses' },
    ],
  },
  /* 一般社団法人ムトス飯田市民ファンド - サブメニュー配置先が決まったら復活
  {
    label: '一般社団法人ムトス飯田市民ファンド',
    href: '/coming-soon',
  },
  */
  {
    label: 'ムトス飯田事業のあらまし',
    items: [
      { name: '「ムトス」とは', href: '/about-mutos' },
      { name: 'ムトス飯田推進委員会/コーディネート専門委員', href: '/mutos-committee' },
      { name: 'ムトス飯田の歩み', href: '/mutos-history' },
      { name: 'ムトス飯田ロゴマークについて', href: '/mutos-logo' },
    ],
  },
]

function MenuToggleButton({
  open,
  onClick,
}: {
  open: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={open}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none"
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="font-heading font-bold text-sm tracking-wide" style={{ color: '#0A4585' }}>
        {open ? '閉じる' : 'メニュー'}
      </span>
      {!open && (
        <span aria-hidden className="absolute -top-1 -right-1 flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E05555' }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F7BD36' }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#78BF5A' }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#6EB1E0' }} />
        </span>
      )}
    </motion.button>
  )
}

function DesktopDropdown({
  group,
  onNavigate,
}: {
  group: NavGroup
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  const isGroupActive = group.items.some((item) => pathname === item.href)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-full text-sm font-heading font-medium transition-all duration-200 cursor-default select-none',
          isGroupActive
            ? 'bg-primary/10 text-apple-red'
            : 'text-foreground/80 hover:bg-muted/50'
        )}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {group.label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-1 min-w-[260px] backdrop-blur-lg rounded-xl shadow-xl border border-border/40 p-2 z-50"
            style={{ background: 'linear-gradient(135deg, rgba(224,85,85,0.12), rgba(247,189,54,0.10), rgba(120,191,90,0.10), rgba(110,177,224,0.12)), rgba(255,255,255,0.92)' }}
          >
            {group.items.map((item, index) => {
              const isActive = pathname === item.href && !item.comingSoon
              const hexColors = ['#E05555', '#F7BD36', '#78BF5A', '#6EB1E0']
              const barHex = hexColors[index % 4]
              return (
                <Link
                  key={item.name}
                  href={item.comingSoon ? '/coming-soon' : item.href}
                  onClick={() => {
                    setOpen(false)
                    onNavigate()
                  }}
                  className={cn(
                    'group/item flex items-center gap-2 pl-1 pr-3 py-2.5 rounded-lg text-sm font-heading font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-apple-red'
                      : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground',
                    item.comingSoon && 'opacity-60'
                  )}
                >
                  <span
                    className="w-[3px] self-stretch rounded-full transition-all duration-200 opacity-0 group-hover/item:opacity-100"
                    style={{
                      backgroundColor: barHex,
                      ...(isActive ? { opacity: 1 } : {}),
                    }}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.comingSoon && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      <Construction className="h-2.5 w-2.5" />
                      準備中
                    </span>
                  )}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileAccordion({
  group,
  onNavigate,
  index,
}: {
  group: NavGroup
  onNavigate: () => void
  index: number
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const hexColors = ['#E05555', '#F7BD36', '#78BF5A', '#6EB1E0']
  const groupColor = hexColors[index % 4]

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-heading font-medium text-foreground/80 hover:bg-muted transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span
            className="w-1 h-5 rounded-full transition-all duration-300"
            style={{ backgroundColor: groupColor, opacity: open ? 1 : 0.6 }}
          />
          {group.label}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-5 pb-2 space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href && !item.comingSoon
                return (
                  <Link
                    key={item.name}
                    href={item.comingSoon ? '/coming-soon' : item.href}
                    onClick={onNavigate}
                    className={cn(
                      'group/item flex items-center gap-2 pl-2 pr-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-apple-red'
                        : 'text-foreground/70 hover:text-apple-red hover:bg-muted',
                      item.comingSoon && 'opacity-60'
                    )}
                  >
                    <span
                      className="w-[3px] self-stretch rounded-full transition-all duration-200 opacity-0 group-hover/item:opacity-100"
                      style={{
                        backgroundColor: groupColor,
                        ...(isActive ? { opacity: 1 } : {}),
                      }}
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.comingSoon && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                        <Construction className="h-2.5 w-2.5" />
                        準備中
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Header({ latestNews }: { latestNews?: LatestNews | null }) {
  const [navOpen, setNavOpen] = useState(false)
  // ティッカーの DOM 投入は「メニューが完全に閉じ終わってから」にすることで
  // エグジット中のメニューと同画面に居る時間をなくす
  const [showTicker, setShowTicker] = useState(true)
  const closeNav = useCallback(() => setNavOpen(false), [])

  useEffect(() => {
    if (navOpen) {
      setShowTicker(false)
      return
    }
    const timer = setTimeout(() => setShowTicker(true), 900)
    return () => clearTimeout(timer)
  }, [navOpen])

  useEffect(() => {
    if (!navOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [navOpen, closeNav])

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 gradient-border-bottom">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* ロゴ */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/logo.png"
                alt="ロゴ"
                width={256}
                height={264}
                className="h-14 w-auto"
                priority
              />
              <div className="hidden sm:block">
                <Image
                  src="/images/logo-text.png"
                  alt="ムトス飯田"
                  width={600}
                  height={113}
                  className="h-6 w-auto -mt-1"
                  priority
                />
              </div>
            </Link>
          </motion.div>

          {/* 中央：お知らせティッカー（閉じている時かつ md+ で表示） */}
          <div className="hidden md:flex flex-1 justify-center min-w-0">
            {!navOpen && showTicker && latestNews && (
              <div
                key="news-ticker"
                className="min-w-0 max-w-[520px] w-full animate-in fade-in slide-in-from-top-1 duration-300"
              >
                <NewsTicker news={latestNews} />
              </div>
            )}
          </div>

          {/* 右側：xl+ 開いている時は水平メニュー、それ以外はトグルボタン */}
          <div className="flex items-center shrink-0">
            {/* xl+: 水平メニュー（右から順にスライドイン） */}
            <AnimatePresence mode="wait">
              {navOpen && (
                <motion.div
                  key="horizontal-nav"
                  className="hidden xl:flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  {navEntries.map((entry, idx) => {
                    // 右端（配列末尾）が最初に出るよう、逆順でディレイ
                    const reverseIdx = navEntries.length - 1 - idx
                    return (
                      <motion.div
                        key={entry.label}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: reverseIdx * 0.16,
                            type: 'spring',
                            stiffness: 160,
                            damping: 24,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          x: 80,
                          transition: {
                            delay: idx * 0.1,
                            duration: 0.35,
                            ease: 'easeIn',
                          },
                        }}
                      >
                        {isNavLink(entry) ? (
                          <Link
                            href={entry.href}
                            onClick={closeNav}
                            className="px-3 py-2 rounded-full text-sm font-heading font-medium text-foreground/80 hover:bg-muted/50 transition-all duration-200 whitespace-nowrap"
                          >
                            {entry.label}
                          </Link>
                        ) : (
                          <DesktopDropdown group={entry} onNavigate={closeNav} />
                        )}
                      </motion.div>
                    )
                  })}

                  {/* 閉じる × ボタン */}
                  <motion.button
                    onClick={closeNav}
                    aria-label="メニューを閉じる"
                    className="ml-2 p-2 rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      transition: {
                        delay: 0,
                        type: 'spring',
                        stiffness: 200,
                        damping: 22,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      transition: {
                        delay: navEntries.length * 0.1,
                        duration: 0.25,
                      },
                    }}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* トグルボタン: <xl は常に表示、xl+ は閉じている時のみ表示 */}
            <div className={navOpen ? 'xl:hidden' : ''}>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <MenuToggleButton
                  open={navOpen}
                  onClick={() => setNavOpen(!navOpen)}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* <xl: ヘッダー下にアコーディオン展開 */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="xl:hidden absolute left-0 right-0 top-full border-t border-border/40 backdrop-blur-lg shadow-lg"
            style={{
              background:
                'linear-gradient(135deg, rgba(224,85,85,0.10), rgba(247,189,54,0.08), rgba(120,191,90,0.08), rgba(110,177,224,0.10)), rgba(255,255,255,0.92)',
            }}
          >
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {navEntries.map((entry, idx) =>
                  isNavLink(entry) ? (
                    <Link
                      key={entry.label}
                      href={entry.href}
                      onClick={closeNav}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-heading font-medium text-foreground/80 hover:bg-muted transition-colors"
                    >
                      <span
                        className="w-1 h-5 rounded-full"
                        style={{
                          backgroundColor:
                            ['#E05555', '#F7BD36', '#78BF5A', '#6EB1E0'][idx % 4],
                          opacity: 0.6,
                        }}
                      />
                      {entry.label}
                    </Link>
                  ) : (
                    <MobileAccordion
                      key={entry.label}
                      group={entry}
                      index={idx}
                      onNavigate={closeNav}
                    />
                  )
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
