import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: '他団体主催の講座情報 | 飯田の市民活動ひろば',
  description:
    '市民公益活動講座のご案内。団体運営や仲間づくり、情報発信のコツが学べる講座です。',
}

export default function OtherCoursesPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            他団体主催の講座情報
          </h1>
          <p className="text-sm text-muted-foreground">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/r5-shiminkouekikouza.html"
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
              市民公益活動講座 — 地域で事業を生み出す講座
            </h2>
            <p>
              地域活動・市民活動の団体運営や仲間づくり、情報発信のコツが学べる講座を開催します。
            </p>
            <p>
              「仲間や資金をどう集めたらいいの？」「地域の困りごとを事業で解決したい」という方は、ぜひご参加ください！
            </p>
          </section>

          {/* 講座一覧 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">
              日時・テーマ（全4回）
            </h2>
            <p className="text-sm text-muted-foreground">希望する回のみの参加も可能です。</p>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">第1回：団体運営の基礎・活動の種類にあった組織づくり</h3>
              <p className="text-sm text-muted-foreground">令和6年1月16日（火）18:30〜20:30</p>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>組織の目的、賃金管理、他分野連携など</li>
                <li>NPO、一般社団法人、合同会社などの種類や特徴</li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">第2回：仲間を増やす戦略・資金調達方法</h3>
              <p className="text-sm text-muted-foreground">令和6年2月2日（金）18:30〜20:30</p>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>良いチームの作り方、仲間の増やし方</li>
                <li>補助金申請書の作り方、クラウドファンディングについて</li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">第3回：情報発信の知識</h3>
              <p className="text-sm text-muted-foreground">令和6年2月22日（木）18:30〜20:30</p>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>なぜ必要か、物語を作る、共感の広げ方</li>
                <li>発信方法の種類、SNSのコツ</li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="text-lg font-semibold">第4回：チラシの作り方</h3>
              <p className="text-sm text-muted-foreground">令和6年3月15日（金）18:30〜20:30</p>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>PRの対象と必要な情報、わかりやすいデザイン</li>
                <li>チラシ作成ソフトなど</li>
              </ul>
            </div>
          </section>

          {/* 会場・対象・定員 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">開催概要</h2>
            <dl className="text-foreground/80 space-y-3">
              <div>
                <dt className="font-semibold inline">会場：</dt>
                <dd className="inline">丘の上結いスクエア2階　ムトスぷらざ</dd>
              </div>
              <div>
                <dt className="font-semibold inline">対象：</dt>
                <dd className="inline">飯田・下伊那地域で地域活動を行う個人や団体、これから始めたい方</dd>
              </div>
              <div>
                <dt className="font-semibold inline">定員：</dt>
                <dd className="inline">各回20名</dd>
              </div>
              <div>
                <dt className="font-semibold inline">参加費：</dt>
                <dd className="inline">無料</dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">
              ※駐車場は西側駐車場（ファミリーマート東和町店隣）または市営駐車場（飯田駅西側・2時間無料）をご利用ください（地下駐車場は利用できません）。
            </p>
          </section>

          {/* 申し込み */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">申し込み方法</h2>
            <div className="text-foreground/80 space-y-3">
              <p>電話またはメールで、以下の情報をお知らせください。</p>
              <ul className="list-disc list-inside space-y-1">
                <li>希望する回</li>
                <li>氏名、電話番号、メールアドレス</li>
                <li>団体名（所属する場合）</li>
              </ul>
              <div className="mt-3 space-y-1">
                <p>Tel：0265-22-4560</p>
                <p>メール：danjo@city.iida.nagano.jp</p>
              </div>
              <p className="text-sm text-muted-foreground">申し込み締切：各回前日まで</p>
            </div>
          </section>

          {/* 講師 */}
          <section className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold">講師</h2>
            <div className="text-foreground/80 space-y-2">
              <p><strong>田辺 大（たなべ ゆたか）</strong></p>
              <p>飯田市男女共同参画推進コーディネーター</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>2003年以来、都内や地方の女性起業やNPO法人の支援に従事</li>
                <li>2023年春に飯田市に移住し、女性起業やソーシャルビジネスの支援を担当</li>
              </ul>
              <p className="text-sm text-muted-foreground">※回により、講師を変更する場合があります。</p>
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
