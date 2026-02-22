import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { GrantForm } from '../_components'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditGrantPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()

  // 助成金データと活動分野を並列で取得
  const [grantResult, categoriesResult] = await Promise.all([
    supabase
      .from('grants')
      .select(
        `
        *,
        grant_categories (
          category_id
        )
      `
      )
      .eq('id', id)
      .single(),
    supabase
      .from('activity_categories')
      .select('id, name')
      .order('sort_order'),
  ])

  const { data: grant, error } = grantResult
  const { data: categories } = categoriesResult

  if (error || !grant) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/grants">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">助成金を編集</h1>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`/grants/${encodeURIComponent(grant.slug)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            サイトで確認
          </a>
        </Button>
      </div>

      <GrantForm
        grant={{
          ...grant,
          target_organizations: grant.target_organizations as string[] | null,
          grant_categories: grant.grant_categories as { category_id: string }[],
        }}
        categories={categories || []}
      />
    </div>
  )
}
