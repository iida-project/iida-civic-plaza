import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FaqForm } from '../_components'

export default function NewFaqPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/faqs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">FAQを新規作成</h1>
      </div>

      <FaqForm />
    </div>
  )
}
