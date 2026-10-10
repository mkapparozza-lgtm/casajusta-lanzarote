import Link from 'next/link'
import type { Locale } from '@/lib/domain'
import type { Dict } from '@/lib/i18n'
import { CanaryFlag } from './CanaryFlag'
import { CookieSettingsLink } from './CookieConsent'

export function SiteFooter({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <div className="brand">
            <CanaryFlag />
            <span className="brand-name">
              CasaJusta <span>Lanzarote</span>
            </span>
          </div>
          <nav className="foot-links" aria-label="Legal">
            <Link href={`/${lang}/denuncias`}>{t.nav.denuncias}</Link>
            <Link href={`/${lang}/noticias`}>{t.nav.noticias}</Link>
            <Link href={`/${lang}/privacidad`}>{t.footer.privacy}</Link>
            <Link href={`/${lang}/aviso-legal`}>{t.footer.legal}</Link>
            <CookieSettingsLink label={t.footer.cookies} />
          </nav>
        </div>
        <p className="foot-note">
          <strong>{t.footer.project}</strong> {t.footer.donations}
          <br />
          {t.footer.disclaimer}
        </p>
      </div>
    </footer>
  )
}
