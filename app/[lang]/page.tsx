import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { headline } from '@/lib/sentence'
import { getCommunityRefs, getObservatoryData } from '@/lib/server/observatory'
import { SiteHeader } from '@/components/SiteHeader'
import { SeedBanner } from '@/components/SeedBanner'
import { EvalStateProvider } from '@/components/home/EvalState'
import { Evaluator } from '@/components/home/Evaluator'
import { Actions } from '@/components/home/Actions'
import { Figures } from '@/components/observatory/Figures'

// Lee la base de datos en cada petición.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return { alternates: { canonical: `/${lang}`, languages: { es: '/es', it: '/it', en: '/en' } } }
}

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  const [{ refs, hasSeed: refsSeed }, { data, hasSeed }] = await Promise.all([getCommunityRefs(), getObservatoryData()])
  const latest = data.periods[data.periods.length - 1]!
  const island = data.stats[latest]!.island

  const stats = [
    { n: '0', label: t.stats.s1 },
    { n: '7', label: t.stats.s2 },
    { n: '+30%', label: t.stats.s3 },
    { n: '1', label: t.stats.s4 },
  ]
  const steps = [
    { color: 'var(--blue)', h: t.how.s1h, p: t.how.s1p },
    { color: 'var(--yellow)', h: t.how.s2h, p: t.how.s2p },
    { color: 'var(--red)', h: t.how.s3h, p: t.how.s3p },
  ]
  const ctx = [
    { h: t.ctx.c1h, p: t.ctx.c1p },
    { h: t.ctx.c2h, p: t.ctx.c2p },
    { h: t.ctx.c3h, p: t.ctx.c3p },
    { h: t.ctx.c4h, p: t.ctx.c4p },
    { h: t.ctx.c5h, p: t.ctx.c5p },
  ]

  return (
    <>
      <SeedBanner show={hasSeed || refsSeed} text={t.seedBanner} />
      <SiteHeader lang={lang} t={t.nav} cta={{ href: `/${lang}#evaluar`, label: t.nav.cta }} />
      <EvalStateProvider>
        <main id="main">
          <section className="hero">
            <div className="wrap hero-grid">
              <div>
                <div className="eyebrow">
                  <span className="shutter" aria-hidden="true" />
                  <span>{t.hero.eyebrow}</span>
                </div>
                <h1>{t.hero.h1}</h1>
                <p className="lead">{t.hero.lead}</p>
                <div className="hero-actions">
                  <a href="#evaluar" className="btn btn-primary">
                    {t.hero.cta1}
                  </a>
                  <Link href={`/${lang}/observatorio`} className="btn">
                    {t.hero.cta2}
                  </Link>
                </div>
              </div>
              <div className="facade" aria-hidden="true">
                {['b', 'o', 'y', 'o', 'o', 'c', 'o', 'b', 'y', 'o', 'o', 'b'].map((c, i) => (
                  <div key={i} className={`window ${c}`} />
                ))}
              </div>
            </div>
          </section>

          <section className="stats-strip" aria-label="Datos clave">
            <div className="wrap stats-grid">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="stat-num">{s.n}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="como-funciona">
            <div className="wrap">
              <div className="section-head">
                <div className="eyebrow">
                  <span className="shutter" aria-hidden="true" />
                  <span>{t.how.eyebrow}</span>
                </div>
                <h2>{t.how.h2}</h2>
                <p>{t.how.p}</p>
              </div>
              <div className="steps">
                {steps.map((s) => (
                  <div className="card" key={s.h}>
                    <span className="shutter" style={{ background: s.color }} aria-hidden="true" />
                    <h3>{s.h}</h3>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="evaluar">
            <div className="wrap">
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
            </div>
          </section>

          <section id="contexto">
            <div className="wrap context">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <div className="eyebrow">
                  <span className="shutter" aria-hidden="true" />
                  <span>{t.ctx.eyebrow}</span>
                </div>
                <h2>{t.ctx.h2}</h2>
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

          <section id="observatorio">
            <div className="wrap">
              <div className="section-head">
                <div className="eyebrow">
                  <span className="shutter" aria-hidden="true" />
                  <span>{t.teaser.eyebrow}</span>
                </div>
                <h2>{t.teaser.h2}</h2>
                <p>{t.teaser.p}</p>
              </div>
              <div className="teaser">
                <p className="teaser-sentence">{headline(t, lang, island, latest, t.obs.islandPlace, true)}</p>
                <Figures s={island} t={t.obs} lang={lang} />
                <div className="teaser-actions">
                  <Link href={`/${lang}/observatorio`} className="btn btn-primary">
                    {t.teaser.cta}
                  </Link>
                  <Link href={`/${lang}/observatorio#caso`} className="btn">
                    {t.teaser.add}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section id="actuar">
            <div className="wrap">
              <div className="section-head">
                <div className="eyebrow">
                  <span className="shutter" aria-hidden="true" />
                  <span>{t.actions.eyebrow}</span>
                </div>
                <h2>{t.actions.h2}</h2>
                <p>{t.actions.p}</p>
              </div>
              <Actions lang={lang} t={t.actions} m={t.modal} />
            </div>
          </section>
        </main>
      </EvalStateProvider>
    </>
  )
}
