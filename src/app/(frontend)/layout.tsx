import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { Header, Footer } from './_components'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: '飯田の市民活動ひろば',
    template: '%s | 飯田の市民活動ひろば',
  },
  description: '飯田市内のNPO・市民活動を可視化するWebサイト。市民活動団体の紹介やインタビュー、助成金情報などを発信しています。',
  openGraph: {
    title: '飯田の市民活動ひろば',
    description: '飯田市内のNPO・市民活動を可視化するWebサイト',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
