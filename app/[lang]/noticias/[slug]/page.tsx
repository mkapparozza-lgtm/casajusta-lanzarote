import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LOCALES, isLocale } from '@/lib/domain'
import { shortDate } from '@/lib/format'
import { fill, getDict } from '@/lib/i18n'
import { ARTICLES, getArticle, type Block } from '@/lib/news'
import { OG_LOCALE, SITE_URL, languageAlternates } from '@/lib/site'
import { SiteHeader } from '@/components/SiteHeader'

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => ARTICLES.map((a) => ({ lang, slug: a.slug })))
}
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps<'/[lang]/noticias/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  const a = getArticle(slug)
  if (!isLocale(lang) || !a) return {}
  const x = a.i18n[lang]
  return {
    title: `${x.title} | CasaJusta`,
    description: x.description,
    alternates: { canonical: `/${lang}/noticias/${slug}`, languages: languageAlternates(`noticias/${slug}`) },
    openGraph: {
      type: 'article',
      siteName: 'CasaJusta Lanzarote',
      title: x.title,
      description: x.description,
      locale: OG_LOCALE[lang],
      publishedTime: a.date,
      modifiedTime: a.updated ?? a.date,
    },
    twitter: { card: 'summary_large_image', title: x.title, description: x.description },
  }
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'p':
      return <p>{b.text}</p>
    case 'h2':
      return <h2>{b.text}</h2>
    case 'ul':
      return (
        <ul>
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote>
          <p>«{b.text}»</p>
          <cite>{b.cite}</cite>
        </blockquote>
      )
    case 'note':
      return <p className="disclaimer">{b.text}</p>
  }
}

export default async function ArticlePage({ params }: PageProps<'/[lang]/noticias/[slug]'>) {
  const { lang, slug } = await params
  const a = getArticle(slug)
  if (!isLocale(lang) || !a) notFound()
  const t = getDict(lang)
  const x = a.i18n[lang]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: x.title,
    description: x.description,
    inLanguage: lang,
    datePublished: a.date,
    dateModified: a.updated ?? a.date,
    mainEntityOfPage: `${SITE_URL}/${lang}/noticias/${slug}`,
    image: `${SITE_URL}/${lang}/opengraph-image`,
    author: { '@type': 'Organization', name: 'CasaJusta Lanzarote', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'CasaJusta Lanzarote', url: SITE_URL },
    citation: a.sources.map((s) => s.url),
    spatialCoverage: { '@type': 'Place', name: 'Lanzarote' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader lang={lang} t={t.nav} cta={{ href: `/${lang}#caso`, label: t.nav.addCase }} />
      <main id="main" className="wrap">
        <article className="prose article">
          <p className="meta">
            <Link href={`/${lang}/noticias`}>← {t.news.back}</Link>
          </p>
          <h1>{x.title}</h1>
          <p className="meta">
            <time dateTime={a.date}>{fill(t.news.published, { date: shortDate(a.date, lang) })}</time>
            {a.updated && <> · {fill(t.news.updated, { date: shortDate(a.updated, lang) })}</>}
          </p>
          {x.body.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
          <section className="sources" aria-labelledby="sources-h2" style={{ padding: 0 }}>
            <h2 id="sources-h2">{t.news.sources}</h2>
            <ol>
              {a.sources.map((s) => (
                <li key={s.url}>
                  {s.name}: <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> ({s.date})
                </li>
              ))}
            </ol>
            <p className="meta">{t.news.disclaimer}</p>
          </section>
        </article>
      </main>
    </>
  )
}
