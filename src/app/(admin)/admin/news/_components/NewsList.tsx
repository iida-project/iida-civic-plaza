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
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteNews, togglePublish } from '../actions'

type News = {
  id: string
  title: string
  slug: string
  is_published: boolean
  published_at: string | null
  updated_at: string
}

interface NewsListProps {
  newsList: News[]
}

export function NewsList({ newsList }: NewsListProps) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteNews(id)
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (newsList.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        お知らせがありません
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">タイトル</TableHead>
            <TableHead>公開日</TableHead>
            <TableHead className="text-center">状態</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsList.map((news) => (
            <TableRow key={news.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/news/${news.id}`}
                  className="hover:text-orange-600"
                >
                  {news.title}
                </Link>
              </TableCell>
              <TableCell>{formatDate(news.published_at)}</TableCell>
              <TableCell className="text-center">
                <Badge variant={news.is_published ? 'default' : 'secondary'}>
                  {news.is_published ? '公開' : '下書き'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(news.id)}
                    disabled={isPending && togglingId === news.id}
                    title={news.is_published ? '非公開にする' : '公開する'}
                  >
                    {news.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/news/${news.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={isPending && deletingId === news.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>お知らせを削除</AlertDialogTitle>
                        <AlertDialogDescription>
                          「{news.title}」を削除しますか？
                          この操作は取り消せません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(news.id)}
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
