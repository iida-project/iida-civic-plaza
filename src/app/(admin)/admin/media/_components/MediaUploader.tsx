'use client'

import { useState, useCallback } from 'react'
import { Upload, ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadMedia } from '../actions'

interface MediaUploaderProps {
  onUploaded: () => void
}

export function MediaUploader({ onUploaded }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: 'pending' | 'uploading' | 'done' | 'error' }>({})

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      addFilesToQueue(files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      )
      if (imageFiles.length > 0) {
        addFilesToQueue(imageFiles)
      }
    }
    e.target.value = '' // リセット
  }

  const addFilesToQueue = (files: File[]) => {
    setUploadQueue((prev) => [...prev, ...files])
    const newProgress: { [key: string]: 'pending' } = {}
    files.forEach((file) => {
      newProgress[file.name] = 'pending'
    })
    setUploadProgress((prev) => ({ ...prev, ...newProgress }))
  }

  const removeFromQueue = (fileName: string) => {
    setUploadQueue((prev) => prev.filter((f) => f.name !== fileName))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const uploadFiles = async () => {
    if (uploadQueue.length === 0) return

    setIsUploading(true)

    for (const file of uploadQueue) {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 'uploading' }))

      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadMedia(formData)

      if (result.success) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 'done' }))
      } else {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 'error' }))
      }
    }

    setIsUploading(false)

    // 少し待ってからリセット
    setTimeout(() => {
      setUploadQueue([])
      setUploadProgress({})
      onUploaded()
    }, 1000)
  }

  const formatFileSize = (bytes: number) => {
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* ドロップエリア */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-colors cursor-pointer
          ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center text-gray-500">
          <Upload className="h-10 w-10 mb-2" />
          <p className="text-sm font-medium">
            ドラッグ&ドロップ または クリックしてアップロード
          </p>
          <p className="text-xs mt-1">PNG, JPG, GIF, WebP</p>
        </div>
      </div>

      {/* アップロードキュー */}
      {uploadQueue.length > 0 && (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">{uploadQueue.length} ファイル選択中</p>
            <Button onClick={uploadFiles} disabled={isUploading}>
              {isUploading ? 'アップロード中...' : 'アップロード開始'}
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadQueue.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded"
              >
                <ImageIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {uploadProgress[file.name] === 'uploading' && (
                    <span className="text-xs text-blue-600">アップロード中</span>
                  )}
                  {uploadProgress[file.name] === 'done' && (
                    <span className="text-xs text-green-600">完了</span>
                  )}
                  {uploadProgress[file.name] === 'error' && (
                    <span className="text-xs text-red-600">エラー</span>
                  )}
                  {uploadProgress[file.name] === 'pending' && !isUploading && (
                    <button
                      onClick={() => removeFromQueue(file.name)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
