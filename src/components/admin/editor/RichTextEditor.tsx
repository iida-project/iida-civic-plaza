'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Image as TiptapImage } from '@tiptap/extension-image'
import { Link as TiptapLink } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { EditorToolbar } from './EditorToolbar'
import { useEffect, useRef } from 'react'

interface RichTextEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  onImageUpload?: () => Promise<string | null>
}

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = '本文を入力してください...',
  onImageUpload,
}: RichTextEditorProps) {
  const isInitialMount = useRef(true)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  // 外部からcontentが変わったときに反映
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleImageUpload = async () => {
    if (!onImageUpload || !editor) return
    const url = await onImageUpload()
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border border-gray-300 rounded-md">
      <EditorToolbar
        editor={editor}
        onImageUpload={onImageUpload ? handleImageUpload : undefined}
      />
      <EditorContent editor={editor} />
    </div>
  )
}
