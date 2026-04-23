import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ムトス飯田賞 歴代受賞団体 | 飯田の市民活動ひろば',
  description:
    '昭和60年度から令和6年度までのムトス飯田賞 歴代受賞団体・個人をご紹介します。',
}

type AwardEntry = {
  initiative: string
  organization: string
  special?: string
}

type AwardRound = {
  round: number
  year: string
  entries: AwardEntry[]
}

const awardHistory: AwardRound[] = [
  {
    round: 1,
    year: '昭和60年度',
    entries: [
      { initiative: 'リンゴ並木を守り育てた', organization: '飯田東中学校学友会', special: '特別賞' },
      { initiative: '自然と街並み保存', organization: '大平宿をのこす会' },
      { initiative: '人形浄瑠璃の伝承', organization: '今田人形保存会' },
    ],
  },
  {
    round: 2,
    year: '昭和61年度',
    entries: [
      { initiative: '名泉を世に出した', organization: '猿庫の泉保存会' },
      { initiative: '商店街づくりに新風', organization: '知久町1丁目商栄会' },
    ],
  },
  {
    round: 3,
    year: '昭和62年度',
    entries: [
      { initiative: 'ふるさとを見直す絵本づくり', organization: '飯田中央農業協同組合' },
      { initiative: '伊那谷から競歩の日本一', organization: '酒井浩文さん' },
    ],
  },
  {
    round: 4,
    year: '昭和63年度',
    entries: [
      { initiative: '地域ぐるみで村おこし実践', organization: '柿野沢農家組合' },
      { initiative: '仲間と社会参加を目指す', organization: 'いずみの家' },
    ],
  },
  {
    round: 5,
    year: '平成元年度',
    entries: [
      { initiative: '地域をあげての自然保護', organization: 'ギフチョウ保護運動' },
      { initiative: '郷土史の裾野を広めた', organization: '伊那史学会' },
    ],
  },
  {
    round: 6,
    year: '平成2年度',
    entries: [
      { initiative: 'まちとの交流でむら興し', organization: '柏原農業を考える会' },
      { initiative: '飯田の観光と文化に貢献', organization: '元善光寺菊華会' },
    ],
  },
  {
    round: 7,
    year: '平成3年度',
    entries: [
      { initiative: '地域興しの先駆け', organization: '法山同志会' },
      { initiative: '舞台芸術の振興に貢献', organization: '飯田文化協会' },
    ],
  },
  {
    round: 8,
    year: '平成4年度',
    entries: [
      { initiative: '連綿と続く文庫活動', organization: '飯伊婦人文庫' },
      { initiative: '壮年団活動の先駆け', organization: '鼎壮年団' },
    ],
  },
  {
    round: 9,
    year: '平成5年度',
    entries: [
      { initiative: '高校生の社会参加活動', organization: '下伊那農業高校校友会' },
      { initiative: '地域に根ざした福祉活動', organization: 'ボランティアセンター「たんぽぽの家」' },
    ],
  },
  {
    round: 10,
    year: '平成6年度',
    entries: [
      { initiative: '豊かな自然を探求・再発見', organization: '伊那谷自然友の会' },
      { initiative: '新たなコミュニティづくり', organization: '下黒田東自治会' },
    ],
  },
  {
    round: 11,
    year: '平成7年度',
    entries: [
      { initiative: '旅を通して障害者と心の交流', organization: 'ひまわり号すいじんぐ倶楽部' },
      { initiative: 'ふる里の昔話を今に語り継ぐ', organization: '矢沢姈さん' },
    ],
  },
  {
    round: 12,
    year: '平成8年度',
    entries: [
      { initiative: '吹奏楽を通じて地域文化活動に貢献', organization: '飯田市民吹奏楽団' },
      { initiative: '市民のシンボル風越山の豊かな自然文化を継承', organization: '風越山を愛する会' },
    ],
  },
  {
    round: 13,
    year: '平成9年度',
    entries: [
      { initiative: '青少年の健全育成と音楽文化向上に貢献', organization: '飯田少年少女合唱団' },
      { initiative: '地区のシンボル"谷沢川"を守る', organization: '千代小学校児童会' },
    ],
  },
  {
    round: 14,
    year: '平成10年度',
    entries: [
      { initiative: '郷土を愛し、郷土の歴史を研究', organization: '松尾史学会' },
      { initiative: '飯田から全国へ、夢を現実へ', organization: 'R-Compass' },
    ],
  },
  {
    round: 15,
    year: '平成11年度',
    entries: [
      { initiative: '地域素材を活かした住民共通の話題づくり', organization: '伊賀良を広める会' },
      { initiative: '人形劇のまちづくりを支える', organization: '飯田青年会議所', special: '特別賞' },
      { initiative: '人形劇のまちづくりを支える', organization: '飯田市連合婦人会', special: '特別賞' },
    ],
  },
  {
    round: 16,
    year: '平成12年度',
    entries: [
      { initiative: '「顔の見える野菜販売」で地域の交流を図る', organization: '上飯田夕市グループ' },
      { initiative: '観光客との交流を通し飯田の良さを伝える', organization: '飯田観光ボランティアガイドの会' },
    ],
  },
  {
    round: 17,
    year: '平成13年度',
    entries: [
      { initiative: '視覚障害者に健常者と同じ読書環境を', organization: '朗読奉仕の会「声の輪」' },
      { initiative: '子どもたちに豊かな感受性とたくましい創造力を', organization: '飯田子ども劇場' },
    ],
  },
  {
    round: 18,
    year: '平成14年度',
    entries: [
      { initiative: '農をベースに、土を、地域を、心を耕す', organization: 'ひさかた風土舎' },
      { initiative: '古より受け継いだ伝統芸能を守り後継者を育成', organization: '黒田人形保存会' },
    ],
  },
  {
    round: 19,
    year: '平成15年度',
    entries: [
      { initiative: 'アマチュアリズムに徹した音楽活動でまちづくりに貢献', organization: '飯田交響楽団' },
      { initiative: 'そばを打ち、人を育み、地域に人財を輩出', organization: '信州飯田そば達人の会' },
    ],
  },
  {
    round: 20,
    year: '平成16年度',
    entries: [
      { initiative: '小さな図書館でやさしい心の子供を育てる', organization: '榧の木館' },
      { initiative: '世界に誇れる「モノづくり」を目指して将来の担い手を育成', organization: '科学工作教室推進研究会' },
      { initiative: '地域と共に成長する国際交流の場づくりに貢献', organization: 'Hand in Hand 和楽' },
    ],
  },
  {
    round: 21,
    year: '平成17年度',
    entries: [
      { initiative: '生涯現役の地域づくり', organization: '竜丘自由学校' },
      { initiative: '大自然の力と地域住民の力で里づくり', organization: '下栗里の会', special: '特別賞' },
      { initiative: 'みんなで創り・守り・活かす地域の宝', organization: '木沢地区活性化推進協議会', special: '特別賞' },
    ],
  },
  {
    round: 22,
    year: '平成18年度',
    entries: [
      { initiative: 'ひさかた和紙の復活と地域の宝としての保存継承', organization: 'ひさかた和紙保存会' },
      { initiative: '花と笑顔がいっぱいのまちづくり', organization: 'フローラル伊賀良' },
    ],
  },
  {
    round: 23,
    year: '平成19年度',
    entries: [
      { initiative: '"祭"の企画・開催による飯田の活性化', organization: '祭feelings of power実行委員会' },
      { initiative: '落語と大道芸による社会教育と演芸ボランティア活動', organization: '土曜笑学校' },
    ],
  },
  {
    round: 24,
    year: '平成20年度',
    entries: [
      { initiative: '秋葉街道を活かした交流による地域づくり', organization: '秋葉街道を愛する会' },
      { initiative: '杵原学校を拠り所にした地域活動で郷土愛を育む', organization: '杵原学校応援団' },
    ],
  },
  {
    round: 25,
    year: '平成21年度',
    entries: [
      { initiative: '「ふしぎの心」をいだかせ科学への興味関心を高める', organization: 'おもしろ科学工房' },
      { initiative: '魅力あふれる地域の活性化と環境づくりの振興を図る', organization: '麻績の里振興委員会' },
    ],
  },
  {
    round: 26,
    year: '平成22年度',
    entries: [
      { initiative: '安全で親しみやすい山づくりを目指して', organization: '遠山山の会' },
      { initiative: '「医と文化の融合」を目指して', organization: '医療法人栗山会飯田病院' },
    ],
  },
  {
    round: 27,
    year: '平成23年度',
    entries: [
      { initiative: '北方の古き伝承を後世に', organization: '北方古老に聞く会' },
      { initiative: 'みんなで支える福祉のまちづくり', organization: 'NPO法人 飯田ボランティア協会' },
    ],
  },
  {
    round: 28,
    year: '平成24年度',
    entries: [
      { initiative: '地域課題に対応した自発的な福祉サロンの運営', organization: 'みんなの家 ぬくぬく' },
      { initiative: '地域振興と環境を融合した幻想的まちづくりの広がり', organization: '南信州竹宵の会' },
    ],
  },
  {
    round: 29,
    year: '平成25年度',
    entries: [
      { initiative: '古老桜も彩り豊か、後世に引き継ぐ東野の心', organization: '大宮通り桜保存会' },
      { initiative: '化石燃料ゼロハウス「風の学舎」', organization: 'NPO法人いいだ自然エネルギーネット山法師' },
    ],
  },
  {
    round: 30,
    year: '平成26年度',
    entries: [
      { initiative: '伝統を継承し華やかな演舞で賑わいを', organization: '南信州獅子舞フェスティバル実行委員会' },
      { initiative: 'ヒーロー大活躍！専門性を活かし地域活動に貢献', organization: '長野県飯田OIDE長姫高等学校 高校戦隊テックレンジャー' },
      { initiative: 'PDCAサイクル普及、市民の環境意識向上に貢献', organization: '地域ぐるみ環境ISO研究会', special: '特別賞' },
      { initiative: '一歩、二歩、さんぽ、そして未来へ環境教育を推進', organization: 'NPO法人 南信州おひさま進歩', special: '特別賞' },
    ],
  },
  {
    round: 31,
    year: '平成27年度',
    entries: [
      { initiative: '「人心の美」を追求する女将たちの"おもてなし"', organization: '天龍峡昭和乙女の会' },
      { initiative: '敬愛と親しみを育む人々の広がり', organization: 'りんご並木に花を植える会' },
    ],
  },
  {
    round: 32,
    year: '平成28年度',
    entries: [
      { initiative: '高齢者と若者の協働による文化事業の推進', organization: '華齢なる音楽祭実行委員会' },
      { initiative: 'やりたいことをやりながら地域のために', organization: '夢くらぶ' },
    ],
  },
  {
    round: 33,
    year: '平成29年度',
    entries: [
      { initiative: '受け継がれ拡がる冒険活動', organization: 'わんぱく冒険隊' },
      { initiative: '地域のみんなで癒しの公園を目指して', organization: '下黒田東有志の会「繋」' },
    ],
  },
  {
    round: 34,
    year: '平成30年度',
    entries: [
      { initiative: '面白いことをしながら地域を盛り上げる', organization: '橋北面白倶楽部' },
    ],
  },
  {
    round: 35,
    year: '令和元年度',
    entries: [
      { initiative: '小さな集落の革新的な取り組み', organization: '小野子区' },
      { initiative: '音楽で元気を届け、歌と踊りを一緒に楽しむ', organization: 'もみじの会' },
    ],
  },
  {
    round: 36,
    year: '令和2年度',
    entries: [
      { initiative: '住む人が楽しく暮らす七和の里', organization: 'NPO法人七和の会' },
      { initiative: '子ども達の笑顔と未来のために', organization: 'あぐりの田んぼ学校' },
    ],
  },
  {
    round: 37,
    year: '令和3年度',
    entries: [
      { initiative: '子どもの農育・食育・居場所づくり', organization: 'はなぶさ村農園' },
      { initiative: '子どものみならず全ての人が集える居場所作り', organization: 'ハッピーハウス' },
      { initiative: '中心市街地の総合的かつ一体的なまちづくり', organization: '飯田市中心市街地活性化協会', special: '特別賞' },
    ],
  },
  {
    round: 38,
    year: '令和4年度',
    entries: [
      { initiative: '平和の種プロジェクト', organization: '平和の種プロジェクト実行委員会' },
      { initiative: 'りんごを介した児童養護施設の子どもたちとの交流', organization: 'アップルサンタ' },
    ],
  },
  {
    round: 39,
    year: '令和5年度',
    entries: [
      { initiative: '里山に自生する山野草の保護・育成を通じて輪を広げる', organization: '梅ヶ久保自然愛護会' },
      { initiative: '高校生×伝統工芸の輪で飯田に賑わいを創ろう！', organization: 'いいらぼ', special: '若者賞' },
    ],
  },
  {
    round: 40,
    year: '令和6年度',
    entries: [
      { initiative: '地域と人を繋げる竹林整備・竹資源活用', organization: 'NPO法人いなだに竹Links' },
      { initiative: '大人の笑顔は子供の笑顔、子どもの笑顔は飯田市の希望、日本の子育ては傾奇組から！！', organization: '南信州有志保育士連合 傾奇組' },
    ],
  },
]

