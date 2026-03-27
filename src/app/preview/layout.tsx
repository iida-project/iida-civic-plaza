import { M_PLUS_Rounded_1c, Noto_Serif_JP } from 'next/font/google'
import '../globals.css'

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

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${mPlusRounded.variable} ${notoSerifJP.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
