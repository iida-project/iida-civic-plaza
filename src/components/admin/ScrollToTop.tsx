'use client'

import { useEffect } from 'react'

/**
 * ページ読み込み時にトップにスクロールするコンポーネント
 * Server Actionsのredirect後にスクロール位置をリセットするために使用
 */
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return null
}
