'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Option = {
  id: string
  name: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = '選択してください',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const removeOption = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((s) => s !== id))
  }

  const selectedOptions = options.filter((opt) => selected.includes(opt.id))

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between font-normal"
      >
        <div className="flex flex-wrap gap-1 flex-1 text-left">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <Badge
                key={opt.id}
                variant="secondary"
                className="mr-1"
                onClick={(e) => removeOption(opt.id, e)}
              >
                {opt.name}
                <X className="ml-1 h-3 w-3 cursor-pointer" />
              </Badge>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="p-2 text-sm text-gray-500 text-center">
              選択肢がありません
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={cn(
                  'flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100',
                  selected.includes(option.id) && 'bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'mr-2 h-4 w-4 border rounded flex items-center justify-center',
                    selected.includes(option.id)
                      ? 'bg-primary border-primary'
                      : 'border-gray-300'
                  )}
                >
                  {selected.includes(option.id) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{option.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
