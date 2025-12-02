'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteOrganization, togglePublish } from '../actions'

type Organization = {
  id: string
  name: string
  slug: string
  is_published: boolean
  updated_at: string
  // Supabase nested select returns object for single relations
  organization_categories?: { category: { name: string } | null }[]
}

interface OrganizationListProps {
  organizations: Organization[]
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteOrganization(id)
      if (!result.success) {
        alert(result.error)
      }
      setDeletingId(null)
      router.refresh()
    })
  }

  const handleTogglePublish = async (id: string) => {
    startTransition(async () => {
      const result = await togglePublish(id)
      if (!result.success) {
        alert(result.error)
      }
      router.refresh()
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        登録されている団体はありません
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">団体名</TableHead>
            <TableHead className="w-[20%]">活動分野</TableHead>
            <TableHead className="w-[15%]">ステータス</TableHead>
            <TableHead className="w-[15%]">更新日</TableHead>
            <TableHead className="w-[10%] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {org.organization_categories
                    ?.filter((oc) => oc.category)
                    .slice(0, 2)
                    .map((oc, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {oc.category!.name}
                      </Badge>
                    ))}
                  {(org.organization_categories?.length || 0) > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(org.organization_categories?.length || 0) - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={org.is_published ? 'default' : 'outline'}>
                  {org.is_published ? '公開' : '下書き'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(org.updated_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(org.id)}
                    disabled={isPending}
                    title={org.is_published ? '非公開にする' : '公開する'}
                  >
                    {org.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/organizations/${org.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending && deletingId === org.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>団体を削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>
                          「{org.name}」を削除します。この操作は取り消せません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(org.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          削除する
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
