'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { fadeInUp, staggerContainer } from './variants'

type MotionDivProps = {
  children: ReactNode
  className?: string
  delay?: number
}

// スクロールでフェードインするコンポーネント
export function FadeInOnScroll({ children, className, delay = 0 }: MotionDivProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 子要素を順番にアニメーションするコンテナ
export function StaggerContainer({ children, className }: MotionDivProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// スタガードアニメーション用のアイテム
export function StaggerItem({ children, className }: MotionDivProps) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}

// ホバーで浮き上がるカード
export function HoverCard({ children, className }: MotionDivProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ホバーでスケールするボタン
export function HoverScale({ children, className }: MotionDivProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
