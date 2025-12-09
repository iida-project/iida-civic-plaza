import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * HTMLタグを除去してプレーンテキストに変換
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}
