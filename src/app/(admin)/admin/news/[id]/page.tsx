import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { NewsForm } from '../_components'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: news, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">お知らせを編集</h1>
      </div>

      <NewsForm news={news} />
    </div>
  )
}
