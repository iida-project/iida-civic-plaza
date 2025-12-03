'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Folder, MapPin, X } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
}

type Area = {
  id: string
  name: string
  slug: string
}

type Props = {
  categories: Category[]
  areas: Area[]
  selectedCategory?: string
  selectedArea?: string
}

export function FilterSection({
  categories,
  areas,
  selectedCategory,
  selectedArea,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleCategoryChange = (slug: string) => {
    const newValue = selectedCategory === slug ? '' : slug
    router.push(`/activities?${createQueryString('category', newValue)}`)
  }

  const handleAreaChange = (slug: string) => {
    const newValue = selectedArea === slug ? '' : slug
    router.push(`/activities?${createQueryString('area', newValue)}`)
  }

  const clearFilters = () => {
    router.push('/activities')
  }

  const hasFilters = selectedCategory || selectedArea

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl p-6 shadow-md border border-border mb-8"
    >
      {/* 活動分野 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">活動分野</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-primary/10 text-foreground'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 活動エリア */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-secondary" />
          <h3 className="font-semibold">活動エリア</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => handleAreaChange(area.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedArea === area.slug
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted hover:bg-secondary/10 text-foreground'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* フィルタクリア */}
      {hasFilters && (
        <div className="pt-4 border-t border-border">
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
            フィルタをクリア
          </button>
        </div>
      )}
    </motion.div>
  )
}
