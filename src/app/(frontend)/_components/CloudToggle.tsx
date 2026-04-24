'use client'

import { Cloud, CloudOff } from 'lucide-react'
import { useCloudVisibility } from './CloudVisibilityProvider'

export function CloudToggle() {
  const { cloudsVisible, toggle } = useCloudVisibility()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={cloudsVisible ? '雲を非表示' : '雲を表示'}
      title={cloudsVisible ? '雲を非表示' : '雲を表示'}
      className="fixed bottom-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 text-foreground/50 opacity-40 hover:opacity-100 hover:bg-white hover:text-foreground hover:shadow-md transition-all duration-200"
    >
      {cloudsVisible ? (
        <Cloud className="h-5 w-5" strokeWidth={1.5} />
      ) : (
        <CloudOff className="h-5 w-5" strokeWidth={1.5} />
      )}
    </button>
  )
}
