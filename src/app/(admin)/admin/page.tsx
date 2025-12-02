import Link from 'next/link'
import { LogoutButton } from './_components/LogoutButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageSquare, Coins, Newspaper, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'ダッシュボード',
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            飯田の市民活動ひろば - 管理画面
          </h1>
          <LogoutButton />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">ダッシュボード</h2>

        {/* クイックアクセスカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessCard
            title="団体管理"
            description="市民活動団体の追加・編集"
            icon={<Users className="h-8 w-8" />}
            href="/admin/organizations"
            count={0}
          />
          <QuickAccessCard
            title="インタビュー"
            description="インタビュー記事の管理"
            icon={<MessageSquare className="h-8 w-8" />}
            href="/admin/interviews"
            count={0}
          />
          <QuickAccessCard
            title="助成金情報"
            description="助成金・補助金の管理"
            icon={<Coins className="h-8 w-8" />}
            href="/admin/grants"
            count={0}
          />
          <QuickAccessCard
            title="お知らせ"
            description="お知らせの投稿・編集"
            icon={<Newspaper className="h-8 w-8" />}
            href="/admin/news"
            count={0}
          />
          <QuickAccessCard
            title="FAQ"
            description="よくある質問の管理"
            icon={<HelpCircle className="h-8 w-8" />}
            href="/admin/faqs"
            count={0}
          />
        </div>

        {/* 仮メッセージ */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">
            管理画面は現在構築中です。各機能は順次追加されます。
          </p>
        </div>
      </main>
    </div>
  )
}

function QuickAccessCard({
  title,
  description,
  icon,
  href,
  count,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  count: number
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="text-orange-500">{icon}</div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <p className="text-2xl font-bold">{count} 件</p>
        </CardContent>
      </Card>
    </Link>
  )
}
