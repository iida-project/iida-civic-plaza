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
    <section
      className="py-16 sm:py-24"
      style={{
        background: 'linear-gradient(135deg, rgba(224,85,85,0.08) 0%, rgba(247,189,54,0.08) 33%, rgba(120,191,90,0.08) 66%, rgba(110,177,224,0.08) 100%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-1.5 h-[1.2em] bg-apple-orange rounded-sm flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">市民活動を探す</h2>
          </div>
          <p className="font-body text-muted-foreground">
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
            className="bg-card rounded-xl p-6 sm:p-8 shadow-[var(--shadow-card)] border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg border-b-[3px] border-apple-green pb-1">
                活動分野から探す
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/activities?category=${category.slug}`}
                  className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-heading font-medium transition-colors cursor-pointer"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 text-apple-blue font-heading font-bold border-b border-apple-blue hover:opacity-70 transition-opacity"
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
            className="bg-card rounded-xl p-6 sm:p-8 shadow-[var(--shadow-card)] border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-lg border-b-[3px] border-apple-green pb-1">
                活動エリアから探す
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {areas.slice(0, 12).map((area) => (
                <Link
                  key={area.id}
                  href={`/activities?area=${area.slug}`}
                  className="px-4 py-2 bg-muted hover:bg-secondary hover:text-secondary-foreground rounded-full text-sm font-heading font-medium transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-2 text-apple-blue font-heading font-bold border-b border-apple-blue hover:opacity-70 transition-opacity"
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
