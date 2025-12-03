import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FaqForm } from '../_components'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: faq, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !faq) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/faqs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">FAQを編集</h1>
      </div>

      <FaqForm faq={faq} />
    </div>
  )
}
