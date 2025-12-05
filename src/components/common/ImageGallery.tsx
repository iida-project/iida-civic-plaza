'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Images, LucideIcon } from 'lucide-react'

type Props = {
  images: string[]
  alt: string
  title?: string
  titleIcon?: LucideIcon
  columns?: 2 | 3 | 4
}

/**
 * 画像ギャラリーコンポーネント
 * - サムネイルグリッド表示
 * - ライトボックス（モーダル拡大表示）
 * - キーボードナビゲーション（←→キー、Escキー）
 * - スワイプ対応（モバイル）
 */
export function ImageGallery({
  images,
  alt,
  title = '画像ギャラリー',
  titleIcon: TitleIcon = Images,
  columns = 4,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // スワイプの最小距離
  const minSwipeDistance = 50

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
    }
  }, [selectedIndex, images.length])

  const goToNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
    }
  }, [selectedIndex, images.length])

  // キーボードナビゲーション
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case 'Escape':
          closeLightbox()
          break
      }
    }

    // スクロールを無効化
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, goToPrevious, goToNext, closeLightbox])

  // タッチイベントハンドラー
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // グリッドのカラム数クラス
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  }[columns]

  if (images.length === 0) return null

  return (
    <div>
      {title && (
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <TitleIcon className="h-5 w-5 text-primary" />
          {title}
        </h2>
      )}

      {/* サムネイルグリッド */}
      <div className={`grid ${gridCols} gap-3`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`${alt} ${index + 1}を拡大表示`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          </button>
        ))}
      </div>

      {/* ライトボックス */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            role="dialog"
            aria-modal="true"
            aria-label="画像を拡大表示中"
          >
            {/* 閉じるボタン */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="閉じる"
            >
              <X className="h-8 w-8" />
            </button>

            {/* 前へボタン */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-2 sm:left-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="前の画像"
              >
                <ChevronLeft className="h-8 w-8 sm:h-10 sm:w-10" />
              </button>
            )}

            {/* 画像 */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`${alt} ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* 次へボタン */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-2 sm:right-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="次の画像"
              >
                <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10" />
              </button>
            )}

            {/* カウンター */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>
            )}

            {/* 操作ヒント */}
            <div className="absolute bottom-4 right-4 text-white/50 text-xs hidden sm:block">
              ←→ キーで移動 / Esc で閉じる
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
