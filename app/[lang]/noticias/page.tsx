import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { ARTICLES } from '@/lib/news'
import { languageAlternates, pageOpenGraph } from '@/lib/site'
import { SiteHeader } from '@/components/SiteHeader'
import { NewsList } from '@/components/news/NewsList'

export async function generateMetadata({ params }: PageProps<'/[lang]/noticias'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return {
    title: t.news.metaTitle,
    description: t.news.metaDesc,
    alternates: { canonical: `/${lang}/noticias`, languages: languageAlternates('noticias') },
    openGraph: pageOpenGraph(lang, 'noticias', t.news.metaTitle, t.news.metaDesc),
  }
}

export default async function NoticiasPage({ params }: PageProps<'/[lang]/noticias'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return (
    <>
      <SiteHeader lang={lang} t={t.nav} cta={{ href: `/${lang}#caso`, label: t.nav.addCase }} />
      <main id="main" className="wrap">
        <div className="prose" style={{ paddingBottom: 0 }}>
          <h1>{t.news.h1}</h1>
          <p>{t.news.lead}</p>
        </div>
        <NewsList lang={lang} t={t.news} articles={ARTICLES} />
      </main>
    </>
  )
}
