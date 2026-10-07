import 'server-only'
import { getDb, showSeedData } from '@/lib/db'
import { MUNICIPIO_IDS, PERIODS, WINDOW_MONTHS, isAbuse, type MunicipioId } from '@/lib/domain'
import { addMonths, currentMonth, monthToDate, type MonthKey } from '@/lib/months'
import {
  buildObservatory,
  communityReference,
  scopeStats,
  type CaseRecord,
  type CommunityReference,
  type ObservatoryData,
} from '@/lib/stats'

type CaseRow = {
  municipio: MunicipioId
  month: string
  tipo: CaseRecord['tipo']
  source: CaseRecord['source']
  m2: number | null
  price: number
  prev_price: number | null
  abuses: string[]
}

/** Casos publicados desde `from` (incluido). Solo para cálculos: nunca se envían al cliente. */
async function loadCases(from: MonthKey): Promise<{ cases: CaseRecord[]; hasSeed: boolean }> {
  const db = await getDb()
  const rows = await db.query<CaseRow & { is_seed: boolean }>(
    `select municipio, to_char(month, 'YYYY-MM') as month, tipo, source, m2, price, prev_price, abuses, is_seed
       from cases
      where status = 'published' and month >= $1 and ($2 or not is_seed)`,
    [monthToDate(from), showSeedData()],
  )
  return {
    hasSeed: rows.some((r) => r.is_seed),
    cases: rows.map((r) => ({
      municipio: r.municipio,
      month: r.month,
      tipo: r.tipo,
      source: r.source,
      m2: r.m2,
      price: r.price,
      prevPrice: r.prev_price,
      abuses: r.abuses.filter(isAbuse),
    })),
  }
}

export async function getObservatoryData(): Promise<{ data: ObservatoryData; hasSeed: boolean }> {
  const latest = currentMonth()
  const from = addMonths(latest, -(PERIODS + WINDOW_MONTHS - 2))
  const { cases, hasSeed } = await loadCases(from)
  return { data: buildObservatory(cases, latest), hasSeed }
}

export type CommunityRefs = Record<MunicipioId, CommunityReference>

/** Referencias de la comunidad (últimos 6 meses) para el evaluador. */
export async function getCommunityRefs(): Promise<{ refs: CommunityRefs; hasSeed: boolean }> {
  const latest = currentMonth()
  const { cases, hasSeed } = await loadCases(addMonths(latest, -(PERIODS - 1)))
  const refs = Object.fromEntries(MUNICIPIO_IDS.map((m) => [m, communityReference(cases, latest, m)])) as CommunityRefs
  return { refs, hasSeed }
}

/** Casos del municipio en la ventana actual, o null si no llegan al mínimo (no se revela la cifra). */
export async function countInCurrentWindow(municipio: MunicipioId): Promise<number | null> {
  const latest = currentMonth()
  const { cases } = await loadCases(addMonths(latest, -(WINDOW_MONTHS - 1)))
  return scopeStats(cases, latest, municipio).n
}
