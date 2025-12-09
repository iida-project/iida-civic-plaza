'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock } from 'lucide-react'

type SummaryLevel = 'short' | 'medium' | 'long'

const levels: { key: SummaryLevel; label: string; readTime: string }[] = [
  { key: 'short', label: 'さくっと', readTime: '30秒' },
  { key: 'medium', label: 'ほどよく', readTime: '1分' },
  { key: 'long', label: 'じっくり', readTime: '3分' },
]

type Props = {
  summaryShort: string | null
  summaryMedium: string | null
  summaryLong: string | null
}

export function SummarySlider({ summaryShort, summaryMedium, summaryLong }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<SummaryLevel>('short')

  const summaries: Record<SummaryLevel, string | null> = {
    short: summaryShort,
    medium: summaryMedium,
    long: summaryLong,
  }

  const currentSummary = summaries[selectedLevel]
  const currentLevel = levels.find((l) => l.key === selectedLevel)

  // 利用可能なレベルのみ表示
  const availableLevels = levels.filter((level) => summaries[level.key])

  // 要約が1つもなければ非表示
  if (availableLevels.length === 0) {
    return null
  }

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        AI要約
      </h2>

      {/* レベル選択スライダー */}
      <div className="relative mb-4">
        <div className="flex rounded-full bg-muted p-1">
          {availableLevels.map((level) => (
            <button
              key={level.key}
              type="button"
              onClick={() => setSelectedLevel(level.key)}
              className={`relative flex-1 py-2 px-3 text-xs font-medium rounded-full transition-colors z-10 ${
                selectedLevel === level.key
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {selectedLevel === level.key && (
                <motion.div
                  layoutId="summary-slider-bg"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{level.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 読む時間 */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
        <Clock className="h-3 w-3" />
        <span>約{currentLevel?.readTime}で読める</span>
      </div>

      {/* 要約テキスト */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLevel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-foreground/80 leading-relaxed"
        >
          {currentSummary || '要約がありません'}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
