'use client'

import { useId } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useCloudVisibility } from './CloudVisibilityProvider'

// ヒーロー左右に浮かぶ雲メニュー - リンク先は役所合意後に差し替え予定
const CLOUD_MENUS = [
  { lines: ['活動、', 'のぞいてみる？'], color: '#E05555', rotate: -4, floatDelay: 0 },
  { lines: ['仲間を、', 'さがそ！'],      color: '#F7BD36', rotate:  5, floatDelay: 0.4 },
  { lines: ['団体、', 'はじめたい！'],    color: '#78BF5A', rotate:  3, floatDelay: 0.8 },
  { lines: ['助成金、', 'ゲット！'],      color: '#6EB1E0', rotate: -5, floatDelay: 1.2 },
] as const

function CloudButton({
  cloud,
  index,
  baseDelay,
}: {
  cloud: (typeof CLOUD_MENUS)[number]
  index: number
  baseDelay: number
}) {
  const label = cloud.lines.join('')
  const rawId = useId()
  const gradId = `cloud-grad-${rawId.replace(/:/g, '')}`
  const highlightId = `cloud-hl-${rawId.replace(/:/g, '')}`
  return (
    <motion.a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-label={`${label}（リンク準備中）`}
      title="準備中です"
      className="relative inline-block cursor-pointer select-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-2"
      initial={{ opacity: 0, scale: 0, rotate: cloud.rotate - 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: cloud.rotate,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.4, delay: baseDelay + index * 0.12 },
        scale: { type: 'spring', stiffness: 240, damping: 16, delay: baseDelay + index * 0.12 },
        rotate: { type: 'spring', stiffness: 240, damping: 16, delay: baseDelay + index * 0.12 },
        y: {
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: cloud.floatDelay + baseDelay + 0.8,
        },
      }}
      whileHover={{
        scale: 1.22,
        rotate: 0,
        y: -4,
        transition: { type: 'spring', stiffness: 260, damping: 14 },
      }}
      whileTap={{ scale: 0.94 }}
    >
      <svg
        viewBox="0 0 240 170"
        className="w-[190px] sm:w-[220px] xl:w-[250px] h-auto"
        style={{
          filter:
            'drop-shadow(0 3px 6px rgba(80,100,140,0.18)) drop-shadow(0 14px 26px rgba(80,100,140,0.14))',
        }}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.55" stopColor="#FCFDFF" />
            <stop offset="1" stopColor="#E3EBF6" />
          </linearGradient>
          <radialGradient id={highlightId} cx="0.32" cy="0.28" r="0.45">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M 45,55
             C 45,22 85,20 100,45
             C 108,18 145,18 160,45
             C 180,30 215,42 208,68
             C 232,72 232,102 208,108
             C 218,138 175,145 160,122
             C 150,148 100,150 95,120
             C 82,145 42,140 48,112
             C 18,112 15,80 42,72
             C 22,60 25,48 45,55
             Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M 45,55
             C 45,22 85,20 100,45
             C 108,18 145,18 160,45
             C 180,30 215,42 208,68
             C 232,72 232,102 208,108
             C 218,138 175,145 160,122
             C 150,148 100,150 95,120
             C 82,145 42,140 48,112
             C 18,112 15,80 42,72
             C 22,60 25,48 45,55
             Z"
          fill={`url(#${highlightId})`}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <span
          className="font-heading font-bold text-[14px] sm:text-[15px] xl:text-[17px] leading-tight"
          style={{ color: '#0A4585' }}
        >
          {cloud.lines[0]}
        </span>
        <span
          className="font-heading font-bold text-[15px] sm:text-[16px] xl:text-[18px] leading-tight"
          style={{ color: '#0A4585' }}
        >
          {cloud.lines[1]}
        </span>
      </div>
    </motion.a>
  )
}

