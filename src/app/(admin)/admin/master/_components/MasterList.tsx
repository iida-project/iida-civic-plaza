'use client'

import { useState, useTransition, useActionState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Loader2,
} from 'lucide-react'
import {
  deleteMaster,
  updateSortOrder,
  createMaster,
  updateMaster,
  type MasterType,
  type MasterFormState,
} from '../actions'

type MasterItem = {
  id: string
  name: string
  slug: string
  sort_order?: number
  usage_count: number
}

interface MasterListProps {
  type: MasterType
  items: MasterItem[]
  title: string
  hasSortOrder?: boolean
}

const initialState: MasterFormState = {}

export function MasterList({
  type,
  items,
  title,
  hasSortOrder = true,
}: MasterListProps) {
  const [isPending, startTransition] = useTransition()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null)

  // 作成フォーム
  const createAction = createMaster.bind(null, type)
  const [createState, createFormAction, isCreating] = useActionState(
    async (prevState: MasterFormState, formData: FormData) => {
      const result = await createAction(prevState, formData)
      if (result.success) {
        setIsAddOpen(false)
      }
      return result
    },
    initialState
  )

  // 更新フォーム
  const [updateState, updateFormAction, isUpdating] = useActionState(
    async (prevState: MasterFormState, formData: FormData) => {
      if (!editingItem) return prevState
      const updateAction = updateMaster.bind(null, type, editingItem.id)
      const result = await updateAction(prevState, formData)
      if (result.success) {
        setEditingItem(null)
      }
      return result
    },
    initialState
  )

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteMaster(type, id)
      if (!result.success) {
        alert(result.error)
      }
    })
  }

  const handleMoveUp = (id: string) => {
    startTransition(async () => {
      const result = await updateSortOrder(type, id, 'up')
      if (!result.success) {
        alert(result.error)
      }
    })
  }

  const handleMoveDown = (id: string) => {
    startTransition(async () => {
      const result = await updateSortOrder(type, id, 'down')
      if (!result.success) {
        alert(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}を追加</DialogTitle>
            </DialogHeader>
            <form action={createFormAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input id="name" name="name" required />
                {createState.errors?.name && (
                  <p className="text-sm text-red-500">
                    {createState.errors.name[0]}
                  </p>
                )}
              </div>
              {createState.errors?.general && (
                <p className="text-sm text-red-500">
                  {createState.errors.general[0]}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  キャンセル
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  追加
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          データがありません
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {hasSortOrder && (
                  <TableHead className="w-16 text-center">順序</TableHead>
                )}
                <TableHead>名前</TableHead>
                <TableHead>スラッグ</TableHead>
                <TableHead className="text-center">使用件数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  {hasSortOrder && (
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleMoveUp(item.id)}
                          disabled={isPending || index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-500">
                          {item.sort_order}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleMoveDown(item.id)}
                          disabled={isPending || index === items.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-gray-500">{item.slug}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.usage_count > 0 ? 'default' : 'secondary'}>
                      {item.usage_count} 件
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={editingItem?.id === item.id}
                        onOpenChange={(open) =>
                          setEditingItem(open ? item : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{title}を編集</DialogTitle>
                          </DialogHeader>
                          <form action={updateFormAction} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">名前</Label>
                              <Input
                                id="edit-name"
                                name="name"
                                defaultValue={item.name}
                                required
                              />
                              {updateState.errors?.name && (
                                <p className="text-sm text-red-500">
                                  {updateState.errors.name[0]}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-slug">スラッグ</Label>
                              <Input
                                id="edit-slug"
                                name="slug"
                                defaultValue={item.slug}
                              />
                            </div>
                            {hasSortOrder && (
                              <div className="space-y-2">
                                <Label htmlFor="edit-sort-order">表示順</Label>
                                <Input
                                  id="edit-sort-order"
                                  name="sort_order"
                                  type="number"
                                  defaultValue={item.sort_order}
                                  className="w-24"
                                />
                              </div>
                            )}
                            {updateState.errors?.general && (
                              <p className="text-sm text-red-500">
                                {updateState.errors.general[0]}
                              </p>
                            )}
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingItem(null)}
                              >
                                キャンセル
                              </Button>
                              <Button type="submit" disabled={isUpdating}>
                                {isUpdating && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                更新
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            disabled={isPending || item.usage_count > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>削除確認</AlertDialogTitle>
                            <AlertDialogDescription>
                              「{item.name}」を削除しますか？
                              この操作は取り消せません。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
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
      )}
    </div>
  )
}
