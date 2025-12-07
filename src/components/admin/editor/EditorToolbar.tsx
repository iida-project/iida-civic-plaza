'use client'

import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link,
  Unlink,
  Table,
  ImageIcon,
  Undo,
  Redo,
  ChevronDown,
  Type,
  Heading2,
  Heading3,
  RemoveFormatting,
  Code,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface EditorToolbarProps {
  editor: Editor | null
  onImageUpload?: () => void
  showTags?: boolean
  onToggleTags?: () => void
}

// 現在のブロックタイプを取得
function getCurrentBlockType(editor: Editor): string {
  if (editor.isActive('heading', { level: 1 })) return '見出し1'
  if (editor.isActive('heading', { level: 2 })) return '見出し2'
  if (editor.isActive('heading', { level: 3 })) return '見出し3'
  if (editor.isActive('bulletList')) return '箇条書き'
  if (editor.isActive('orderedList')) return '番号リスト'
  if (editor.isActive('blockquote')) return '引用'
  return '標準テキスト'
}

export function EditorToolbar({ editor, onImageUpload, showTags, onToggleTags }: EditorToolbarProps) {
  const [, setForceUpdate] = useState(0)

  // エディタの選択状態が変わったときに再レンダリング
  const forceRerender = useCallback(() => {
    setForceUpdate((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!editor) return

    editor.on('selectionUpdate', forceRerender)
    editor.on('transaction', forceRerender)

    return () => {
      editor.off('selectionUpdate', forceRerender)
      editor.off('transaction', forceRerender)
    }
  }, [editor, forceRerender])

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URLを入力してください')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  // 選択範囲内のすべてのブロックを標準テキストに変換
  const clearAllFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run()
  }

  const currentBlockType = getCurrentBlockType(editor)
  const isHeadingActive = editor.isActive('heading')

  return (
    <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 space-y-2">
      {/* 現在の書式表示 */}
      <div className="flex items-center gap-2 px-2 py-1 bg-white rounded border text-sm">
        <span className="text-gray-500">現在の書式:</span>
        <span className={cn(
          "font-medium px-2 py-0.5 rounded",
          isHeadingActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
        )}>
          {currentBlockType}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {/* 元に戻す・やり直し */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="元に戻す"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="やり直し"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* ブロックタイプ選択ドロップダウン */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 gap-1 min-w-[120px] justify-between"
            >
              <span className="truncate">{currentBlockType}</span>
              <ChevronDown className="h-3 w-3 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn(
                "flex items-center gap-2",
                !isHeadingActive && !editor.isActive('bulletList') && !editor.isActive('orderedList') && !editor.isActive('blockquote') && "bg-blue-50"
              )}
            >
              <Type className="h-4 w-4" />
              <span>標準テキスト</span>
              <span className="ml-auto text-xs text-gray-400">P</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                "flex items-center gap-2",
                editor.isActive('heading', { level: 2 }) && "bg-blue-50"
              )}
            >
              <Heading2 className="h-4 w-4" />
              <span className="font-semibold">見出し2</span>
              <span className="ml-auto text-xs text-gray-400">H2</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(
                "flex items-center gap-2",
                editor.isActive('heading', { level: 3 }) && "bg-blue-50"
              )}
            >
              <Heading3 className="h-4 w-4" />
              <span className="font-medium">見出し3</span>
              <span className="ml-auto text-xs text-gray-400">H3</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 書式クリアボタン */}
        <ToolbarButton
          onClick={clearAllFormatting}
          title="書式をすべてクリア（選択範囲を標準テキストに戻す）"
        >
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* 書式 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="太字"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="斜体"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="取り消し線"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* リスト */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="箇条書き"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="番号付きリスト"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* 引用・水平線 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="引用"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="水平線"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* リンク */}
        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="リンク"
        >
          <Link className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="リンク解除"
        >
          <Unlink className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* テーブル */}
        <ToolbarButton onClick={addTable} title="テーブル挿入">
          <Table className="h-4 w-4" />
        </ToolbarButton>

        {/* 画像 */}
        {onImageUpload && (
          <ToolbarButton onClick={onImageUpload} title="画像挿入">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        )}

        <ToolbarDivider />

        {/* タグ表示トグル */}
        {onToggleTags && (
          <ToolbarButton
            onClick={onToggleTags}
            active={showTags}
            title="HTMLタグを表示"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        )}
      </div>

      {/* 使い方のヒント */}
      <div className="text-xs text-gray-500 px-2 space-y-1">
        <p>⚠️ <strong>重要:</strong> 段落を分けるには <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> キーを押してください（Shift+Enterは使わない）</p>
        <p>💡 <strong>1行ずつ変更:</strong> 変更したい段落にカーソルを置いて、ドロップダウンから書式を選択</p>
        <p>💡 <strong>複数行を一括クリア:</strong> テキストを選択して <RemoveFormatting className="h-3 w-3 inline" /> ボタンをクリック</p>
      </div>
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'h-8 w-8 p-0',
        active && 'bg-blue-100 text-blue-700'
      )}
    >
      {children}
    </Button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />
}
