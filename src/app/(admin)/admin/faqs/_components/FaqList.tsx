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
import { Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { deleteFaq, togglePublish, updateSortOrder } from '../actions'

type Faq = {
  id: string
  question: string
  answer: string
  sort_order: number
  is_published: boolean
}

interface FaqListProps {
  faqs: Faq[]
}

export function FaqList({ faqs }: FaqListProps) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteFaq(id)
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

  const handleMoveUp = (id: string) => {
    startTransition(async () => {
      const result = await updateSortOrder(id, 'up')
      if (!result.success) {
        alert(result.error)
      }
    })
  }

  const handleMoveDown = (id: string) => {
    startTransition(async () => {
      const result = await updateSortOrder(id, 'down')
      if (!result.success) {
        alert(result.error)
      }
    })
  }

  // 質問を短縮表示
  const truncate = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (faqs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        FAQがありません
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">順序</TableHead>
            <TableHead className="w-[45%]">質問</TableHead>
            <TableHead>回答</TableHead>
            <TableHead className="text-center">状態</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq, index) => (
            <TableRow key={faq.id}>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleMoveUp(faq.id)}
                    disabled={isPending || index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">{faq.sort_order}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleMoveDown(faq.id)}
                    disabled={isPending || index === faqs.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/faqs/${faq.id}`}
                  className="hover:text-orange-600"
                >
                  {truncate(faq.question)}
                </Link>
              </TableCell>
              <TableCell className="text-gray-600">
                {truncate(faq.answer, 40)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={faq.is_published ? 'default' : 'secondary'}>
                  {faq.is_published ? '公開' : '非公開'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(faq.id)}
                    disabled={isPending && togglingId === faq.id}
                    title={faq.is_published ? '非公開にする' : '公開する'}
                  >
                    {faq.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/faqs/${faq.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={isPending && deletingId === faq.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>FAQを削除</AlertDialogTitle>
                        <AlertDialogDescription>
                          「{truncate(faq.question, 30)}」を削除しますか？
                          この操作は取り消せません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(faq.id)}
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
