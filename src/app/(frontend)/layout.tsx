import type { Metadata } from 'next'
import { M_PLUS_Rounded_1c, Noto_Serif_JP } from 'next/font/google'
import '../globals.css'
import { Header, Footer } from './_components'

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '500', '700', '800'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
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
      <body className={`${mPlusRounded.variable} ${notoSerifJP.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
