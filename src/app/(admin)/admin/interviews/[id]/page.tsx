import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { InterviewForm } from '../_components'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditInterviewPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  // インタビューデータを取得
  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !interview) {
    notFound()
  }

  // 公開済みの団体を取得
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('is_published', true)
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/interviews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">インタビューを編集</h1>
      </div>

      <InterviewForm
        interview={{
          ...interview,
          gallery_images: interview.gallery_images as string[] | null,
        }}
        organizations={organizations || []}
      />
    </div>
  )
}
