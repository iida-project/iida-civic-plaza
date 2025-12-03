'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-primary">飯田</span>の
            <br className="sm:hidden" />
            市民活動ひろば
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            飯田市内のNPO・市民活動を可視化し、
            <br className="hidden sm:block" />
            市民の皆さんと活動団体をつなぐプラットフォームです。
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl group"
            >
              <Search className="h-5 w-5" />
              活動団体を探す
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-8 py-4 bg-card text-foreground rounded-full text-lg font-medium hover:bg-muted transition-all shadow-md hover:shadow-lg border border-border"
            >
              インタビューを読む
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
