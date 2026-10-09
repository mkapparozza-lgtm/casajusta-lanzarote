import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/domain'
import { LEGAL_UPDATED, SITE_URL, languageAlternates } from '@/lib/site'

const PAGES: { path: string; priority: number; changeFrequency: 'daily' | 'yearly'; lastModified?: string }[] = [
  { path: '', priority: 1, changeFrequency: 'daily' },
  { path: 'privacidad', priority: 0.2, changeFrequency: 'yearly', lastModified: LEGAL_UPDATED },
  { path: 'aviso-legal', priority: 0.2, changeFrequency: 'yearly', lastModified: LEGAL_UPDATED },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => `${SITE_URL}${p}`
  return PAGES.flatMap((page) =>
    LOCALES.map((lang) => {
      const alternates = languageAlternates(page.path)
      return {
        url: abs(alternates[lang]!),
        lastModified: page.lastModified ? new Date(page.lastModified) : new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(Object.entries(alternates).map(([k, v]) => [k, abs(v)])),
        },
      }
    }),
  )
}
