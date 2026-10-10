import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isAbuse, isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { getPublishedReports } from '@/lib/server/reports'
import { languageAlternates, pageOpenGraph } from '@/lib/site'
import { SiteHeader } from '@/components/SiteHeader'
import { SeedBanner } from '@/components/SeedBanner'
import { Reports } from '@/components/reports/Reports'

// Lee la base de datos en cada petición (testimonios recién aprobados).
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[lang]/denuncias'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return {
    title: t.reports.metaTitle,
    description: t.reports.metaDesc,
    alternates: { canonical: `/${lang}/denuncias`, languages: languageAlternates('denuncias') },
    openGraph: pageOpenGraph(lang, 'denuncias', t.reports.metaTitle, t.reports.metaDesc),
  }
}

export default async function DenunciasPage({ params, searchParams }: PageProps<'/[lang]/denuncias'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const sp = await searchParams
  // ?tipo=anuncio llega desde el comprobador de anuncios: preselecciona la categoría del formulario.
  const defaultCategory = isAbuse(sp.tipo) ? sp.tipo : undefined
  const { reports, counts, hasSeed } = await getPublishedReports()
  return (
    <>
      <SeedBanner show={hasSeed} text={t.seedBanner} />
      <SiteHeader lang={lang} t={t.nav} cta={{ href: '#contar', label: t.reports.formH2 }} />
      <main id="main" className="wrap">
        <section className="obs-hero" style={{ paddingBottom: 24 }}>
          <p className="obs-kicker">
            <span className="mark" style={{ background: 'var(--red)' }} aria-hidden="true" />
            {t.nav.denuncias}
          </p>
          <h1 style={{ minHeight: 0 }}>{t.reports.h1}</h1>
          <p className="lead" style={{ color: 'var(--muted)', maxWidth: '62ch', marginTop: 14 }}>
            {t.reports.lead}
          </p>
        </section>
        <Reports
          lang={lang}
          t={t.reports}
          abuses={t.abuses}
          reports={reports}
          counts={counts}
          defaultCategory={defaultCategory}
        />
      </main>
    </>
  )
}
