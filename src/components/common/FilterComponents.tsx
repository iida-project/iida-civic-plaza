'use client'

import { ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { X, LucideIcon } from 'lucide-react'

/**
 * フィルターコンテナ
 */
type FilterContainerProps = {
  children: ReactNode
  className?: string
}

export function FilterContainer({
  children,
  className = '',
}: FilterContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-card rounded-2xl p-4 sm:p-6 shadow-md border border-border ${className}`}
    >
      {children}
    </motion.div>
  )
}

/**
 * フィルターセクション（アイコン + タイトル + コンテンツ）
 */
type FilterSectionProps = {
  icon: LucideIcon
  title: string
  children: ReactNode
  iconColor?: string
  className?: string
}

export function FilterSection({
  icon: Icon,
  title,
  children,
  iconColor = 'text-primary',
  className = '',
}: FilterSectionProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  )
}

/**
 * チップ形式のフィルターボタン群
 */
type ChipFilterProps<T extends { id: string; name: string; slug: string }> = {
  items: T[]
  selectedValue?: string
  onSelect: (slug: string) => void
  activeColor?: 'primary' | 'secondary' | 'accent'
}

export function ChipFilter<T extends { id: string; name: string; slug: string }>({
  items,
  selectedValue,
  onSelect,
  activeColor = 'primary',
}: ChipFilterProps<T>) {
  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-apple-orange text-white',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.slug)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedValue === item.slug
              ? colorClasses[activeColor]
              : 'bg-muted hover:bg-primary/10 text-foreground'
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}

/**
 * ソートボタン群
 */
type SortOption = {
  value: string
  label: string
}

type SortButtonsProps = {
  options: SortOption[]
  currentSort: string
  onSort: (value: string) => void
}

export function SortButtons({ options, currentSort, onSort }: SortButtonsProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSort(option.value)}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            currentSort === option.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/**
 * フィルタークリアボタン
 */
type ClearFilterButtonProps = {
  onClick: () => void
  show: boolean
}

export function ClearFilterButton({ onClick, show }: ClearFilterButtonProps) {
  if (!show) return null

  return (
    <div className="pt-4 border-t border-border">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
        フィルタをクリア
      </button>
    </div>
  )
}

/**
 * 件数表示
 */
type ResultCountProps = {
  count: number
  label?: string
  className?: string
}

export function ResultCount({
  count,
  label = '件',
  className = '',
}: ResultCountProps) {
  return (
    <div
      className={`text-sm text-muted-foreground ${className}`}
    >
      {count}{label}
    </div>
  )
}

/**
 * URL SearchParams を操作するカスタムフック
 */
export function useFilterParams(basePath: string) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const queryString = params.toString()
    router.push(queryString ? `${basePath}?${queryString}` : basePath)
  }

  const toggleParam = (key: string, value: string) => {
    const currentValue = searchParams.get(key)
    updateParam(key, currentValue === value ? null : value)
  }

  const clearAll = () => {
    router.push(basePath)
  }

  const getParam = (key: string) => searchParams.get(key)

  return {
    updateParam,
    toggleParam,
    clearAll,
    getParam,
    searchParams,
  }
}
