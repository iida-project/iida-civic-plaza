'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  MessageSquare,
  Coins,
  Newspaper,
  HelpCircle,
  Settings,
  ImageIcon,
} from 'lucide-react'

const navItems = [
  { label: 'ダッシュボード', href: '/admin', icon: Home },
  { label: '団体管理', href: '/admin/organizations', icon: Users },
  { label: 'インタビュー', href: '/admin/interviews', icon: MessageSquare },
  { label: '助成金', href: '/admin/grants', icon: Coins },
  { label: 'お知らせ', href: '/admin/news', icon: Newspaper },
  { label: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
  { label: 'メディア', href: '/admin/media', icon: ImageIcon },
  { label: 'マスター管理', href: '/admin/master', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      {/* ロゴ */}
      <div className="p-4 border-b border-gray-700">
        <Link href="/admin" className="text-lg font-bold">
          飯田の市民活動ひろば
        </Link>
        <p className="text-xs text-gray-400 mt-1">管理画面</p>
      </div>

      {/* ナビゲーション */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
