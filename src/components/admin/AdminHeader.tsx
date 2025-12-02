'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* モバイルメニューボタン */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* ログアウト */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {loading ? 'ログアウト中...' : 'ログアウト'}
        </Button>
      </div>
    </header>
  )
}
