import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: '「ムトス」とは | 飯田の市民活動ひろば',
  description:
    '「ムトス」とは飯田市のまちづくりの合言葉。ムトス飯田事業のあらましと推進委員会についてご紹介します。',
}

export default function AboutMutosPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス飯田事業のあらまし
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/mutosuiida-jigyougaiyou.html"
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
          {/* 「ムトス」とは？ */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">「ムトス」とは？</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                「ムトス」とは、飯田市のまちづくりの合言葉です。
                広辞苑などに載っている言葉「むとす」を引用したもので、「…しようとする」という意味が込められており、行動への意志や意欲を表す言葉です。
              </p>
              <p>
                飯田市では、昭和57年3月に市が作成した「10万都市構想」で理想とする都市像の実現に向けての行動理念・合言葉として「ムトス」を使用しました。
              </p>
              <p>
                平成19年4月1日施行の飯田市自治基本条例にも、まちづくりに進んで参加するムトスの精神について謳われており、
                「ムトス」を地域づくりの合言葉にし、私たち一人ひとりの心の中にある、
                「愛する地域を想い、自分ができることからやってみよう」という自発的な意志や意欲、具体的な行動による地域づくりをめざした言葉です。
              </p>
            </div>
          </section>

          {/* ムトス飯田推進委員会 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">ムトス飯田推進委員会</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                ムトス飯田推進委員会（会長：飯田市長 佐藤健、市民8名の委員で構成）は、市民活動に知見のある選抜委員により構成されています。
              </p>
              <p>
                学習・交流・支援の3つを柱に、学習会、交流会、助成事業やムトス飯田賞表彰事業などを実施し、
                「ムトス」を合言葉に、自ら地域をよりよくしようとする活動を応援しています。
              </p>
              <p>
                事務局は、行政事務局（飯田市 共生・協働推進課）と、市民事務局（市民スタッフ）で担当しています。
              </p>
            </div>
          </section>

          {/* ムトス飯田事業の内容 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">ムトス飯田事業の内容</h2>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">1. ムトス飯田表彰事業</h3>
              <p className="text-foreground/80">
                「ムトスの精神」が際立ち、飯田市の将来に向けて、示唆的で主張ある活動を行う団体・個人を表彰してきました。
                この賞には、受賞者のムトスの活動をたたえ励ます気持ちと、受賞者の生き生きとした活動の姿が、
                私たち一人ひとりの秘めている「ムトスの精神」を呼び起こし、皆の行動として広がっていくことへの期待が込められています。
              </p>
              <p>
                <Link href="/mutos-award" className="text-apple-blue hover:underline">
                  受賞団体はこちら
                </Link>
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">2. ムトス飯田助成事業</h3>
              <div className="text-foreground/80 space-y-3">
                <p>
                  飯田市は平成3年度から、ふるさと創生1億円を基金にして、多様な主体の協働によるまちづくりを推進するために、ムトス飯田の取り組みに対して交付金を拠出しています。
                  ムトス飯田推進委員会は、団体や個人からの助成金申請を審査・助成して、独創的で波及効果のあるまちづくり活動を支援しています。
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>ムトス飯田若者助成事業</strong> — 若者の地域づくり・まちづくり活動を支援し、「ムトスの精神」の育成や、ふるさと意識を醸成します。
                  </li>
                  <li>
                    <strong>ムトス飯田チャレンジ助成事業</strong> — 令和4年度より、「地域のために、身近なことから取り組みたい」という方々を応援するため、気軽に挑戦できる制度を新設しました。
                  </li>
                </ul>
              </div>
              <p>
                <Link href="/mutos-grants" className="text-apple-blue hover:underline">
                  助成事業の詳細はこちら
                </Link>
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">3. 一般社団法人 ムトス飯田市民ファンド</h3>
              <p className="text-foreground/80">
                協働のまちづくりの促進を目的に、市内の特定非営利活動法人を対象に「ムトス飯田支援資金」として300万円まで「実質無利子の融資」を行っています。
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">4. コーディネート専門委員会</h3>
              <p className="text-foreground/80">
                市民活動に知見のある委員9名で構成された委員会です。
                積極的な市民活動のコーディネートを行うことにより、多様な主体の協働によるまちづくりを推進しています。
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">5. ムトス飯田学習交流会</h3>
              <p className="text-foreground/80">
                様々な市民団体が、横のつながりや「結い」を築くことを目的に、歴代受賞者・助成団体・NPO等に参加を呼びかけて、実践事例や課題などを語り合う交流会及び学習会を開催しています。
              </p>
              <p>
                <Link href="/mutos-exchange" className="text-apple-blue hover:underline">
                  学習交流会の詳細はこちら
                </Link>
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
