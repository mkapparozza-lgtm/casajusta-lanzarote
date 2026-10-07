'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, type Locale } from '@/lib/domain'
import type { Dict } from '@/lib/i18n'
import { CanaryFlag } from './CanaryFlag'

type Props = {
  lang: Locale
  t: Dict['nav']
  /** CTA de la derecha: en la home lleva al evaluador, en el observatorio a los objetivos. */
  cta: { href: string; label: string }
}

export function SiteHeader({ lang, t, cta }: Props) {
  const pathname = usePathname()
  const rest = pathname.split('/').slice(2).join('/')

  function setLangCookie(l: Locale) {
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href={`/${lang}`} className="brand" aria-label={t.home}>
          <CanaryFlag />
          <span className="brand-name">
            CasaJusta <span>Lanzarote</span>
          </span>
        </Link>
        <nav className="links" aria-label="Principal">
          <Link href={`/${lang}#mapa`}>{t.observatorio}</Link>
          <Link href={`/${lang}#evaluar`}>{t.evaluar}</Link>
          <Link href={`/${lang}#contexto`}>{t.contexto}</Link>
          <Link href={`/${lang}#actuar`}>{t.actuar}</Link>
        </nav>
        <div className="nav-right">
          <nav className="lang-switch" aria-label={t.lang}>
            {LOCALES.map((l) => (
              <a
                key={l}
                href={`/${l}${rest ? `/${rest}` : ''}`}
                hrefLang={l}
                lang={l}
                aria-current={l === lang ? 'true' : undefined}
                onClick={() => setLangCookie(l)}
              >
                {l.toUpperCase()}
              </a>
            ))}
          </nav>
          <Link href={cta.href} className="btn btn-primary">
            {cta.label}
          </Link>
        </div>
      </div>
    </header>
  )
}
