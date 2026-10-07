import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { getCommunityRefs, getObservatoryData } from '@/lib/server/observatory'
import { getSupportData, supportSectionEnabled } from '@/lib/server/support'
import { SiteHeader } from '@/components/SiteHeader'
import { SeedBanner } from '@/components/SeedBanner'
import { EvalStateProvider } from '@/components/home/EvalState'
import { Evaluator } from '@/components/home/Evaluator'
import { Actions } from '@/components/home/Actions'
import { Observatory } from '@/components/observatory/Observatory'
import { CaseForm } from '@/components/observatory/CaseForm'
import { Support } from '@/components/support/Support'

// Home = observatorio (oct-2026): la página antigua con hero/estadísticas se sustituyó porque
// parecía igual al sitio viejo. Lee la base de datos en cada petición.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return { alternates: { canonical: `/${lang}`, languages: { es: '/es', it: '/it', en: '/en' } } }
}

export default async function Home({ params, searchParams }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const sp = await searchParams
  const flash = sp.aporte === 'ok' ? 'ok' : sp.aporte === 'cancel' ? 'cancel' : null

  // Al cliente solo llegan agregados ya filtrados por el umbral de 5 casos.
  // La sección de apoyo está apagada por defecto (SHOW_SUPPORT_SECTION): no se consulta ni se muestra.
  const showSupport = supportSectionEnabled()
  const [{ data, hasSeed }, { refs }, support] = await Promise.all([
    getObservatoryData(),
    getCommunityRefs(),
    showSupport ? getSupportData() : Promise.resolve(null),
  ])

  const ctx = [
    { h: t.ctx.c1h, p: t.ctx.c1p },
    { h: t.ctx.c2h, p: t.ctx.c2p },
    { h: t.ctx.c3h, p: t.ctx.c3p },
    { h: t.ctx.c4h, p: t.ctx.c4p },
    { h: t.ctx.c5h, p: t.ctx.c5p },
  ]
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
      <EvalStateProvider>
        <main id="main" className="wrap">
          <Observatory lang={lang} t={t} data={data} />

          {/* "Sí, añadir mi caso" rellena el formulario de abajo. */}
          <section className="block" id="evaluar" aria-label={t.ev.eyebrow}>
            <div className="evaluator">
              <div className="section-head">
                <div className="eyebrow">
                  <span className="shutter" aria-hidden="true" />
                  <span>{t.ev.eyebrow}</span>
                </div>
                <h2>{t.ev.h2}</h2>
                <p>{t.ev.p}</p>
                <p className="ev-anon">
                  <span className="shutter" style={{ width: 14, height: 9, background: 'var(--green)' }} aria-hidden="true" />
                  <span>{t.ev.anon}</span>
                </p>
              </div>
              <Evaluator lang={lang} t={t.ev} tipoNames={t.tipo} refs={refs} />
            </div>
          </section>

          <section className="block" id="caso" aria-labelledby="caso-h2">
            <h2 id="caso-h2">{t.form.h2}</h2>
            <p className="lead">{t.form.lead}</p>
            <CaseForm lang={lang} t={t.form} abuses={t.abuses} tipoNames={t.tipo} />
          </section>

          <section className="block" id="contexto" aria-labelledby="ctx-h2">
            <div className="context">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <div className="eyebrow">
                  <span className="shutter" aria-hidden="true" />
                  <span>{t.ctx.eyebrow}</span>
                </div>
                <h2 id="ctx-h2">{t.ctx.h2}</h2>
                <p>{t.ctx.p}</p>
              </div>
              <div>
                {ctx.map((c) => (
                  <div className="card context-card" key={c.h}>
                    <h3>
                      <span className="shutter" aria-hidden="true" />
                      <span>{c.h}</span>
                    </h3>
                    <p>{c.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="block" id="actuar" aria-labelledby="actuar-h2">
            <div className="section-head">
              <div className="eyebrow">
                <span className="shutter" aria-hidden="true" />
                <span>{t.actions.eyebrow}</span>
              </div>
              <p className="teaser-sentence">{t.hero.h1}</p>
              <h2 id="actuar-h2">{t.actions.h2}</h2>
              <p>{t.actions.p}</p>
            </div>
            <Actions lang={lang} t={t.actions} m={t.modal} />
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
      </EvalStateProvider>
    </>
  )
}
