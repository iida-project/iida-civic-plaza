import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// 要約レベルの設定
const summaryConfig = {
  short: {
    label: 'さくっと',
    limit: '150文字以内（絶対に200文字を超えない）',
    description: '30秒で読める短い要約',
    lineBreakRule: '改行は入れず、1つの段落で書いてください',
  },
  medium: {
    label: 'ほどよく',
    limit: '400文字以内（絶対に500文字を超えない）',
    description: '1分で読める中程度の要約',
    lineBreakRule: '話題が変わる箇所で空行（2回改行）を入れて、2段落に分けてください。段落間には必ず空行を入れてください',
  },
  long: {
    label: 'じっくり',
    limit: '800文字以内（絶対に1000文字を超えない）',
    description: '3分で読める詳しい要約',
    lineBreakRule: '話題ごとに空行（2回改行）を入れて、2〜3段落に分けて読みやすくしてください。段落間には必ず空行を入れてください',
  },
} as const

export type SummaryLevel = keyof typeof summaryConfig

/**
 * 単一レベルの要約を生成する
 */
export async function generateSingleSummary(
  articleBody: string,
  level: SummaryLevel
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
  const plainText = articleBody.replace(/<[^>]*>/g, '').trim()
  const config = summaryConfig[level]

  const prompt = `あなたは記事の要約を作成するアシスタントです。
以下のインタビュー記事を「${config.label}」レベルで要約してください。

【重要なルール】
- 親しみやすく読みやすい文章で書いてください
- 箇条書きや見出しは使わず、普通の文章で書いてください
- HTMLタグは使わないでください
- 記事の核心となるメッセージや想いを大切にしてください

【文字数制限 ※厳守】
${config.limit}
※文字数は必ず守ってください。長すぎる場合は内容を削って調整してください。

【改行・段落分け ※重要】
${config.lineBreakRule}

【出力形式】
要約文のみを出力してください。余計な前置きや説明は不要です。

【記事本文】
${plainText}`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error(`Gemini API error (${level}):`, error)
    throw new Error(`AI要約（${config.label}）の生成に失敗しました`)
  }
}

/**
 * 記事を3つのレベルで要約する
 */
export async function generateSummaries(articleBody: string): Promise<{
  short: string
  medium: string
  long: string
}> {
  // gemini-2.5-flash-lite: 無料枠あり（RPM: 10, TPM: 250K, RPD: 20）
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

  // HTMLタグを除去してプレーンテキストに変換
  const plainText = articleBody.replace(/<[^>]*>/g, '').trim()

  const prompt = `あなたは記事の要約を作成するアシスタントです。
以下のインタビュー記事を3つの異なる長さで要約してください。

【重要なルール】
- 親しみやすく読みやすい文章で書いてください
- 箇条書きや見出しは使わず、普通の文章で書いてください
- HTMLタグは使わないでください
- 各要約は独立して読めるようにしてください
- 記事の核心となるメッセージや想いを大切にしてください

【文字数制限 ※厳守】
- さくっと：150文字以内（絶対に200文字を超えない）
- ほどよく：400文字以内（絶対に500文字を超えない）
- じっくり：800文字以内（絶対に1000文字を超えない）

※文字数は必ず守ってください。長すぎる場合は内容を削って調整してください。

【改行・段落分け ※重要】
- さくっと：改行は入れず、1つの段落で書いてください
- ほどよく：話題が変わる箇所で空行（2回改行）を入れて、2段落に分けてください。段落間には必ず空行を入れてください
- じっくり：話題ごとに空行（2回改行）を入れて、2〜3段落に分けて読みやすくしてください。段落間には必ず空行を入れてください

【出力形式】
以下の形式で出力してください。区切り文字は必ず守ってください。

===さくっと===
（ここに短い要約）
===ほどよく===
（ここに中程度の要約）
===じっくり===
（ここに長めの要約）
===終わり===

【記事本文】
${plainText}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // レスポンスをパース
    const shortMatch = response.match(/===さくっと===\s*([\s\S]*?)===ほどよく===/)
    const mediumMatch = response.match(/===ほどよく===\s*([\s\S]*?)===じっくり===/)
    const longMatch = response.match(/===じっくり===\s*([\s\S]*?)===終わり===/)

    return {
      short: shortMatch?.[1]?.trim() || '',
      medium: mediumMatch?.[1]?.trim() || '',
      long: longMatch?.[1]?.trim() || '',
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('AI要約の生成に失敗しました')
  }
}
