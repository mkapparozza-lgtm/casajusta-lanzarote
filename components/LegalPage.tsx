import type { Locale } from '@/lib/domain'
import { shortDate } from '@/lib/format'
import { fill, type Dict } from '@/lib/i18n'
import { LEGAL_HOLDER, LEGAL_UPDATED } from '@/lib/site'
import { SiteHeader } from './SiteHeader'

type Section = { h: string; p: string[] }

export function LegalPage({ lang, t, title, sections }: { lang: Locale; t: Dict; title: string; sections: Section[] }) {
  const pending = `[${t.legal.pending}]`
  const vars = {
    holder: LEGAL_HOLDER.name ?? pending,
    nif: LEGAL_HOLDER.nif ?? pending,
    address: LEGAL_HOLDER.address ?? pending,
    email: LEGAL_HOLDER.email ?? pending,
  }
  return (
    <>
      <SiteHeader lang={lang} t={t.nav} cta={{ href: `/${lang}#evaluar`, label: t.nav.cta }} />
      <main id="main" className="wrap">
        <article className="prose">
          <h1>{title}</h1>
          <p className="meta">{fill(t.legal.updated, { date: shortDate(LEGAL_UPDATED, lang) })}</p>
          {t.legal.translationNote && <p className="meta">{t.legal.translationNote}</p>}
          {sections.map((s) => (
            <section key={s.h} style={{ padding: 0 }}>
              <h2>{s.h}</h2>
              {s.p.map((p, i) => (
                <p key={i}>{fill(p, vars)}</p>
              ))}
            </section>
          ))}
          <p className="disclaimer">{t.footer.disclaimer}</p>
        </article>
      </main>
    </>
  )
}
