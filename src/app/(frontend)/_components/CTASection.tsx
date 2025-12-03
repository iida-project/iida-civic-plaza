'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, HelpCircle } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
        >
          {/* 背景装飾 */}
          <div className="absolute inset-0 -z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              市民活動に参加してみませんか？
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              地域のさまざまな活動に参加して、新しい出会いや経験を見つけましょう。
              <br className="hidden sm:block" />
              あなたの「やってみたい」が、まちを元気にします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/activities"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary rounded-full font-medium hover:bg-white/90 transition-colors shadow-lg"
              >
                団体を探す
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <HelpCircle className="h-4 w-4" />
                よくある質問
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
