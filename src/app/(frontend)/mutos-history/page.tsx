import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ムトス飯田の歩み | 飯田の市民活動ひろば',
  description:
    '昭和57年から続くムトス飯田の歩みと、まちづくり活動報告集のご紹介です。',
}

export default function MutosHistoryPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス飯田の歩み
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/uploaded/attachment/59077.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apple-blue hover:underline inline-flex items-center gap-1"
            >
              ムトス飯田まちづくり活動報告集（PDF）
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {/* はじめに */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">はじめに</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                「ムトス」とは、広辞苑などにも載っている言葉「むとす」を引用したもので、「…しようとする」という意味が込められており、行動への意志や意欲を表す言葉です。
              </p>
              <p>
                飯田市は、昭和57年3月に市が作成した「10万都市構想」において、理想とする都市像の実現に向けての行動理念・合言葉として「ムトス」を使用しました。
              </p>
              <p>
                飯田市自治基本条例（平成19年4月1日施行）にも、まちづくりに進んで参加するムトスの精神について謳われております。「ムトス」を地域づくりの合言葉にして、私たち一人ひとりの心の中にある「地域を愛する想い、自分ができることからやってみよう」とする自発的な意志や意欲、具体的な行動をあらわし、住みよいまちづくりをめざしています。
              </p>
            </div>
          </section>

          {/* ムトス飯田表彰事業 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">ムトス飯田表彰事業の歩み</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                ムトス飯田表彰事業は、「ムトス飯田の精神を広めるために役立ててください」という一市民の寄付が契機となり、昭和60年度に創設されました。
              </p>
              <p>
                以来、「ムトスの精神」が際立ち、飯田の将来に向けて示唆的で主張ある活動をしている団体・個人を表彰してきました。この賞には、受賞者のムトスの活動をたたえ励ます気持ちと、受賞者の生き生きとした活動の姿が、私たち一人ひとりの秘めているムトスを呼び起こし、市民活動が発展していくことへの「期待」が込められています。
              </p>
              <p>
                <Link href="/mutos-award" className="text-apple-blue hover:underline">
                  歴代受賞団体はこちら
                </Link>
              </p>
            </div>
          </section>

          {/* ムトス助成事業 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">ムトス助成事業の歩み</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                ムトス助成事業は、平成3年度からふるさと創生の1億円を基金として、公益的な地域づくり活動を支援するために、独創的で波及効果のある地域づくりの活動に対して助成事業を開始しました。
              </p>
              <p>
                毎年、団体・個人からの助成金申請に対して、会長（飯田市長）と各分野で活動する市民でつくる「ムトス飯田推進委員会」が審査し、ムトスの精神にふさわしい団体等に助成をしています。
              </p>
              <p>
                <Link href="/mutos-grants" className="text-apple-blue hover:underline">
                  助成事業の詳細はこちら
                </Link>
              </p>
            </div>
          </section>

          {/* 年表 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">主な沿革</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-4 py-3 text-left whitespace-nowrap">年度</th>
                    <th className="border border-border px-4 py-3 text-left">できごと</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80">
                  <tr>
                    <td className="border border-border px-4 py-2 whitespace-nowrap">昭和57年</td>
                    <td className="border border-border px-4 py-2">「10万都市構想」で「ムトス」を行動理念・合言葉として使用</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 whitespace-nowrap">昭和60年度</td>
                    <td className="border border-border px-4 py-2">ムトス飯田表彰事業（ムトス飯田賞）創設 — 一市民の寄付が契機</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 whitespace-nowrap">平成3年度</td>
                    <td className="border border-border px-4 py-2">ムトス助成事業開始 — ふるさと創生1億円を基金に</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 whitespace-nowrap">平成19年</td>
                    <td className="border border-border px-4 py-2">飯田市自治基本条例施行 — ムトスの精神を明記</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 whitespace-nowrap">令和4年度</td>
                    <td className="border border-border px-4 py-2">ムトス飯田チャレンジ助成事業を新設</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 活動報告集 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">ムトス飯田まちづくり活動報告集</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                ムトス飯田推進委員会では、市民の皆様の活動状況を広く情報提供して、今後のまちづくりや協働の参考にしていただくよう、ムトス飯田に関係する団体等を中心にまとめた「活動報告集」を毎年発行しています。
              </p>
              <p>
                新たな繋がりの構築や連携、地域づくり活動の一助としていただければ幸いです。
              </p>
              <p>
                <Link
                  href="https://www.city.iida.lg.jp/uploaded/attachment/59077.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-apple-blue hover:underline inline-flex items-center gap-1"
                >
                  令和2年度 活動報告集（PDF / 9.4MB）
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </section>

          {/* ロゴマーク */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">ムトス飯田ロゴマーク</h2>
            <div className="text-foreground/80 leading-relaxed">
              <p>
                人と人が手をついで結びあっています。そしてリンゴの形に見えることにより、多様な主体の協働と飯田市の象徴をイメージしています。多様な主体が結びあうことで、まちづくりをしましょう。
              </p>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
            <div className="text-foreground/80 space-y-2">
              <p><strong>ムトス飯田推進委員会　事務局</strong></p>
              <p>〒395-0086 飯田市東和町2丁目35番地　丘の上結いスクエア2階　ムトスぷらざ内</p>
              <p>Tel：070-4442-7077（事務局専用）</p>
              <p>Tel：0265-22-4560（飯田市共生・協働推進課）</p>
              <p>Fax：0265-22-1022</p>
              <p>メール：mutosu.iida@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
