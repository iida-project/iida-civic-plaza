'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

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

export function Footer() {
  return (
    <footer className="bg-[#F9F9F9] text-foreground gradient-border-top">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* サイト情報 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">飯</span>
              </div>
              <span className="font-heading font-bold text-lg">飯田の市民活動ひろば</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              飯田市内のNPO・市民活動を可視化し、
              <br />
              市民の皆さんと活動団体をつなぐプラットフォームです。
            </p>
          </div>

          {/* ナビゲーションリンク */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold mb-4 text-foreground/90">コンテンツ</h3>
              <ul className="space-y-2">
                {footerNavigation.main.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-apple-red transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4 text-foreground/90">サイト情報</h3>
              <ul className="space-y-2">
                {footerNavigation.sub.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-apple-red transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
