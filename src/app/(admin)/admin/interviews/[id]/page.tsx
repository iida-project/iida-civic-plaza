import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { InterviewForm } from '../_components'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditInterviewPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  // インタビューデータと団体リストを並列で取得
  const [interviewResult, organizationsResult] = await Promise.all([
    supabase.from('interviews').select('*').eq('id', id).single(),
    supabase
      .from('organizations')
      .select('id, name')
      .eq('is_published', true)
      .order('name'),
  ])

  const { data: interview, error } = interviewResult
  const { data: organizations } = organizationsResult

  if (error || !interview) {
    notFound()
  }

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
        <Button variant="outline" size="sm" asChild>
          <a
            href={`/interviews/${encodeURIComponent(interview.slug)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            サイトで確認
          </a>
        </Button>
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
