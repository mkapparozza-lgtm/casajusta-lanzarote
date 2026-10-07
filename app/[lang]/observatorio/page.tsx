import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { getObservatoryData } from '@/lib/server/observatory'
import { getSupportData, supportSectionEnabled } from '@/lib/server/support'
import { SiteHeader } from '@/components/SiteHeader'
import { SeedBanner } from '@/components/SeedBanner'
import { Observatory } from '@/components/observatory/Observatory'
import { CaseForm } from '@/components/observatory/CaseForm'
import { Support } from '@/components/support/Support'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[lang]/observatorio'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return {
    title: t.meta.obsTitle,
    description: t.meta.obsDesc,
    alternates: {
      canonical: `/${lang}/observatorio`,
      languages: { es: '/es/observatorio', it: '/it/observatorio', en: '/en/observatorio' },
    },
  }
}

export default async function ObservatorioPage({ params, searchParams }: PageProps<'/[lang]/observatorio'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const sp = await searchParams
  const flash = sp.aporte === 'ok' ? 'ok' : sp.aporte === 'cancel' ? 'cancel' : null

  // Al cliente solo llegan agregados ya filtrados por el umbral de 5 casos.
  // La sección de apoyo está apagada por defecto (SHOW_SUPPORT_SECTION): no se consulta ni se muestra.
  const showSupport = supportSectionEnabled()
  const [{ data, hasSeed }, support] = await Promise.all([
    getObservatoryData(),
    showSupport ? getSupportData() : Promise.resolve(null),
  ])

  const method = [
    [t.method.m1h, t.method.m1p],
    [t.method.m2h, t.method.m2p],
    [t.method.m3h, t.method.m3p],
    [t.method.m4h, t.method.m4p],
    [t.method.m5h, t.method.m5p],
    [t.method.m6h, t.method.m6p],
  ]

  return (
    <>
      <SeedBanner show={hasSeed || Boolean(support?.hasSeed)} text={t.seedBanner} />
      <SiteHeader
        lang={lang}
        t={t.nav}
        cta={support ? { href: '#apoya', label: t.nav.apoya } : { href: '#caso', label: t.nav.addCase }}
      />
      <main id="main" className="wrap">
        <Observatory lang={lang} t={t} data={data} />

        <section className="block" id="caso" aria-labelledby="caso-h2">
          <h2 id="caso-h2">{t.form.h2}</h2>
          <p className="lead">{t.form.lead}</p>
          <CaseForm lang={lang} t={t.form} abuses={t.abuses} tipoNames={t.tipo} />
        </section>

        {support && <Support lang={lang} t={t} data={support} flash={flash} />}

        <section className="block" aria-labelledby="method-h2">
          <h2 id="method-h2">{t.method.h2}</h2>
          <div className="method">
            {method.map(([h, p]) => (
              <div key={h}>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <p className="disclaimer">{t.obs.disclaimer}</p>
        </section>
      </main>
    </>
  )
}
