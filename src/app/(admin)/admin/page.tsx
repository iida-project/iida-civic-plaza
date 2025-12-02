import Link from 'next/link'
import { AdminLayout } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageSquare, Coins, Newspaper, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'ダッシュボード',
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>

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

        {/* お知らせ */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">
            管理画面は現在構築中です。各機能は順次追加されます。
          </p>
        </div>
      </div>
    </AdminLayout>
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
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
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
