'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Eye, EyeOff, AlertTriangle, Clock } from 'lucide-react'
import { deleteGrant, togglePublish } from '../actions'

type Grant = {
  id: string
  title: string
  slug: string
  provider_name: string
  application_end_date: string
  is_published: boolean
  updated_at: string
}

interface GrantListProps {
  grants: Grant[]
}

export function GrantList({ grants }: GrantListProps) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteGrant(id)
      if (!result.success) {
        alert(result.error)
      }
      setDeletingId(null)
    })
  }

  const handleTogglePublish = (id: string) => {
    setTogglingId(id)
    startTransition(async () => {
      const result = await togglePublish(id)
      if (!result.success) {
        alert(result.error)
      }
      setTogglingId(null)
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  // 締切までの日数を計算
  const getDaysUntilDeadline = (endDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadline = new Date(endDate)
    deadline.setHours(0, 0, 0, 0)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // 締切状態のバッジを返す
  const getDeadlineBadge = (endDate: string) => {
    const days = getDaysUntilDeadline(endDate)

    if (days < 0) {
      return (
        <Badge variant="secondary" className="bg-gray-200 text-gray-600">
          締切済み
        </Badge>
      )
    } else if (days === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          本日締切
        </Badge>
      )
    } else if (days <= 7) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          あと{days}日
        </Badge>
      )
    } else if (days <= 14) {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          あと{days}日
        </Badge>
      )
    }
    return null
  }

  if (grants.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        助成金情報がありません
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">助成金名</TableHead>
            <TableHead>提供元</TableHead>
            <TableHead>締切日</TableHead>
            <TableHead className="text-center">状態</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grants.map((grant) => {
            const days = getDaysUntilDeadline(grant.application_end_date)
            const isExpired = days < 0

            return (
              <TableRow
                key={grant.id}
                className={isExpired ? 'opacity-50 bg-gray-50' : ''}
              >
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/grants/${grant.id}`}
                    className="hover:text-orange-600"
                  >
                    {grant.title}
                  </Link>
                </TableCell>
                <TableCell>{grant.provider_name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{formatDate(grant.application_end_date)}</span>
                    {getDeadlineBadge(grant.application_end_date)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={grant.is_published ? 'default' : 'secondary'}>
                    {grant.is_published ? '公開' : '下書き'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublish(grant.id)}
                      disabled={isPending && togglingId === grant.id}
                      title={grant.is_published ? '非公開にする' : '公開する'}
                    >
                      {grant.is_published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/grants/${grant.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={isPending && deletingId === grant.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>助成金情報を削除</AlertDialogTitle>
                          <AlertDialogDescription>
                            「{grant.title}」を削除しますか？
                            この操作は取り消せません。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(grant.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            削除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
