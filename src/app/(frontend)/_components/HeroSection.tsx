'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      style={{
        background: 'linear-gradient(135deg, rgba(244,167,185,0.25) 0%, rgba(249,199,132,0.2) 25%, rgba(168,213,162,0.2) 60%, rgba(144,200,224,0.25) 100%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* キャッチコピー（小） */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 mb-4 font-heading font-bold text-base sm:text-lg"
          >
            <span style={{ color: '#0A4585' }}>してみる！</span>
            <span style={{ color: '#0A4585' }}>せむとす！</span>
            <span style={{ color: '#0A4585' }}>やってみよう！</span>
          </motion.div>

          {/* タイトル（大キャッチコピー） */}
          <h1 className="font-heading font-extrabold text-[32px] sm:text-[44px] lg:text-[52px] mb-6 leading-[1.3]">
            <span className="text-[0.7em]" style={{ color: '#0A4585' }}>あなたの</span>
            <span style={{ color: '#E05555', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(224,85,85,0.4)' }}>ム</span>
            <span style={{ color: '#6eb1e0', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(110,177,224,0.4)' }}>ト</span>
            <span style={{ color: '#f7bd36', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(247,189,54,0.4)' }}>ス</span>
            <span className="text-[0.7em]" style={{ color: '#78bf5a', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(120,191,90,0.4)' }}>を</span>
            <span style={{ color: '#E05555', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(224,85,85,0.4)' }}>応</span>
            <span style={{ color: '#78bf5a', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(120,191,90,0.4)' }}>援</span>
            <span style={{ color: '#6eb1e0', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(110,177,224,0.4)' }}>！</span>
          </h1>

          {/* サブタイトル */}
          <p className="font-body text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            つなげる、広がる、飯田市の市民活動
          </p>

          {/* ボタン */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* 活動をはじめるボタン - 必要になったら復活
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-9 py-3.5 bg-apple-red text-white rounded-full text-base font-heading font-bold hover:opacity-85 hover:-translate-y-0.5 transition-all shadow-md cursor-pointer"
            >
              活動をはじめる
              <ArrowRight className="h-4 w-4" />
            </Link>
            */}
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 px-9 py-3.5 bg-white text-apple-blue border-2 border-apple-blue rounded-full text-base font-heading font-bold hover:opacity-85 hover:-translate-y-0.5 transition-all shadow-md cursor-pointer"
            >
              <Search className="h-4 w-4" />
              団体を探す
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
