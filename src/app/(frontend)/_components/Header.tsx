'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Construction } from 'lucide-react'
import { cn } from '@/lib/utils'

type SubItem = {
  name: string
  href: string
  comingSoon?: boolean
}

type NavGroup = {
  label: string
  items: SubItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'ムトス市民活動ひろば',
    items: [
      { name: 'ムトス市民活動ひろばとは', href: '/coming-soon', comingSoon: true },
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
      { name: 'ムトス飯田助成事業', href: '/coming-soon', comingSoon: true },
      { name: 'ムトス飯田賞', href: '/coming-soon', comingSoon: true },
      { name: 'ムトス飯田学習交流会／各種講座', href: '/coming-soon', comingSoon: true },
    ],
  },
  {
    label: 'ムトス飯田以外の助成金・講座情報',
    items: [
      { name: '他団体主催の助成金事業', href: '/coming-soon', comingSoon: true },
      { name: '他団体主催の講座情報', href: '/coming-soon', comingSoon: true },
    ],
  },
  {
    label: 'ムトス飯田事業のあらまし',
    items: [
      { name: '「ムトス」とは', href: '/coming-soon', comingSoon: true },
      { name: 'ムトス飯田推進委員会／コーディネート専門委員', href: '/coming-soon', comingSoon: true },
      { name: 'ムトス飯田の歩み', href: '/coming-soon', comingSoon: true },
      { name: 'ムトス飯田ロゴマークについて', href: '/coming-soon', comingSoon: true },
    ],
  },
]

function DesktopDropdown({ group }: { group: NavGroup }) {
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
            className="absolute top-full left-0 mt-1 min-w-[260px] bg-background/98 backdrop-blur-xl rounded-xl shadow-lg border border-border/60 p-2 z-50"
          >
            {group.items.map((item, index) => {
              const isActive = pathname === item.href && !item.comingSoon
              const hexColors = ['#F4A7B9', '#F9C784', '#A8D5A2', '#90C8E0']
              const barHex = hexColors[index % 4]
              return (
                <Link
                  key={item.name}
                  href={item.comingSoon ? '/coming-soon' : item.href}
                  onClick={() => setOpen(false)}
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
}: {
  group: NavGroup
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-heading font-medium text-foreground/80 hover:bg-muted transition-colors cursor-pointer"
      >
        {group.label}
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
            <div className="pl-4 pb-2 space-y-1">
              {group.items.map((item, index) => {
                const isActive = pathname === item.href && !item.comingSoon
                const hexColors = ['#F4A7B9', '#F9C784', '#A8D5A2', '#90C8E0']
                const barHex = hexColors[index % 4]
                return (
                  <Link
                    key={item.name}
                    href={item.comingSoon ? '/coming-soon' : item.href}
                    onClick={onNavigate}
                    className={cn(
                      'group/item flex items-center gap-2 pl-1 pr-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-apple-red'
                        : 'text-foreground/70 hover:text-apple-red hover:bg-muted',
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 gradient-border-bottom">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/logo.png"
                alt="ロゴ"
                width={40}
                height={40}
                className="h-10 w-10"
                priority
              />
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg text-foreground">
                  飯田の市民活動ひろば
                </span>
              </div>
            </Link>
          </motion.div>

          {/* デスクトップナビゲーション */}
          <motion.div
            className="hidden xl:flex items-center gap-0.5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navGroups.map((group) => (
              <DesktopDropdown key={group.label} group={group} />
            ))}
          </motion.div>

          {/* モバイルメニューボタン */}
          <motion.button
            className="xl:hidden p-2 rounded-full hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {navGroups.map((group) => (
                  <MobileAccordion
                    key={group.label}
                    group={group}
                    onNavigate={closeMobileMenu}
                  />
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
