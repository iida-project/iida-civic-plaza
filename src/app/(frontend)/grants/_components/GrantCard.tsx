'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, Calendar, Coins, Clock, AlertTriangle } from 'lucide-react'
import { format, differenceInDays, isBefore, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'

type Grant = {
  id: string
  slug: string
  title: string
  provider_name: string
  description: string | null
  application_start_date: string | null
  application_end_date: string
  subsidy_min_amount: number | null
  subsidy_max_amount: number | null
  target_organizations: string[] | null
}

type Props = {
  grant: Grant
}

function formatAmount(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toLocaleString()}万円`
  }
  return `${amount.toLocaleString()}円`
}

function getDeadlineStatus(endDate: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(endDate)
  deadline.setHours(0, 0, 0, 0)

  if (isBefore(deadline, today)) {
    return { status: 'closed', label: '募集終了', days: 0 }
  }

  const daysRemaining = differenceInDays(deadline, today)

  if (isToday(deadline)) {
    return { status: 'urgent', label: '本日締切', days: 0 }
  }

  if (daysRemaining <= 7) {
    return { status: 'urgent', label: `残り${daysRemaining}日`, days: daysRemaining }
  }

  if (daysRemaining <= 14) {
    return { status: 'soon', label: `残り${daysRemaining}日`, days: daysRemaining }
  }

  return { status: 'open', label: '受付中', days: daysRemaining }
}

export function GrantCard({ grant }: Props) {
  const deadlineInfo = getDeadlineStatus(grant.application_end_date)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link
        href={`/grants/${grant.slug}`}
        className={`block bg-card rounded-2xl overflow-hidden shadow-md border hover:shadow-lg transition-shadow ${
          deadlineInfo.status === 'closed'
            ? 'border-border opacity-60'
            : 'border-border'
        }`}
      >
        <div className="p-5">
          {/* ステータスバッジ */}
          <div className="flex items-center gap-2 mb-3">
            {deadlineInfo.status === 'closed' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                募集終了
              </span>
            ) : deadlineInfo.status === 'urgent' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-apple-red text-white text-xs font-medium rounded-full">
                <AlertTriangle className="h-3 w-3" />
                {deadlineInfo.label}
              </span>
            ) : deadlineInfo.status === 'soon' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-apple-orange text-white text-xs font-medium rounded-full">
                <Clock className="h-3 w-3" />
                {deadlineInfo.label}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-apple-green text-white text-xs font-medium rounded-full">
                {deadlineInfo.label}
              </span>
            )}
          </div>

          {/* 助成金名 */}
          <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {grant.title}
          </h2>

          {/* 実施主体 */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <Building2 className="h-4 w-4" />
            {grant.provider_name}
          </div>

          {/* 概要 */}
          {grant.description && (
            <p className="text-sm text-foreground/70 line-clamp-2 mb-4">
              {grant.description}
            </p>
          )}

          {/* 募集期間・金額 */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                〜{format(new Date(grant.application_end_date), 'M月d日', { locale: ja })}
              </span>
            </div>

            {(grant.subsidy_min_amount || grant.subsidy_max_amount) && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span>
                  {grant.subsidy_min_amount && grant.subsidy_max_amount ? (
                    `${formatAmount(grant.subsidy_min_amount)}〜${formatAmount(grant.subsidy_max_amount)}`
                  ) : grant.subsidy_max_amount ? (
                    `最大${formatAmount(grant.subsidy_max_amount)}`
                  ) : grant.subsidy_min_amount ? (
                    `${formatAmount(grant.subsidy_min_amount)}〜`
                  ) : null}
                </span>
              </div>
            )}
          </div>

          {/* 対象団体 */}
          {grant.target_organizations && grant.target_organizations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {grant.target_organizations.slice(0, 3).map((org, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {org}
                </span>
              ))}
              {grant.target_organizations.length > 3 && (
                <span className="px-2 py-0.5 text-muted-foreground text-xs">
                  +{grant.target_organizations.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}
