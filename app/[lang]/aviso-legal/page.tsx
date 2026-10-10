import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { languageAlternates, pageOpenGraph } from '@/lib/site'
import { LegalPage } from '@/components/LegalPage'

export async function generateMetadata({ params }: PageProps<'/[lang]/aviso-legal'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDict(lang)
  return {
    title: t.meta.legalTitle,
    alternates: { canonical: `/${lang}/aviso-legal`, languages: languageAlternates('aviso-legal') },
    openGraph: pageOpenGraph(lang, 'aviso-legal', t.meta.legalTitle, t.meta.desc),
  }
}

export default async function AvisoLegal({ params }: PageProps<'/[lang]/aviso-legal'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return <LegalPage lang={lang} t={t} title={t.legal.legalH1} sections={t.legal.legalSections} />
}
