'use client'

import { useEditor, EditorContent, NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Image as TiptapImage } from '@tiptap/extension-image'
import { Link as TiptapLink } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { EditorToolbar } from './EditorToolbar'
import { useEffect, useRef, useState } from 'react'
import { RichTextRenderer } from '@/components/common'
import { ImageIcon } from 'lucide-react'

// 画像プレースホルダーコンポーネント
function ImagePlaceholder({ node }: NodeViewProps) {
  const src = node.attrs.src as string
  const fileName = src ? src.split('/').pop() || 'image' : 'image'

  return (
    <NodeViewWrapper className="inline-block">
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 border border-dashed border-gray-400 rounded-md text-sm text-gray-600 my-1">
        <ImageIcon className="h-4 w-4" />
        <span className="max-w-[200px] truncate">{fileName}</span>
      </div>
    </NodeViewWrapper>
  )
}

// カスタムImage拡張（エディタ内ではプレースホルダー表示）
const CustomImage = TiptapImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholder)
  },
})

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
  const [showTags, setShowTags] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [previewHtml, setPreviewHtml] = useState(content)

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
      CustomImage.configure({
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
    immediatelyRender: false, // SSR対応
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()

      // HTMLクリーンアップ
      const cleanedHtml = html
        .replace(/(<p><\/p>)+/g, '') // 連続する空の<p>タグを削除
        .replace(/(<h[1-6]><\/h[1-6]>)+/g, '') // 空の見出しタグを削除
        .replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>') // li内のpタグを削除
        .trim()

      // 完全に空になった場合は空文字列を返す
      onChange?.(cleanedHtml || '')
      setPreviewHtml(cleanedHtml || '')
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
    <div className="space-y-2">
      {/* プレビュー表示トグル */}
      <div className="flex items-center justify-end gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showPreview}
            onChange={(e) => setShowPreview(e.target.checked)}
            className="rounded border-gray-300"
          />
          プレビュー表示
        </label>
      </div>

      <div className={`grid gap-4 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* エディタ部分 */}
        <div className="border border-gray-300 rounded-md">
          <EditorToolbar
            editor={editor}
            onImageUpload={onImageUpload ? handleImageUpload : undefined}
            showTags={showTags}
            onToggleTags={() => setShowTags(!showTags)}
          />
          <div className={showTags ? 'show-tags' : ''}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* プレビュー部分 */}
        {showPreview && (
          <div className="border border-gray-300 rounded-md bg-white">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 rounded-t-md">
              <span className="text-sm font-medium text-gray-600">プレビュー</span>
            </div>
            <div className="p-4 min-h-[300px] overflow-auto">
              {previewHtml ? (
                <RichTextRenderer html={previewHtml} size="default" />
              ) : (
                <p className="text-gray-400 text-sm">本文を入力するとプレビューが表示されます</p>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .show-tags .ProseMirror h1::before { content: '<h1> '; color: #9333ea; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror h1::after { content: ' </h1>'; color: #9333ea; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror h2::before { content: '<h2> '; color: #2563eb; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror h2::after { content: ' </h2>'; color: #2563eb; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror h3::before { content: '<h3> '; color: #0891b2; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror h3::after { content: ' </h3>'; color: #0891b2; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror p::before { content: '<p> '; color: #6b7280; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror p::after { content: ' </p>'; color: #6b7280; font-size: 0.75rem; font-family: monospace; }
        .show-tags .ProseMirror blockquote::before { content: '<blockquote>'; color: #f59e0b; font-size: 0.75rem; font-family: monospace; display: block; }
        .show-tags .ProseMirror blockquote::after { content: '</blockquote>'; color: #f59e0b; font-size: 0.75rem; font-family: monospace; display: block; }
        .show-tags .ProseMirror ul::before { content: '<ul>'; color: #10b981; font-size: 0.75rem; font-family: monospace; display: block; }
        .show-tags .ProseMirror ul::after { content: '</ul>'; color: #10b981; font-size: 0.75rem; font-family: monospace; display: block; }
        .show-tags .ProseMirror ol::before { content: '<ol>'; color: #10b981; font-size: 0.75rem; font-family: monospace; display: block; }
        .show-tags .ProseMirror ol::after { content: '</ol>'; color: #10b981; font-size: 0.75rem; font-family: monospace; display: block; }
        .show-tags .ProseMirror li::before { content: '<li> '; color: #10b981; font-size: 0.65rem; font-family: monospace; }
        .show-tags .ProseMirror li::after { content: ' </li>'; color: #10b981; font-size: 0.65rem; font-family: monospace; }
      `}</style>
    </div>
  )
}
