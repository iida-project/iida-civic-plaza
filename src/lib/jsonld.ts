const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const siteName = '飯田の市民活動ひろば'

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: '飯田市内のNPO・市民活動を可視化するWebサイト',
    inLanguage: 'ja',
  }
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  }
}

export function generateFAQPageJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateOrganizationJsonLd(org: {
  name: string
  description: string
  url: string
  image?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    description: org.description,
    url: org.url.startsWith('http') ? org.url : `${siteUrl}${org.url}`,
    ...(org.image && { image: org.image }),
  }
}

export function generateArticleJsonLd(article: {
  title: string
  description: string
  url: string
  image?: string | null
  publishedAt?: string | null
  modifiedAt?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url.startsWith('http') ? article.url : `${siteUrl}${article.url}`,
    ...(article.image && { image: article.image }),
    ...(article.publishedAt && { datePublished: article.publishedAt }),
    ...(article.modifiedAt && { dateModified: article.modifiedAt }),
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  }
}
