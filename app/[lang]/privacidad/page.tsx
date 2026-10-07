import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { LegalPage } from '@/components/LegalPage'

export async function generateMetadata({ params }: PageProps<'/[lang]/privacidad'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return { title: getDict(lang).meta.privacyTitle, alternates: { canonical: `/${lang}/privacidad` } }
}

export default async function Privacidad({ params }: PageProps<'/[lang]/privacidad'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)
  return <LegalPage lang={lang} t={t} title={t.legal.privacyH1} sections={t.legal.privacy} />
}
