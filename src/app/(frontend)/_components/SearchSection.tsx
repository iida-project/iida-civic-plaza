'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Folder, ArrowRight } from 'lucide-react'

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
}

export function SearchSection({ categories, areas }: Props) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">市民活動を探す</h2>
          <p className="text-foreground/70">
            活動分野やエリアから、興味のある団体を見つけましょう
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 活動分野 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-6 sm:p-8 shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">活動分野から探す</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/activities?category=${category.slug}`}
                  className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              すべての団体を見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* 活動エリア */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-6 sm:p-8 shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">活動エリアから探す</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {areas.slice(0, 12).map((area) => (
                <Link
                  key={area.id}
                  href={`/activities?area=${area.slug}`}
                  className="px-4 py-2 bg-muted hover:bg-secondary hover:text-secondary-foreground rounded-full text-sm font-medium transition-colors"
                >
                  {area.name}
                </Link>
              ))}
              {areas.length > 12 && (
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  他 {areas.length - 12} エリア
                </span>
              )}
            </div>
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 text-secondary font-medium hover:underline"
            >
              すべてのエリアを見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
