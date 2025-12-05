import { ReactNode } from 'react'
import { Folder, MapPin, Tag, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type BadgeSize = 'sm' | 'md' | 'lg'

type BaseBadgeProps = {
  children: ReactNode
  className?: string
  size?: BadgeSize
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

/**
 * カテゴリ（活動分野）バッジ
 */
type CategoryBadgeProps = BaseBadgeProps & {
  icon?: boolean
}

export function CategoryBadge({
  children,
  className,
  size = 'md',
  icon = false,
}: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        'bg-primary/10 text-primary',
        sizeClasses[size],
        className
      )}
    >
      {icon && <Folder className="h-3 w-3" />}
      {children}
    </span>
  )
}

/**
 * エリア（活動エリア）バッジ
 */
type AreaBadgeProps = BaseBadgeProps & {
  icon?: boolean
}

export function AreaBadge({
  children,
  className,
  size = 'md',
  icon = false,
}: AreaBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        'bg-apple-green/10 text-apple-green',
        sizeClasses[size],
        className
      )}
    >
      {icon && <MapPin className="h-3 w-3" />}
      {children}
    </span>
  )
}

/**
 * タグバッジ
 */
type TagBadgeProps = BaseBadgeProps & {
  icon?: boolean
}

export function TagBadge({
  children,
  className,
  size = 'md',
  icon = false,
}: TagBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        'bg-apple-blue/10 text-apple-blue',
        sizeClasses[size],
        className
      )}
    >
      {icon && <Tag className="h-3 w-3" />}
      {children}
    </span>
  )
}

/**
 * ステータスバッジ
 */
type StatusVariant = 'open' | 'closed' | 'soon' | 'urgent' | 'info'

type StatusBadgeProps = BaseBadgeProps & {
  variant: StatusVariant
  icon?: boolean
}

const statusConfig: Record<
  StatusVariant,
  { bg: string; text: string; Icon: typeof CheckCircle }
> = {
  open: {
    bg: 'bg-apple-green/10',
    text: 'text-apple-green',
    Icon: CheckCircle,
  },
  closed: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    Icon: XCircle,
  },
  soon: {
    bg: 'bg-apple-orange/10',
    text: 'text-apple-orange',
    Icon: Clock,
  },
  urgent: {
    bg: 'bg-apple-red/10',
    text: 'text-apple-red',
    Icon: AlertCircle,
  },
  info: {
    bg: 'bg-apple-blue/10',
    text: 'text-apple-blue',
    Icon: AlertCircle,
  },
}

export function StatusBadge({
  children,
  className,
  size = 'md',
  variant,
  icon = true,
}: StatusBadgeProps) {
  const config = statusConfig[variant]
  const { Icon } = config

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        config.bg,
        config.text,
        sizeClasses[size],
        className
      )}
    >
      {icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}

/**
 * 締切バッジ（日数表示付き）
 */
type DeadlineBadgeProps = {
  daysRemaining: number
  className?: string
  size?: BadgeSize
}

export function DeadlineBadge({
  daysRemaining,
  className,
  size = 'md',
}: DeadlineBadgeProps) {
  if (daysRemaining < 0) {
    return (
      <StatusBadge variant="closed" size={size} className={className}>
        募集終了
      </StatusBadge>
    )
  }

  if (daysRemaining <= 7) {
    return (
      <StatusBadge variant="urgent" size={size} className={className}>
        残り{daysRemaining}日
      </StatusBadge>
    )
  }

  if (daysRemaining <= 14) {
    return (
      <StatusBadge variant="soon" size={size} className={className}>
        残り{daysRemaining}日
      </StatusBadge>
    )
  }

  return (
    <StatusBadge variant="open" size={size} className={className}>
      受付中
    </StatusBadge>
  )
}

/**
 * バッジリスト（複数バッジを表示）
 */
type BadgeListProps = {
  children: ReactNode
  className?: string
  wrap?: boolean
}

export function BadgeList({ children, className, wrap = true }: BadgeListProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * 新着バッジ
 */
type NewBadgeProps = {
  className?: string
  size?: BadgeSize
}

export function NewBadge({ className, size = 'sm' }: NewBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold',
        'bg-apple-orange text-white',
        sizeClasses[size],
        className
      )}
    >
      NEW
    </span>
  )
}

/**
 * ピックアップバッジ
 */
type PickupBadgeProps = {
  className?: string
  size?: BadgeSize
}

export function PickupBadge({ className, size = 'sm' }: PickupBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold',
        'bg-apple-red text-white',
        sizeClasses[size],
        className
      )}
    >
      PICKUP
    </span>
  )
}
