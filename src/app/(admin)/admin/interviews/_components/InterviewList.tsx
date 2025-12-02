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
import { Pencil, Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react'
import { deleteInterview, togglePublish, toggleFeatured } from '../actions'

type Interview = {
  id: string
  title: string
  slug: string
  is_published: boolean
  is_featured: boolean
  updated_at: string
  organization?: { name: string } | null
}

interface InterviewListProps {
  interviews: Interview[]
}

export function InterviewList({ interviews }: InterviewListProps) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteInterview(id)
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

  const handleToggleFeatured = (id: string) => {
    startTransition(async () => {
      const result = await toggleFeatured(id)
      if (!result.success) {
        alert(result.error)
      }
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (interviews.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        インタビューがありません
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">タイトル</TableHead>
            <TableHead>関連団体</TableHead>
            <TableHead className="text-center">ピックアップ</TableHead>
            <TableHead className="text-center">状態</TableHead>
            <TableHead>更新日</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/interviews/${interview.id}`}
                  className="hover:text-orange-600"
                >
                  {interview.title}
                </Link>
              </TableCell>
              <TableCell>
                {interview.organization?.name || (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFeatured(interview.id)}
                  disabled={isPending}
                  className={interview.is_featured ? 'text-amber-500' : 'text-gray-400'}
                >
                  {interview.is_featured ? (
                    <Star className="h-4 w-4 fill-current" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={interview.is_published ? 'default' : 'secondary'}>
                  {interview.is_published ? '公開' : '下書き'}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(interview.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(interview.id)}
                    disabled={isPending && togglingId === interview.id}
                    title={interview.is_published ? '非公開にする' : '公開する'}
                  >
                    {interview.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/interviews/${interview.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={isPending && deletingId === interview.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>インタビューを削除</AlertDialogTitle>
                        <AlertDialogDescription>
                          「{interview.title}」を削除しますか？
                          この操作は取り消せません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(interview.id)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
