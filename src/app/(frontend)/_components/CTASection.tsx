import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FadeInOnScroll } from '@/lib/animations'

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <div
            className="rounded-2xl p-8 sm:p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(224,85,85,0.25) 0%, rgba(247,189,54,0.2) 25%, rgba(120,191,90,0.2) 60%, rgba(110,177,224,0.25) 100%)',
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground mb-4">
              さあ、あなたも参加しませんか？
            </h2>
            <p className="text-base sm:text-lg font-body text-muted-foreground mb-10 max-w-2xl mx-auto">
              地域のさまざまな活動に参加して、新しい出会いや経験を見つけましょう。
              <br className="hidden sm:block" />
              あなたの「やってみたい」が、まちを元気にします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/activities"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-apple-red text-white rounded-full font-heading font-bold hover:opacity-85 hover:-translate-y-0.5 transition-all shadow-md cursor-pointer"
              >
                団体を探す
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  )
}
