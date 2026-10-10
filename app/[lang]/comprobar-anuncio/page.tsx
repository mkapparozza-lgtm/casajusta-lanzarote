import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { OG_LOCALE, languageAlternates } from '@/lib/site'
import { SiteHeader } from '@/components/SiteHeader'
import { ScamChecker } from '@/components/scam/ScamChecker'
import { SCAM_GUIDE_SLUG } from '@/lib/scam'

export async function generateMetadata({ params }: PageProps<'/[lang]/comprobar-anuncio'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  const ogTitle = `⚠️ ${t.scam.ogTitle} ${t.scam.ogSub}`
  return {
    title: t.scam.metaTitle,
    description: t.scam.metaDesc,
    alternates: { canonical: `/${lang}/comprobar-anuncio`, languages: languageAlternates('comprobar-anuncio') },
    // Lo que se ve al compartir el enlace en Facebook o WhatsApp.
    openGraph: {
      type: 'website',
      siteName: 'CasaJusta Lanzarote',
      title: ogTitle,
      description: t.scam.metaDesc,
      url: `/${lang}/comprobar-anuncio`,
      locale: OG_LOCALE[lang],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description: t.scam.metaDesc },
  }
}

export default async function ComprobarAnuncioPage({ params }: PageProps<'/[lang]/comprobar-anuncio'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return (
    <>
      <SiteHeader lang={lang} t={t.nav} cta={{ href: `/${lang}/denuncias#contar`, label: t.reports.formH2 }} />
      <main id="main" className="wrap">
        <section className="obs-hero" style={{ paddingBottom: 16 }}>
          <p className="obs-kicker">
            <span className="mark" style={{ background: 'var(--red)' }} aria-hidden="true" />
            {t.nav.estafa}
          </p>
          <h1 style={{ minHeight: 0 }}>{t.scam.h1}</h1>
          <p className="lead" style={{ color: 'var(--muted)', maxWidth: '64ch', marginTop: 14 }}>
            {t.scam.lead}
          </p>
        </section>
        <ScamChecker lang={lang} t={t.scam} tipoNames={t.tipo} guideSlug={SCAM_GUIDE_SLUG} />
      </main>
    </>
  )
}
