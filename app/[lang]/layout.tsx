import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { LOCALES, isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { OG_LOCALE, SITE_URL } from '@/lib/site'
import { SiteFooter } from '@/components/SiteFooter'
import '../globals.css'

// Fuentes por <link> (como el sitio original): next/font/google falla en el build de Turbopack 16.4 en esta ruta.
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap'

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.desc,
    applicationName: 'CasaJusta Lanzarote',
    openGraph: {
      type: 'website',
      siteName: 'CasaJusta Lanzarote',
      title: t.meta.title,
      description: t.meta.desc,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: 'summary_large_image', title: t.meta.title, description: t.meta.desc },
    formatDetection: { telephone: false, email: false, address: false },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#14130f' },
  ],
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <a className="skip" href="#main">
          {t.nav.skip}
        </a>
        {children}
        <SiteFooter lang={lang} t={t} />
      </body>
    </html>
  )
}
