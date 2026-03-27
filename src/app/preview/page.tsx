import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'ムトス飯田 - まもなく公開',
  description: '飯田市の市民活動を応援するWebサイト「ムトスの市民活動ひろば」がまもなくオープンします。',
  robots: { index: true, follow: true },
}

export default function ComingSoonPreviewPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(244,167,185,0.2) 0%, rgba(249,199,132,0.15) 25%, rgba(168,213,162,0.15) 60%, rgba(144,200,224,0.2) 100%)',
      }}
    >
      {/* 背景の装飾円 */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-apple-red/10 blur-3xl" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] rounded-full bg-apple-blue/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-apple-green/5 blur-3xl" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* ロゴ */}
        <div className="mb-8">
          <Image
            src="/images/logo.png"
            alt="ムトス飯田ロゴ"
            width={80}
            height={100}
            className="h-24 w-auto mx-auto"
            priority
          />
        </div>

        {/* タイトル */}
        <h1 className="font-heading font-extrabold text-[36px] sm:text-[48px] lg:text-[56px] mb-6 leading-[1.3]">
          <span style={{ color: '#F4A7B9', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(244,167,185,0.4)' }}>ム</span>
          <span style={{ color: '#A8D5A2', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(168,213,162,0.4)' }}>ト</span>
          <span style={{ color: '#90C8E0', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(144,200,224,0.4)' }}>ス</span>
          <span style={{ color: '#F9C784', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(249,199,132,0.4)' }}>の</span>
          <br />
          <span style={{ color: '#90C8E0', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(144,200,224,0.4)' }}>市</span>
          <span style={{ color: '#F4A7B9', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(244,167,185,0.4)' }}>民</span>
          <span style={{ color: '#F9C784', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(249,199,132,0.4)' }}>活</span>
          <span style={{ color: '#A8D5A2', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(168,213,162,0.4)' }}>動</span>
          <span style={{ color: '#F4A7B9', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(244,167,185,0.4)' }}>ひ</span>
          <span style={{ color: '#90C8E0', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(144,200,224,0.4)' }}>ろ</span>
          <span style={{ color: '#F4A7B9', textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 3px 10px rgba(244,167,185,0.4)' }}>ば</span>
        </h1>

        {/* サブタイトル */}
        <p className="font-body text-lg sm:text-xl text-muted-foreground mb-4 leading-relaxed">
          飯田市の市民活動を応援するWebサイト
        </p>

        {/* Coming Soon */}
        <div className="mb-10">
          <span className="inline-block px-8 py-3 rounded-full text-xl sm:text-2xl font-heading font-bold text-white animate-pulse-soft tracking-wider"
            style={{ background: 'linear-gradient(90deg, #F4A7B9, #F9C784, #A8D5A2, #90C8E0)' }}
          >
            Coming Soon
          </span>
        </div>

        {/* 説明 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-white/80 mb-8">
          <p className="font-body text-foreground/80 leading-relaxed text-sm sm:text-base">
            NPO・ボランティア・市民活動団体の紹介や、
            <br className="hidden sm:block" />
            助成金情報、活動レポートなどを発信するプラットフォームです。
            <br className="hidden sm:block" />
            サイトの準備が整い次第、公開いたします。
          </p>
        </div>

        {/* 4色ライン */}
        <div className="flex justify-center gap-2">
          <span className="w-12 h-1 rounded-full bg-apple-red" />
          <span className="w-12 h-1 rounded-full bg-apple-orange" />
          <span className="w-12 h-1 rounded-full bg-apple-green" />
          <span className="w-12 h-1 rounded-full bg-apple-blue" />
        </div>
      </div>
    </div>
  )
}
