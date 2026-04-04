import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: '他団体主催の助成金事業 | 飯田の市民活動ひろば',
  description:
    'ムトス飯田助成事業 チャレンジ部門のご案内。身近なことから何かやってみたい方を応援する、最大5万円の助成金です。',
}

export default function OtherGrantsPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            他団体主催の助成金事業
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/mutosu-cyarenji.html"
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
          {/* 概要 */}
          <section className="space-y-4 text-foreground/80 leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">
              ムトス飯田助成事業　チャレンジ部門
            </h2>
            <p className="text-lg font-semibold">
              地域をよりよくするため、身近なことから何かやってみたい、という方を応援します。
            </p>
          </section>

          {/* 助成内容 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">助成内容</h2>
            <dl className="text-foreground/80 space-y-3">
              <div>
                <dt className="font-semibold inline">対象：</dt>
                <dd className="inline">市民を元気にする活動、地域に貢献した活動をする団体・個人（21歳以上）</dd>
              </div>
              <div>
                <dt className="font-semibold inline">活動期間：</dt>
                <dd className="inline">令和7年5月1日（水）〜 令和8年2月28日（土）</dd>
              </div>
              <div>
                <dt className="font-semibold inline">助成率：</dt>
                <dd className="inline">活動費の最大100%</dd>
              </div>
              <div>
                <dt className="font-semibold inline">助成額：</dt>
                <dd className="inline">最大5万円</dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">
              ※予算の範囲内で助成します。初めて申請する団体等を優先する場合があります。
            </p>
          </section>

          {/* 応募 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">応募について</h2>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">応募条件</h3>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>飯田市内で活動していること</li>
                <li>地域づくり・まちづくりに関係する活動であること</li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">応募期間</h3>
              <p className="text-foreground/80">令和7年5月1日（木）〜 令和8年2月27日（金）</p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">応募書類</h3>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>助成金の申し込み書（様式1）</li>
                <li>企画書（様式3 ／イベントの場合のみ提出）</li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">応募先</h3>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>ムトスぷらざ2階窓口</li>
                <li>各地区自治振興センター</li>
              </ul>
            </div>
          </section>

          {/* よくある質問 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">よくある質問</h2>

            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-semibold mb-2">Q1. やりたいことが、ぼんやりあるだけなんだけど…。</p>
                <p className="text-foreground/80">
                  A1. <Link href="/about-hiroba" className="text-apple-blue hover:underline">ムトス市民活動ひろば（相談窓口）</Link>へ、まずは気軽に電話やメールでおたずねください！
                  お話を聞きながら、みなさんのやりたいことを一緒に整理します。書類の書き方もアドバイスしています。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-semibold mb-2">Q2. メンバーが何名いれば、団体となりますか？</p>
                <p className="text-foreground/80">A2. 3名以上で団体となります。</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-semibold mb-2">Q3. 個人でも応募できるの？</p>
                <p className="text-foreground/80">
                  A3. 個人でも応募できますが、選考基準のほか「協力者など仲間を増やす工夫の有無」が審査されます。
                  なお、個人の場合、助成金による購入品は活動終了後に事務局でお預かりし、貸出制となります（他の団体へも貸し出しします）。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-semibold mb-2">Q4. 助成金がもらえるのは、1回だけ？</p>
                <p className="text-foreground/80">A4. 1回のみです。活動の&ldquo;はじめの一歩&rdquo;のための助成金です。</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-semibold mb-2">Q5. 学生でも応募できる？</p>
                <p className="text-foreground/80">
                  A5. 20歳以下が応募できる「部門4 若者発・地域づくり応援」があります！
                  申し込み方法はお問い合わせください。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-semibold mb-2">Q6. 「事業経費」ってなに？</p>
                <p className="text-foreground/80">
                  A6. 材料費、物品の購入費、レンタル費用、チラシなどの広報代、講師謝礼など、
                  活動するために必要な金額をまず書き出してみましょう。そのうち、5万円までの助成ができます。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="font-semibold mb-2">Q7. 活動する場所や、広く知ってもらう方法を探しています。</p>
                <p className="text-foreground/80">
                  A7. 会場探しや広報の方法もご相談ください。
                  必要に応じて、市民活動を支援するコーディネート専門委員をご紹介します。
                </p>
              </div>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">提出先・お問い合わせ</h2>
            <div className="text-foreground/80 space-y-2">
              <p><strong>ムトス飯田推進委員会　事務局</strong></p>
              <p>〒395-0086 飯田市東和町2丁目35番地　丘の上結いスクエア2階　ムトスぷらざ内</p>
              <p>Tel：070-4442-7077</p>
              <p>Fax：0265-22-1022</p>
              <p>メール：mutosu.iida@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
