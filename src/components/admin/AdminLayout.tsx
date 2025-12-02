'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* モバイルサイドバーオーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* サイドバー */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <AdminSidebar />
        {/* モバイル閉じるボタン */}
        <button
          className="absolute top-4 right-4 lg:hidden text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
