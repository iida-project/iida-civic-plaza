import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ムトス飯田ロゴマークについて | 飯田の市民活動ひろば',
  description:
    'ムトス飯田30周年記念事業で決定したムトス飯田ロゴマークのご紹介です。',
}

export default function MutosLogoPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス飯田ロゴマークについて
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/mutosuiida-rogomark.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apple-blue hover:underline inline-flex items-center gap-1"
            >
              飯田市ホームページ
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {/* ロゴマーク決定の経緯 */}
          <section className="space-y-4 text-foreground/80 leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">ムトス飯田ロゴマークの決定</h2>
            <p>
              ムトス飯田推進委員会（会長 飯田市長、座長 塩澤哲夫）は、ムトス飯田30周年記念事業として、全国から77点の応募があった作品を慎重に審査し、ムトス飯田ロゴマークを決定いたしました。
            </p>
          </section>

          {/* 特選 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">特選</h2>
            <p className="text-foreground/80">
              <strong>永田 康二</strong> 氏（大阪府富田林市）
            </p>
            <div className="space-y-3 text-foreground/80">
              <div>
                <p className="font-semibold">作品の意図</p>
                <p>人と人が手をつないで結び合っています。そしてリンゴの形の「輪」に昇華することをイメージしています。</p>
              </div>
              <div>
                <p className="font-semibold">評価</p>
                <p>多様な主体の協働と、ムトスの精神の発展を感じます。</p>
              </div>
            </div>
          </section>

          {/* 入選 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">入選（順不同）</h2>
            <ul className="text-foreground/80 space-y-2">
              <li>駒井 瞭 氏（大阪府東大阪市）</li>
              <li>佐藤 誠 氏（長野県飯田市）</li>
              <li>小池 友基 氏（群馬県高崎市）</li>
              <li>山口 宮子 氏（山形県寒河江市）</li>
              <li>庄司 義行 氏（三重県四日市市）</li>
              <li>井口 やすひさ 氏（群馬県高崎市）</li>
            </ul>
          </section>

          {/* お問い合わせ */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
            <div className="text-foreground/80 space-y-2">
              <p><strong>ムトス飯田推進委員会　事務局</strong></p>
              <p>〒395-0086 長野県飯田市東和町2丁目35番地</p>
              <p>丘の上結いスクエア2階　共生・協働推進課内</p>
              <p>Tel：0265-22-4560</p>
              <p>Fax：0265-22-1022</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
