'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react-dom'
import {
  ImageIcon,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomFloatingMenuProps {
  editor: Editor | null
  onImageUpload?: () => void
}

export function CustomFloatingMenu({ editor, onImageUpload }: CustomFloatingMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { refs, floatingStyles } = useFloating({
    placement: 'left-start',
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const updateMenu = useCallback(() => {
    if (!editor) return

    // エディタにフォーカスがない場合は非表示
    if (!editor.isFocused) {
      setIsVisible(false)
      setIsExpanded(false)
      return
    }

    const { selection } = editor.state
    const { $anchor, empty } = selection

    // テキスト選択時は非表示
    if (!empty) {
      setIsVisible(false)
      setIsExpanded(false)
      return
    }

    // 空ブロックまたはブロック先頭かチェック
    const isEmptyBlock = $anchor.parent.content.size === 0
    const isAtStart = $anchor.parentOffset === 0

    if (!isEmptyBlock && !isAtStart) {
      setIsVisible(false)
      setIsExpanded(false)
      return
    }

    const coords = editor.view.coordsAtPos(selection.from)

    const virtualEl = {
      getBoundingClientRect() {
        return {
          x: coords.left,
          y: coords.top,
          top: coords.top,
          left: coords.left,
          bottom: coords.bottom,
          right: coords.left,
          width: 0,
          height: coords.bottom - coords.top,
        }
      },
    }

    refs.setReference(virtualEl)
    setIsVisible(true)
  }, [editor, refs])

  useEffect(() => {
    if (!editor) return
    editor.on('selectionUpdate', updateMenu)
    editor.on('transaction', updateMenu)
    editor.on('focus', updateMenu)
    editor.on('blur', updateMenu)
    return () => {
      editor.off('selectionUpdate', updateMenu)
      editor.off('transaction', updateMenu)
      editor.off('focus', updateMenu)
      editor.off('blur', updateMenu)
    }
  }, [editor, updateMenu])

  useEffect(() => {
    setMounted(true)
  }, [])

  // 外側クリックでメニューを閉じる
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded])

  // メニューを閉じてフォーカスを戻す
  const handleAction = (action: () => void) => {
    action()
    setIsExpanded(false)
  }

  if (!mounted || !isVisible || !editor) return null

  return createPortal(
    <div
      ref={(node) => {
        refs.setFloating(node)
        menuRef.current = node
      }}
      style={{
        ...floatingStyles,
        zIndex: 9999,
      }}
    >
      {isExpanded ? (
        <div className="flex items-center gap-0.5 p-1 rounded-lg shadow-lg border bg-white">
          {onImageUpload && (
            <MenuButton
              onClick={() => handleAction(onImageUpload)}
              title="画像挿入"
            >
              <ImageIcon className="h-4 w-4" />
            </MenuButton>
          )}
          <MenuButton
            onClick={() => handleAction(() => editor.chain().focus().setHorizontalRule().run())}
            title="水平線"
          >
            <Minus className="h-4 w-4" />
          </MenuButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <MenuButton
            onClick={() => handleAction(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
            isActive={editor.isActive('heading', { level: 1 })}
            title="見出し1"
          >
            <Heading1 className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => handleAction(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
            isActive={editor.isActive('heading', { level: 2 })}
            title="見出し2"
          >
            <Heading2 className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => handleAction(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
            isActive={editor.isActive('heading', { level: 3 })}
            title="見出し3"
          >
            <Heading3 className="h-4 w-4" />
          </MenuButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <MenuButton
            onClick={() => handleAction(() => editor.chain().focus().toggleBlockquote().run())}
            isActive={editor.isActive('blockquote')}
            title="引用"
          >
            <Quote className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => handleAction(() => editor.chain().focus().toggleBulletList().run())}
            isActive={editor.isActive('bulletList')}
            title="箇条書き"
          >
            <List className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => handleAction(() => editor.chain().focus().toggleOrderedList().run())}
            isActive={editor.isActive('orderedList')}
            title="番号付きリスト"
          >
            <ListOrdered className="h-4 w-4" />
          </MenuButton>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-1.5 rounded-full shadow-lg border bg-white hover:bg-gray-50 transition-colors"
          title="メニューを開く"
        >
          <Plus className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>,
    document.body
  )
}

interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}

function MenuButton({ onClick, isActive, title, children }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded hover:bg-gray-100 transition-colors',
        isActive && 'bg-gray-200 text-primary'
      )}
    >
      {children}
    </button>
  )
}
