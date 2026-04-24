'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

type CloudVisibilityContextType = {
  cloudsVisible: boolean
  toggle: () => void
}

const CloudVisibilityContext = createContext<CloudVisibilityContextType | null>(
  null
)

const STORAGE_KEY = 'clouds-visible'

export function CloudVisibilityProvider({ children }: { children: ReactNode }) {
  const [cloudsVisible, setCloudsVisible] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) setCloudsVisible(stored === 'true')
  }, [])

  const toggle = () => {
    setCloudsVisible((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        // localStorage 不可の環境は状態のみ切替
      }
      return next
    })
  }

  return (
    <CloudVisibilityContext.Provider value={{ cloudsVisible, toggle }}>
      {children}
    </CloudVisibilityContext.Provider>
  )
}

export function useCloudVisibility() {
  const ctx = useContext(CloudVisibilityContext)
  if (!ctx) {
    // Provider 外での呼び出しは雲は表示扱い（SSR/非ラップ時の安全弁）
    return { cloudsVisible: true, toggle: () => {} }
  }
  return ctx
}
