import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { InterviewForm } from '../_components'

export default async function NewInterviewPage() {
  const supabase = createAdminClient()

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
        <h1 className="text-2xl font-bold">インタビューを新規作成</h1>
      </div>

      <InterviewForm organizations={organizations || []} />
    </div>
  )
}
