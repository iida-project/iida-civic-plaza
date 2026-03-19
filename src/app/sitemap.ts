import { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase/public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const supabase = createPublicClient()

  const [
    { data: organizations },
    { data: interviews },
    { data: grants },
    { data: newsPosts },
  ] = await Promise.all([
    supabase
      .from('organizations')
      .select('slug, updated_at')
      .eq('is_published', true),
    supabase
      .from('interviews')
      .select('slug, updated_at')
      .eq('is_published', true),
    supabase
      .from('grants')
      .select('slug, updated_at')
      .eq('is_published', true),
    supabase
      .from('news_posts')
      .select('slug, updated_at')
      .eq('is_published', true),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/activities`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/interviews`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/grants`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/news`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/faq`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const orgPages: MetadataRoute.Sitemap = (organizations || []).map((org) => ({
    url: `${siteUrl}/activities/${org.slug}`,
    lastModified: new Date(org.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const interviewPages: MetadataRoute.Sitemap = (interviews || []).map((item) => ({
    url: `${siteUrl}/interviews/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const grantPages: MetadataRoute.Sitemap = (grants || []).map((item) => ({
    url: `${siteUrl}/grants/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const newsPages: MetadataRoute.Sitemap = (newsPosts || []).map((item) => ({
    url: `${siteUrl}/news/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...orgPages, ...interviewPages, ...grantPages, ...newsPages]
}
