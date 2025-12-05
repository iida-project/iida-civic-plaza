import { Metadata } from 'next'
import Link from 'next/link'
import {
  Heart,
  Users,
  Target,
  Mail,
  Building2,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'サイトについて | 飯田の市民活動ひろば',
  description:
    '「飯田の市民活動ひろば」は飯田市内のNPO・市民活動を可視化し、つなげるためのサイトです。',
}

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            サイトについて
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            「飯田の市民活動ひろば」は、飯田市内で活動するNPO・市民活動団体と
            <br className="hidden sm:inline" />
            地域のみなさんをつなぐ情報サイトです。
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* サイトのコンセプト */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">サイトのコンセプト</h2>
            </div>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                飯田市には、子育て支援、福祉、環境保全、文化活動など、
                さまざまな分野で活躍する市民活動団体があります。
                しかし、その活動内容や参加方法が十分に知られていないことも少なくありません。
              </p>
              <p>
                「飯田の市民活動ひろば」は、そうした市民活動の「見える化」を目指して生まれました。
                活動に興味がある方、参加したい方、支援したい方と、
                活動を広げたい団体をつなぐ架け橋となることを目指しています。
              </p>
            </div>
          </section>

          {/* このサイトでできること */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">
              このサイトでできること
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-apple-red/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-apple-red" />
                </div>
                <h3 className="font-semibold mb-2">活動団体を探す</h3>
                <p className="text-sm text-muted-foreground">
                  分野やエリアから、興味のある市民活動団体を見つけることができます。
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-apple-green/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-7 w-7 text-apple-green" />
                </div>
                <h3 className="font-semibold mb-2">活動を知る</h3>
                <p className="text-sm text-muted-foreground">
                  インタビュー記事を通じて、活動の想いや魅力を深く知ることができます。
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-apple-orange/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-7 w-7 text-apple-orange" />
                </div>
                <h3 className="font-semibold mb-2">助成金を探す</h3>
                <p className="text-sm text-muted-foreground">
                  市民活動に活用できる助成金・補助金の情報を確認できます。
                </p>
              </div>
            </div>
          </section>

          {/* 運営について */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-apple-blue" />
              </div>
              <h2 className="text-2xl font-bold">運営について</h2>
            </div>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-1">飯田市</h4>
                  <p className="text-sm text-muted-foreground">
                    市民活動支援・地域づくりの推進
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-1">本岡 紗代</h4>
                  <p className="text-sm text-muted-foreground">
                    コンテンツ制作・記事執筆
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-1">ほほ笑みラボ</h4>
                  <p className="text-sm text-muted-foreground">
                    サイト制作・システム開発
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="bg-gradient-to-br from-primary/5 to-apple-orange/5 rounded-2xl border border-border p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">お問い合わせ</h2>
            <p className="text-foreground/80 mb-6 max-w-lg mx-auto">
              サイトに関するご質問、掲載希望、その他のお問い合わせは、
              飯田市役所の担当窓口までお願いいたします。
            </p>
            <Link
              href="https://www.city.iida.lg.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              飯田市ホームページへ
              <ExternalLink className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
