'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react-dom'
import { Bold, Italic, Strikethrough, Link, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomBubbleMenuProps {
  editor: Editor | null
}

export function CustomBubbleMenu({ editor }: CustomBubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const updateMenu = useCallback(() => {
    if (!editor) return

    const { selection } = editor.state
    const { empty } = selection

    if (empty) {
      setIsVisible(false)
      setShowLinkInput(false)
      return
    }

    const { from, to } = selection
    const start = editor.view.coordsAtPos(from)
    const end = editor.view.coordsAtPos(to)

    const virtualEl = {
      getBoundingClientRect() {
        return {
          x: start.left,
          y: start.top,
          top: start.top,
          left: start.left,
          bottom: end.bottom,
          right: end.right,
          width: end.right - start.left,
          height: end.bottom - start.top,
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
    return () => {
      editor.off('selectionUpdate', updateMenu)
      editor.off('transaction', updateMenu)
    }
  }, [editor, updateMenu])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLinkSubmit = () => {
    if (!editor) return
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }

  const handleLinkClick = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || ''
    setLinkUrl(previousUrl)
    setShowLinkInput(true)
  }

  if (!mounted || !isVisible || !editor) return null

  return createPortal(
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        zIndex: 9999,
      }}
      className="flex items-center gap-0.5 p-1 rounded-lg shadow-lg border bg-white"
    >
      {showLinkInput ? (
        <div className="flex items-center gap-1 px-1">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="w-48 px-2 py-1 text-sm border rounded"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleLinkSubmit()
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
              }
            }}
          />
          <button
            onClick={handleLinkSubmit}
            className="px-2 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
          >
            OK
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="太字"
          >
            <Bold className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="斜体"
          >
            <Italic className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="取り消し線"
          >
            <Strikethrough className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="コード"
          >
            <Code className="h-4 w-4" />
          </MenuButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <MenuButton
            onClick={handleLinkClick}
            isActive={editor.isActive('link')}
            title="リンク"
          >
            <Link className="h-4 w-4" />
          </MenuButton>
        </>
      )}
    </div>,
    document.body
  )
}

interface MenuButtonProps {
  onClick: () => void
  isActive: boolean
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
