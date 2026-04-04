import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ムトス市民活動ひろばとは | 飯田の市民活動ひろば',
  description:
    '地域や社会のために活動する皆さんを応援する相談窓口「飯田の市民活動ひろば」のご案内です。',
}

export default function AboutHirobaPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス市民活動ひろばとは
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/senmoniinkaisoudan202304.html"
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
              地域や社会のために活動する皆さんを応援します。
            </p>
            <p>
              市民団体・NPO法人の皆さんの「こんな活動をしてみたい」「仲間を増やしたい」「活動資金を得たい」などの思いに、専門の相談員が対応します。
            </p>
            <p className="text-sm text-muted-foreground">
              （地縁団体に関する手続きなどは
              <Link
                href="https://www.city.iida.lg.jp/soshiki/9/senmoniinkaisoudan202304.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-apple-blue hover:underline inline-flex items-center gap-1"
              >
                こちらのページへ
                <ExternalLink className="h-3 w-3" />
              </Link>
              ）
            </p>
          </section>

          {/* 相談窓口 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">相談窓口「飯田の市民活動ひろば」</h2>
            <div className="space-y-2 text-foreground/80">
              <p><strong>場所：</strong>丘の上結いスクエア2階　ムトスぷらざ　フリースペース奥</p>
              <p><strong>住所：</strong>飯田市東和町2丁目35番地</p>
            </div>
          </section>

          {/* 相談日 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">相談日</h2>
            <p className="text-foreground/80">
              毎月、facebook・Instagramへ相談日カレンダーを掲載しています。<br />
              予約なしの相談もできますが、事前にメールや電話で予約申し込みをするとスムーズです。<br />
              土・日曜日、祝日や、夜の時間帯は応相談となります。
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. 相談日カレンダー</h3>
                <p className="text-foreground/80 mb-1">
                  SNS「飯田の市民活動ひろば」（運営：ムトス飯田推進委員会事務局）
                </p>
                <ul className="list-disc list-inside text-foreground/80 space-y-1">
                  <li>
                    <Link
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-apple-blue hover:underline inline-flex items-center gap-1"
                    >
                      facebook「飯田の市民活動ひろば」
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-apple-blue hover:underline inline-flex items-center gap-1"
                    >
                      Instagram「飯田の市民活動ひろば」
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. 予約フォーム</h3>
                <p className="text-foreground/80">
                  ウェブフォームから相談予約ができます。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. 電話・メール予約</h3>
                <div className="text-foreground/80 space-y-2">
                  <div>
                    <p><strong>電話</strong>（平日：午前8時30分〜午後5時15分）</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>070-4442-7077（ムトス飯田推進委員会　事務局）</li>
                      <li>0265-22-4560（飯田市役所共生・協働推進課）</li>
                    </ul>
                  </div>
                  <p><strong>メール：</strong>mutosu.iida@gmail.com</p>
                </div>
              </div>
            </div>
          </section>

          {/* 相談内容 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">このような相談にご利用ください</h2>
            <p className="text-sm text-muted-foreground">
              ※ご相談により、専門の相談員をご案内する場合があります。
            </p>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-2">1. 市民活動全般</h3>
                <p className="text-foreground/80">
                  活動内容ややってみたいことをお聞きし、組織づくりや事業内容について一緒に考えます。
                  類似した活動団体の紹介、組織の継続についてなど。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-2">2. 情報収集・仲間づくり</h3>
                <p className="text-foreground/80">
                  活動の仲間づくりの方法や、「こんな分野の活動を知りたい」「協働団体を探したい」などの情報をご案内します。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-2">3. 後継者育成</h3>
                <p className="text-foreground/80">
                  団体内の仲間や、活動を応援してくれる人に、世代交代についてどう伝えていくか、後継者となってくれそうな人へのアプローチの方法を一緒に検討します。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-2">4. 情報発信</h3>
                <p className="text-foreground/80">
                  簡単なチラシ作成や印刷・配布方法、PR先などについてアドバイスします。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-2">5. 法人化・組織の運営</h3>
                <p className="text-foreground/80">
                  法人の立ち上げを検討されている方には、活動態勢にあった法人格を一緒に検討します。
                  法人組織を維持していくための事業づくりや資金調達の方法について助言します。
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-2">6. 活動資金の調達</h3>
                <div className="text-foreground/80 space-y-2">
                  <p>
                    会費や寄付など、活動に見合った資金の集め方を一緒に考えます。
                    「ムトス飯田助成金」など、助成金の活用方法などもご案内します。
                  </p>
                  <p>
                    「ムトス飯田助成事業」については
                    <Link href="/grants" className="text-apple-blue hover:underline">こちらのページへ</Link>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    NPO法人向け融資制度「ムトス飯田支援資金」もご利用ください。くわしくはお問合せください。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
            <div className="text-foreground/80 space-y-2">
              <p><strong>共生・協働推進課ムトス推進係</strong></p>
              <p>〒395-0086 長野県飯田市東和町2丁目35番地</p>
              <p>丘の上結いスクエア2階　ムトスぷらざ</p>
              <p>Tel：0265-22-4560</p>
              <p>Fax：0265-22-1022</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
