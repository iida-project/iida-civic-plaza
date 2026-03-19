import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const typeColors: Record<string, { from: string; to: string }> = {
  organization: { from: '#F4A7B9', to: '#F9C784' },
  interview: { from: '#A8D5A2', to: '#90C8E0' },
  grant: { from: '#F9C784', to: '#F4A7B9' },
  news: { from: '#90C8E0', to: '#A8D5A2' },
  default: { from: '#F4A7B9', to: '#90C8E0' },
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || '飯田の市民活動ひろば'
  const type = searchParams.get('type') || 'default'
  const colors = typeColors[type] || typeColors.default

  const fontData = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap'
  ).then((res) => res.text())

  const fontUrl = fontData.match(/src: url\((.+?)\)/)?.[1]
  let font: ArrayBuffer | undefined
  if (fontUrl) {
    font = await fetch(fontUrl).then((res) => res.arrayBuffer())
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${colors.from}40 0%, #FFFFFF 50%, ${colors.to}40 100%)`,
          padding: '60px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #F4A7B9, #F9C784, #A8D5A2, #90C8E0)',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <div
          style={{
            fontSize: title.length > 30 ? 40 : 52,
            fontWeight: 700,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: '1000px',
            fontFamily: font ? '"Noto Sans JP"' : 'sans-serif',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '40px',
            fontSize: 24,
            color: '#666',
            fontFamily: font ? '"Noto Sans JP"' : 'sans-serif',
          }}
        >
          飯田の市民活動ひろば
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #F4A7B9, #F9C784, #A8D5A2, #90C8E0)',
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(font && {
        fonts: [
          {
            name: 'Noto Sans JP',
            data: font,
            style: 'normal',
            weight: 700,
          },
        ],
      }),
    }
  )
}
