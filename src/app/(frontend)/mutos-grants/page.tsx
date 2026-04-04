import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ムトス飯田助成事業 | 飯田の市民活動ひろば',
  description:
    '「地域や社会のために何かしたい！」と活動するみなさんを応援するムトス飯田助成事業のご案内です。',
}

export default function MutosGrantsPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス飯田助成事業
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/r5-01-mutosuiidabosyu.html"
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
            <p className="text-lg font-semibold">
              「地域や社会のために何かしたい！」と活動するみなさんを応援します。
            </p>
            <p>
              地域づくりに取り組む団体、個人の皆さんは助成金を利用できます。
            </p>
          </section>

          {/* 募集部門一覧 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">募集部門（ムトス飯田助成制度 春募集）</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-4 py-3 text-left">部門</th>
                    <th className="border border-border px-4 py-3 text-left">助成金</th>
                    <th className="border border-border px-4 py-3 text-left">対象年齢</th>
                    <th className="border border-border px-4 py-3 text-left">対象団体</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80">
                  <tr>
                    <td className="border border-border px-4 py-3 font-semibold">1. 地域づくり応援 *</td>
                    <td className="border border-border px-4 py-3">最大30万円</td>
                    <td className="border border-border px-4 py-3">一般（21歳以上）</td>
                    <td className="border border-border px-4 py-3">1団体、個人</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-3 font-semibold">2. 地域づくり協働 *</td>
                    <td className="border border-border px-4 py-3">最大30万円</td>
                    <td className="border border-border px-4 py-3">一般（21歳以上）</td>
                    <td className="border border-border px-4 py-3">2団体以上</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-3 font-semibold">3. チャレンジ</td>
                    <td className="border border-border px-4 py-3">最大5万円</td>
                    <td className="border border-border px-4 py-3">一般（21歳以上）</td>
                    <td className="border border-border px-4 py-3">1団体、個人</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-3 font-semibold">4. 若者発・地域づくり応援</td>
                    <td className="border border-border px-4 py-3">最大20万円</td>
                    <td className="border border-border px-4 py-3">20歳以下</td>
                    <td className="border border-border px-4 py-3">1グループ、個人（2グループ以上も可）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              * 部門1・部門2について、3回目の申請は上限20万円となります。
            </p>
          </section>

          {/* よくある質問 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold">よくある質問</h2>

            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-1">Q. 自分の活動は、どの部門が当てはまるの？</p>
                <div className="text-foreground/80 space-y-1">
                  <p>A. 一般の方が1団体で活動する場合、「1. 地域づくり応援」「3. チャレンジ助成」をご利用ください。</p>
                  <p>20歳以下の方が活動する場合、「4. 若者発・地域づくり応援」が対象です。</p>
                  <p>対象の部門は活動の規模や目的によって異なるため、まずは窓口、電話・メールからご相談ください。</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">Q. これまでどんな活動が、助成を受けているの？</p>
                <div className="text-foreground/80 space-y-1">
                  <p>A. 遊休農地の活用、地域の景観保全、文化芸術交流、子ども支援など、さまざまな分野の活動が行われています。</p>
                  <p>令和6年度の助成団体は、36団体です。</p>
                </div>
              </div>
            </div>
          </section>

          {/* 各部門詳細 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">各部門の詳細</h2>

            {/* 1. 地域づくり応援 */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">1. 地域づくり応援</h3>
              <dl className="text-foreground/80 space-y-2">
                <div>
                  <dt className="font-semibold inline">対象：</dt>
                  <dd className="inline">飯田市内で地域づくりや社会の問題解決に取り組む団体・個人（21歳以上）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">応募期間：</dt>
                  <dd className="inline">春募集 令和8年2月5日（木）締切 / 次回 令和8年5月ごろ予定</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">活動期間：</dt>
                  <dd className="inline">令和8年4月1日（水）〜 令和9年2月28日（日）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成率：</dt>
                  <dd className="inline">活動費の最大70%</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成額：</dt>
                  <dd className="inline">上限30万円（3回目の申請は上限20万円）</dd>
                </div>
              </dl>
              <p className="text-sm text-muted-foreground">
                ※要項は募集の都度公開します。部門や助成額に変更がある場合があります。
              </p>
            </div>

            {/* 2. 地域づくり協働 */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">2. 地域づくり協働</h3>
              <dl className="text-foreground/80 space-y-2">
                <div>
                  <dt className="font-semibold inline">対象：</dt>
                  <dd className="inline">連携・協働して新たな地域づくりに取り組む2つ以上の団体（21歳以上）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">応募期間：</dt>
                  <dd className="inline">春募集 令和8年2月5日（木）締切 / 次回 令和8年5月ごろ予定</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">活動期間：</dt>
                  <dd className="inline">令和8年4月1日（水）〜 令和9年2月28日（日）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成率：</dt>
                  <dd className="inline">活動費の最大70%</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成額：</dt>
                  <dd className="inline">上限30万円（協働した団体で分配 / 3回目の申請は上限20万円）</dd>
                </div>
              </dl>
              <p className="text-sm text-muted-foreground">
                ※要項は募集の都度公開します。部門や助成額に変更がある場合があります。
              </p>
            </div>

            {/* 3. チャレンジ助成 */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">3. チャレンジ助成</h3>
              <dl className="text-foreground/80 space-y-2">
                <div>
                  <dt className="font-semibold inline">対象：</dt>
                  <dd className="inline">市民を元気にする活動、地域に貢献した活動をする団体・個人（21歳以上）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">応募期間：</dt>
                  <dd className="inline">令和7年5月1日（木）〜 令和8年2月27日（金）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成率：</dt>
                  <dd className="inline">活動費の最大100%</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成額：</dt>
                  <dd className="inline">上限5万円</dd>
                </div>
              </dl>
            </div>

            {/* 4. 若者発・地域づくり応援 */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">4. 若者発・地域づくり応援</h3>
              <dl className="text-foreground/80 space-y-2">
                <div>
                  <dt className="font-semibold inline">対象：</dt>
                  <dd className="inline">飯田市内で地域づくりや社会の問題解決に取り組むグループ（班やクラブなど）・個人（20歳以下）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">応募期間：</dt>
                  <dd className="inline">令和7年5月1日（木）〜 令和8年2月27日（金）</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成率：</dt>
                  <dd className="inline">活動費の最大100%</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">助成額：</dt>
                  <dd className="inline">上限20万円</dd>
                </div>
              </dl>
              <p className="text-sm text-muted-foreground">
                ※2つ以上のグループで取り組む場合、連名で申し込むことも可能です。
              </p>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
            <div className="text-foreground/80 space-y-2">
              <p><strong>ムトス飯田推進委員会　事務局</strong></p>
              <p>〒395-0086 飯田市東和町2丁目35番地　丘の上結いスクエア2階　ムトスぷらざ内</p>
              <p>Tel：070-4442-7077（市民活動相談窓口専用）</p>
              <p>Fax：0265-22-1022</p>
              <p>メール：mutosu.iida@gmail.com</p>
            </div>
            <div className="border-t border-border pt-4 mt-4 text-foreground/80 space-y-2">
              <p><strong>共生・協働推進課ムトス推進係</strong></p>
              <p>Tel：0265-22-4560</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