export default function MutosAwardPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            ムトス飯田賞　歴代受賞団体
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            出典：
            <Link
              href="https://www.city.iida.lg.jp/soshiki/9/mutosu-jyusyou.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-apple-blue hover:underline inline-flex items-center gap-1"
            >
              飯田市ホームページ
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          {/* 概要 */}
          <section className="space-y-2 text-foreground/80 leading-relaxed">
            <p>
              ムトス飯田賞を受賞した歴代受賞団体・個人をご紹介します。
            </p>
            <p className="text-sm text-muted-foreground">
              令和7年1月現在　受賞団体数 84団体 2個人
            </p>
          </section>

          {/* 受賞者一覧テーブル */}
          <section>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-3 py-3 text-left whitespace-nowrap">回</th>
                    <th className="border border-border px-3 py-3 text-left whitespace-nowrap">年度</th>
                    <th className="border border-border px-3 py-3 text-left">取り組み</th>
                    <th className="border border-border px-3 py-3 text-left">団体等名</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80">
                  {awardHistory.map((round) =>
                    round.entries.map((entry, entryIdx) => (
                      <tr key={`${round.round}-${entryIdx}`} className={entryIdx === 0 ? 'border-t-2 border-t-border/60' : ''}>
                        {entryIdx === 0 && (
                          <>
                            <td className="border border-border px-3 py-2 align-top whitespace-nowrap font-semibold" rowSpan={round.entries.length}>
                              第{round.round}回
                            </td>
                            <td className="border border-border px-3 py-2 align-top whitespace-nowrap" rowSpan={round.entries.length}>
                              {round.year}
                            </td>
                          </>
                        )}
                        <td className="border border-border px-3 py-2">
                          {entry.initiative}
                        </td>
                        <td className="border border-border px-3 py-2">
                          {entry.organization}
                          {entry.special && (
                            <span className="ml-2 text-xs text-[#E05555] font-semibold">
                              《{entry.special}》
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
