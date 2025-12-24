import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { InterviewList } from './_components'
import { ScrollToTop } from '@/components/admin/ScrollToTop'

export const dynamic = 'force-dynamic'

type InterviewWithOrganization = {
  id: string
  title: string
  slug: string
  is_published: boolean
  is_featured: boolean
  updated_at: string
  organization: { name: string } | null
}

export default async function InterviewsPage() {
  const supabase = createAdminClient()

  const { data: interviews, error } = await supabase
    .from('interviews')
    .select(
      `
      id,
      title,
      slug,
      is_published,
      is_featured,
      updated_at,
      organization:organizations (
        name
      )
    `
    )
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch interviews:', error)
  }

  // Transform data to match expected type
  const typedInterviews: InterviewWithOrganization[] = (interviews || []).map(
    (interview) => ({
      id: interview.id,
      title: interview.title,
      slug: interview.slug,
      is_published: interview.is_published ?? false,
      is_featured: interview.is_featured ?? false,
      updated_at: interview.updated_at,
      organization: interview.organization as unknown as { name: string } | null,
    })
  )

  return (
    <div className="space-y-6">
      <ScrollToTop />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            管理画面へ
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">インタビュー管理</h1>
        <Button asChild>
          <Link href="/admin/interviews/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <InterviewList interviews={typedInterviews} />
    </div>
  )
}
