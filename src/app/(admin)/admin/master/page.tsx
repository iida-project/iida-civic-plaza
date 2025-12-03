import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FolderTree, MapPin, Tag } from 'lucide-react'

export default function MasterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            管理画面へ
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-bold">マスター管理</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/master/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">活動分野</CardTitle>
              <FolderTree className="h-8 w-8 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                団体の活動分野を管理します
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/master/areas">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">活動エリア</CardTitle>
              <MapPin className="h-8 w-8 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                団体の活動エリアを管理します
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/master/tags">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">タグ</CardTitle>
              <Tag className="h-8 w-8 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                団体に付けるタグを管理します
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
