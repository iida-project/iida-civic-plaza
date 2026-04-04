import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ムトス飯田推進委員会／コーディネート専門委員 | 飯田の市民活動ひろば',
  description:
    'ムトス飯田推進委員会とコーディネート専門委員会の活動内容・概要をご紹介します。',
}

export default function MutosCommitteePage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス飯田推進委員会／コーディネート専門委員
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/uploaded/attachment/67669.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apple-blue hover:underline inline-flex items-center gap-1"
            >
              飯田市ホームページ（PDF）
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {/* ムトス飯田推進委員会 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold">ムトス飯田推進委員会</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  「学習」「交流」「支援」の3つを柱に、「ムトス」を合言葉に、自ら地域をより良くしようという活動を応援する団体です。
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>団体の学習会・交流会など開催</li>
                  <li>「ムトス飯田助成金制度」の運用</li>
                  <li>「ムトス飯田賞」表彰事業</li>
                  <li>事務局体制
                    <ul className="list-disc list-inside ml-6 text-sm space-y-0.5 mt-1">
                      <li>行政事務局（飯田市 共生・協働推進課）</li>
                      <li>市民事務局（市民スタッフ）で担当</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <tbody className="text-foreground/80">
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">会員数</th>
                        <td className="border border-border px-4 py-2">10名</td>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">設立</th>
                        <td className="border border-border px-4 py-2">1985年</td>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">所在地</th>
                        <td className="border border-border px-4 py-2">飯田市東和町2丁目35番地<br />丘の上結いスクエア2階</td>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">電話</th>
                        <td className="border border-border px-4 py-2">070-4442-7077（事務局専用）</td>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">メール</th>
                        <td className="border border-border px-4 py-2">mutosu.iida@gmail.com</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-sm text-foreground/80 space-y-1">
                  <p className="font-semibold">HP・SNS</p>
                  <p>Instagram：mutosu_iida</p>
                  <p>Facebook：mutosu.iida</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-foreground/60 space-x-4">
              <span className="inline-block bg-muted/50 rounded px-2 py-1">まちづくり</span>
              <span className="inline-block bg-muted/50 rounded px-2 py-1">助言・支援</span>
              <span className="inline-block bg-muted/50 rounded px-2 py-1">学習</span>
            </div>
          </section>

          {/* コーディネート専門委員会 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold">コーディネート専門委員会</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  市民活動のコーディネートを行っています。
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>ムトスぷらざ市民活動相談窓口に寄せられた相談対応</li>
                  <li>「ムトス飯田学習交流会」協力</li>
                </ul>
              </div>

              <div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <tbody className="text-foreground/80">
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">会員数</th>
                        <td className="border border-border px-4 py-2">10名</td>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">設立</th>
                        <td className="border border-border px-4 py-2">2017年</td>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">問合せ先</th>
                        <td className="border border-border px-4 py-2">
                          事務局<br />
                          070-4442-7077（事務局専用）<br />
                          mutosu.iida@gmail.com
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-border px-4 py-2 bg-muted/50 text-left whitespace-nowrap">HP・SNS</th>
                        <td className="border border-border px-4 py-2">なし</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="text-sm text-foreground/60 space-x-4">
              <span className="inline-block bg-muted/50 rounded px-2 py-1">まちづくり</span>
              <span className="inline-block bg-muted/50 rounded px-2 py-1">助言・支援</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
