import 'server-only'
import { getDb, showSeedData } from '@/lib/db'
import { MUNICIPIO_IDS, isAbuse, isLocale, isMunicipio, type AbuseId, type Locale, type MunicipioId } from '@/lib/domain'

/** Lo único que llega al navegador de un testimonio publicado. */
export type PublicReport = {
  id: number
  municipio: MunicipioId
  month: string
  category: AbuseId
  body: string
  lang: Locale
  supports: number
}

export async function getPublishedReports(): Promise<{
  reports: PublicReport[]
  counts: Record<MunicipioId, number>
  hasSeed: boolean
}> {
  const db = await getDb()
  const rows = await db.query<{
    id: string | number
    municipio: string
    month: string
    category: string
    body: string
    lang: string
    supports: number
    is_seed: boolean
  }>(
    `select id, municipio, to_char(month, 'YYYY-MM') as month, category, body, lang, supports, is_seed
       from reports
      where status = 'published' and ($1 or not is_seed)
      order by published_at desc nulls last, id desc
      limit 300`,
    [showSeedData()],
  )
  const reports: PublicReport[] = []
  for (const r of rows) {
    if (!isMunicipio(r.municipio) || !isAbuse(r.category) || !isLocale(r.lang)) continue
    reports.push({
      id: Number(r.id),
      municipio: r.municipio,
      month: r.month,
      category: r.category,
      body: r.body,
      lang: r.lang,
      supports: r.supports,
    })
  }
  const counts = Object.fromEntries(MUNICIPIO_IDS.map((m) => [m, 0])) as Record<MunicipioId, number>
  for (const r of reports) counts[r.municipio]++
  return { reports, counts, hasSeed: rows.some((r) => r.is_seed) }
}
