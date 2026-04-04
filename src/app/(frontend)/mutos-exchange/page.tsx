import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ムトス飯田学習交流会 | 飯田の市民活動ひろば',
  description:
    '市民活動団体の学習交流会「地域の活動を知ろう！語ろう！ムトス飯田学習交流会」のご案内です。',
}

export default function MutosExchangePage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス飯田学習交流会／各種講座
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/r7kouryukai.html"
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
              地域の活動を知ろう！語ろう！
            </p>
            <p>
              ムトス飯田推進委員会（会長 飯田市長 佐藤 健）では、毎年、市民活動団体の学習交流会を行っています。
            </p>
            <p>
              活動発表を聞いたり、グループワークで話し合ったり、フリーの交流タイムなど、出会いや発見の場です。
              出会いの中で、より良い活動のためのヒントが得られるかもしれません。
              どなたでも参加できますので、ぜひお出かけください。
            </p>
          </section>

          {/* 日時・会場 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">日時・会場</h2>
            <div className="text-foreground/80 space-y-3">
              <div>
                <p><strong>日時：</strong>令和8年3月15日（日）13時30分〜17時（受付13時から）</p>
              </div>
              <div>
                <p><strong>会場：</strong>丘の上結いスクエア　ムトスぷらざ2階</p>
              </div>
            </div>
          </section>

          {/* 駐車場 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">駐車場</h2>
            <p className="text-sm text-muted-foreground">
              ※当日、丘の上結いスクエアは他の施設利用者の方も多いため、地下駐車場・西駐車場（ファミリーマート東和町店横）のご利用はできません。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-4 py-3 text-left">駐車場</th>
                    <th className="border border-border px-4 py-3 text-left">料金</th>
                    <th className="border border-border px-4 py-3 text-left">備考</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80">
                  <tr>
                    <td className="border border-border px-4 py-3 font-semibold">飯田病院第2駐車場</td>
                    <td className="border border-border px-4 py-3">無料</td>
                    <td className="border border-border px-4 py-3">
                      病院西側の道路（大通り）を挟んだ駐車場。病院側への駐車はご遠慮ください。段上の奥側から詰めて駐車をお願いします。
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-3 font-semibold">飯田駅駐車場</td>
                    <td className="border border-border px-4 py-3">2時間無料</td>
                    <td className="border border-border px-4 py-3">
                      他の飯田市営駐車場もご利用ください。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 参加方法 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">参加方法</h2>
            <p className="text-foreground/80">以下のいずれかでお申し込みください。</p>
            <ol className="list-decimal list-inside text-foreground/80 space-y-2">
              <li>申し込みフォームから回答</li>
              <li>
                チラシ裏面用紙をFaxまたは窓口へ提出
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                  <li>Fax：0265-22-1022</li>
                  <li>窓口：丘の上結いスクエア2階窓口 または 各地区自治振興センター窓口（平日8:30〜17:15）</li>
                </ul>
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              申し込み期限：令和8年3月3日（火）※期間延長あり
            </p>
          </section>

          {/* プログラム内容 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">プログラム</h2>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">13:30〜　ムトス飯田賞 表彰式・活動発表</h3>
              <p className="text-foreground/80">
                市民活動表彰「ムトス飯田賞」の表彰式と、受賞団体による活動発表を行います。
              </p>
              <p className="text-sm">
                <Link href="/mutos-award" className="text-apple-blue hover:underline">
                  「ムトス飯田賞」くわしくはこちら
                </Link>
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">14:30〜　グループワーク</h3>
              <p className="text-foreground/80">
                興味のあるテーマで分かれ、情報交換を行います。
                活動の工夫や悩みを話したり、聞いたり。これから何か始めてみたい人も発見があるかもしれません！
              </p>
              <div className="mt-3">
                <p className="font-semibold text-sm mb-2">テーマ</p>
                <ul className="grid sm:grid-cols-2 gap-2 text-foreground/80 text-sm">
                  <li className="bg-muted/50 rounded-lg px-4 py-2">A. 文化芸術の発信</li>
                  <li className="bg-muted/50 rounded-lg px-4 py-2">B. 地域資源でまちづくり</li>
                  <li className="bg-muted/50 rounded-lg px-4 py-2">C. 交流を生むイベント</li>
                  <li className="bg-muted/50 rounded-lg px-4 py-2">D. 防災とまちづくり</li>
                  <li className="bg-muted/50 rounded-lg px-4 py-2">E. 地域のたまり場づくり</li>
                  <li className="bg-muted/50 rounded-lg px-4 py-2">F. 後継者を育て、伝える</li>
                </ul>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">16:15〜　フリー交流タイム（物販やPRも可）</h3>
              <p className="text-foreground/80">
                参加者同士、お茶とお菓子で自由におしゃべりできます。
                環境に配慮して、マイカップ・マイボトルをお持ちください。
              </p>
              <div className="mt-2">
                <p className="font-semibold text-sm mb-1">活動PRコーナー</p>
                <p className="text-foreground/80 text-sm">
                  チラシや展示したいものなど、市民活動のPRなら何でも持ち込みができます。（メンバー募集、イベントPRなど）
                </p>
              </div>
            </div>
          </section>

          {/* お問い合わせ */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
            <div className="text-foreground/80 space-y-2">
              <p><strong>共生・協働推進課代表</strong></p>
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
