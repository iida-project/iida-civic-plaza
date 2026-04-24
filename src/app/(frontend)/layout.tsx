import type { Metadata } from 'next'
import { M_PLUS_Rounded_1c, Noto_Serif_JP } from 'next/font/google'
import '../globals.css'
import { Header, Footer, CloudVisibilityProvider, CloudToggle } from './_components'
import { JsonLd } from '@/components/common'
import { generateWebSiteJsonLd } from '@/lib/jsonld'
import { createPublicClient } from '@/lib/supabase/public'

export const revalidate = 60

async function getLatestNews() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('news_posts')
    .select('slug, title, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    siteName: '飯田の市民活動ひろば',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: './',
  },
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const latestNews = await getLatestNews()
  return (
    <html lang="ja">
      <body className={`${mPlusRounded.variable} ${notoSerifJP.variable} antialiased`}>
        <JsonLd data={generateWebSiteJsonLd()} />
        <CloudVisibilityProvider>
          <div className="min-h-screen flex flex-col">
            <Header latestNews={latestNews} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CloudToggle />
        </CloudVisibilityProvider>
      </body>
    </html>
  )
}
