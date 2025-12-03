import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { FaqList } from './_components'

export const dynamic = 'force-dynamic'

export default async function FaqsPage() {
  const supabase = createAdminClient()

  const { data: faqs, error } = await supabase
    .from('faqs')
    .select(
      `
      id,
      question,
      answer,
      sort_order,
      is_published
    `
    )
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch FAQs:', error)
  }

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

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">FAQ管理</h1>
        <Button asChild>
          <Link href="/admin/faqs/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <FaqList faqs={faqs || []} />
    </div>
  )
}