export function HeroSection() {
  const { cloudsVisible } = useCloudVisibility()

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      style={{
        background: 'linear-gradient(135deg, rgba(224,85,85,0.25) 0%, rgba(247,189,54,0.2) 25%, rgba(120,191,90,0.2) 60%, rgba(110,177,224,0.25) 100%)',
      }}
    >
      {/* XL+: ヒーロー左右に絶対配置の雲メニュー */}
      {cloudsVisible && (
        <div className="pointer-events-none absolute inset-0 hidden xl:block">
          <div className="pointer-events-auto absolute left-20 top-[18%]">
            <CloudButton cloud={CLOUD_MENUS[0]} index={0} baseDelay={0.5} />
          </div>
          <div className="pointer-events-auto absolute right-20 top-[18%]">
            <CloudButton cloud={CLOUD_MENUS[1]} index={1} baseDelay={0.5} />
          </div>
          <div className="pointer-events-auto absolute left-20 bottom-[18%]">
            <CloudButton cloud={CLOUD_MENUS[2]} index={2} baseDelay={0.5} />
          </div>
          <div className="pointer-events-auto absolute right-20 bottom-[18%]">
            <CloudButton cloud={CLOUD_MENUS[3]} index={3} baseDelay={0.5} />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* キャッチコピー（小）- ポップな吹き出し風、フワフワ漂う */}
          <div className="flex flex-wrap justify-center items-end gap-4 sm:gap-8 mb-10">
            {[
              { text: 'してみる！', color: '#E05555', rotate: -5, translateY: 0, floatDelay: 0, tail: 'left' },
              { text: 'せむとす！', color: '#F7BD36', rotate: 4, translateY: -6, floatDelay: 0.6, tail: 'center' },
              { text: 'やってみよう！', color: '#78BF5A', rotate: -3, translateY: 2, floatDelay: 1.2, tail: 'right' },
            ].map((chip, i) => {
              const tailLeft = chip.tail === 'left' ? '28%' : chip.tail === 'right' ? '72%' : '50%'
              return (
                <motion.span
                  key={chip.text}
                  initial={{ opacity: 0, scale: 0, rotate: chip.rotate - 25 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: chip.rotate,
                    y: [chip.translateY, chip.translateY - 6, chip.translateY],
                  }}
                  transition={{
                    opacity: { duration: 0.35, delay: 0.1 + i * 0.12 },
                    scale: { type: 'spring', stiffness: 280, damping: 14, delay: 0.1 + i * 0.12 },
                    rotate: { type: 'spring', stiffness: 280, damping: 14, delay: 0.1 + i * 0.12 },
                    y: {
                      duration: 2.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: chip.floatDelay + 1,
                    },
                  }}
                  whileHover={{ scale: 1.12, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                  className="relative inline-block px-5 py-2 sm:px-6 sm:py-2.5 rounded-[28px] font-heading font-bold text-sm sm:text-base select-none cursor-default whitespace-nowrap"
                  style={{
                    color: chip.color,
                    backgroundColor: '#ffffff',
                    border: `2.5px solid ${chip.color}`,
                    boxShadow: `3px 3px 0 ${chip.color}, 0 6px 18px rgba(0,0,0,0.06)`,
                  }}
                >
                  {chip.text}
                  {/* 吹き出しの尻尾（外側：枠線色） */}
                  <span
                    aria-hidden
                    className="absolute -translate-x-1/2"
                    style={{
                      left: tailLeft,
                      bottom: '-11px',
                      width: 0,
                      height: 0,
                      borderLeft: '9px solid transparent',
                      borderRight: '9px solid transparent',
                      borderTop: `11px solid ${chip.color}`,
                    }}
                  />
                  {/* 吹き出しの尻尾（内側：白で枠を打ち消し） */}
                  <span
                    aria-hidden
                    className="absolute -translate-x-1/2"
                    style={{
                      left: tailLeft,
                      bottom: '-6px',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '8px solid #ffffff',
                    }}
                  />
                </motion.span>
              )
            })}
          </div>

          {/* タイトル（大キャッチコピー） */}
          <h1 className="font-heading font-extrabold text-[32px] sm:text-[44px] lg:text-[52px] mb-6 leading-[1.3]">
            <span className="text-[0.7em]" style={{ color: '#0A4585' }}>あなたの</span>
            <span style={{ color: '#E05555', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(224,85,85,0.4)' }}>ム</span>
            <span style={{ color: '#6EB1E0', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(110,177,224,0.4)' }}>ト</span>
            <span style={{ color: '#F7BD36', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(247,189,54,0.4)' }}>ス</span>
            <span className="text-[0.7em]" style={{ color: '#78BF5A', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(120,191,90,0.4)' }}>を</span>
            <span style={{ color: '#E05555', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(224,85,85,0.4)' }}>応</span>
            <span style={{ color: '#78BF5A', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(120,191,90,0.4)' }}>援</span>
            <span style={{ color: '#6EB1E0', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(110,177,224,0.4)' }}>！</span>
          </h1>

          {/* サブタイトル */}
          <p className="font-heading font-bold text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto" style={{ color: '#0A4585' }}>
            ムトス飯田の市民活動ひろば
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

        {/* XL未満: ヒーロー下に2×2グリッドで雲メニュー */}
        {cloudsVisible && (
          <div className="xl:hidden mt-12 grid grid-cols-2 gap-x-2 gap-y-4 max-w-md mx-auto justify-items-center">
            {CLOUD_MENUS.map((cloud, idx) => (
              <CloudButton
                key={cloud.lines.join('')}
                cloud={cloud}
                index={idx}
                baseDelay={0.5}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
