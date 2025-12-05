import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { HelpCircle } from 'lucide-react'
import { FAQAccordion } from './_components'

export const metadata: Metadata = {
  title: 'よくある質問 | 飯田の市民活動ひろば',
  description: '飯田の市民活動ひろばに関するよくある質問と回答をまとめました。',
}

export const revalidate = 60

async function getFAQs() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('faqs')
    .select('id, question, answer, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  return data || []
}

export default async function FAQPage() {
  const faqs = await getFAQs()

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">よくある質問</h1>
          <p className="text-muted-foreground">
            市民活動に関するよくあるご質問にお答えします
          </p>
        </div>

        {/* FAQ一覧 */}
        {faqs.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <HelpCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              よくある質問はまだありません
            </h2>
            <p className="text-muted-foreground">
              質問が追加されるまでお待ちください
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
