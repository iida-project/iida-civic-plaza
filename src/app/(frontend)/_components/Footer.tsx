'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

/* 旧ナビゲーション（将来使う可能性あり）
const footerNavigation = {
  main: [
    { name: 'トップ', href: '/' },
    { name: '市民活動紹介', href: '/activities' },
    { name: '団体インタビュー', href: '/interviews' },
    { name: '助成金情報', href: '/grants' },
  ],
  sub: [
    { name: 'お知らせ', href: '/news' },
    { name: 'よくある質問', href: '/faq' },
    { name: 'サイトについて', href: '/about' },
  ],
}
*/

type FooterNavGroup =
  | { label: string; items: { name: string; href: string }[] }
  | { label: string; href: string }

const footerNavGroups: FooterNavGroup[] = [
  {
    label: 'ムトス市民活動ひろば',
    items: [
      { name: 'ムトス市民活動ひろばとは', href: '/coming-soon' },
      { name: '相談窓口', href: '/coming-soon' },
    ],
  },
  {
    label: '市民活動団体紹介',
    items: [
      { name: '活動団体紹介', href: '/activities' },
      { name: '活動レポート', href: '/interviews' },
    ],
  },
  {
    label: 'ムトス飯田事業',
    items: [
      { name: 'ムトス飯田助成事業', href: '/coming-soon' },
      { name: 'ムトス飯田賞', href: '/coming-soon' },
      { name: 'ムトス飯田学習交流会／各種講座', href: '/coming-soon' },
    ],
  },
  {
    label: 'ムトス飯田以外の助成金・講座情報',
    items: [
      { name: '他団体主催の助成金事業', href: '/coming-soon' },
      { name: '他団体主催の講座情報', href: '/coming-soon' },
    ],
  },
  {
    label: '一般社団法人ムトス飯田市民ファンド',
    href: '/coming-soon',
  },
  {
    label: 'ムトス飯田事業のあらまし',
    items: [
      { name: '「ムトス」とは', href: '/coming-soon' },
      { name: 'ムトス飯田推進委員会／コーディネート専門委員', href: '/coming-soon' },
      { name: 'ムトス飯田の歩み', href: '/coming-soon' },
      { name: 'ムトス飯田ロゴマークについて', href: '/coming-soon' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#F9F9F9] text-foreground gradient-border-top">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-10"
        >
          {/* サイト情報 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="ロゴ"
                width={32}
                height={40}
                className="h-10 w-auto"
              />
              <span className="font-heading font-bold text-lg">飯田の市民活動ひろば</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              飯田市内のNPO・市民活動を可視化し、
              <br />
              市民の皆さんと活動団体をつなぐプラットフォームです。
            </p>
          </div>

          {/* ナビゲーション */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {footerNavGroups.map((group) => (
              <div key={group.label}>
                {'href' in group ? (
                  <Link
                    href={group.href}
                    className="font-heading font-semibold text-sm text-foreground/90 hover:text-apple-red transition-colors"
                  >
                    {group.label}
                  </Link>
                ) : (
                  <>
                    <h3 className="font-heading font-semibold text-sm mb-3 text-foreground/90">
                      {group.label}
                    </h3>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="text-xs text-muted-foreground hover:text-apple-red transition-colors"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground/90">お問い合わせ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              サイトに関するお問い合わせは
              <br />
              飯田市役所までご連絡ください。
            </p>
            <a
              href="https://www.city.iida.lg.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-apple-blue text-white rounded-full text-sm font-heading font-medium hover:opacity-85 transition-opacity cursor-pointer"
            >
              飯田市役所公式サイト
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* コピーライト */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 pt-8 border-t border-gray-200 text-center"
        >
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 飯田の市民活動ひろば. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
