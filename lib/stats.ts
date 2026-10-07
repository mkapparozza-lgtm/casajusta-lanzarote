// Cálculos del observatorio. Funciones puras: se ejecutan solo en el servidor
// y el cliente recibe únicamente el resultado ya filtrado por el umbral.

import {
  ABUSE_IDS,
  MAX_EUR_M2,
  MIN_CASES,
  MIN_EUR_M2,
  MUNICIPIO_IDS,
  PERIODS,
  WINDOW_MONTHS,
  type AbuseId,
  type MunicipioId,
  type Source,
  type Tipo,
} from './domain'
import { addMonths, monthsEndingAt, type MonthKey } from './months'

export type CaseRecord = {
  municipio: MunicipioId
  month: MonthKey
  tipo: Tipo
  source: Source
  m2: number | null
  price: number
  prevPrice: number | null
  abuses: AbuseId[]
}

/** Mediana; null si no hay valores. */
export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null
  const a = [...values].sort((x, y) => x - y)
  const mid = Math.floor(a.length / 2)
  return a.length % 2 === 1 ? a[mid]! : (a[mid - 1]! + a[mid]!) / 2
}

/** €/m² de una vivienda completa; null para habitaciones o sin superficie. */
export function eurPerM2(c: CaseRecord): number | null {
  if (c.tipo !== 'vivienda' || !c.m2) return null
  return c.price / c.m2
}

/** Un caso con €/m² fuera de escala se descarta entero: suele ser un error o un intento de manipulación. */
export function isPlausible(c: CaseRecord): boolean {
  const v = eurPerM2(c)
  return v === null || (v >= MIN_EUR_M2 && v <= MAX_EUR_M2)
}

/** Subida al renovar: precio / precio anterior − 1. Solo contratos con precio anterior menor. */
export function renewalIncrease(c: CaseRecord): number | null {
  if (c.source !== 'pagado' || c.prevPrice === null || c.prevPrice <= 0 || c.prevPrice >= c.price) return null
  return c.price / c.prevPrice - 1
}

/** ¿Cae `month` en la ventana de `size` meses que termina en `end` (incluido)? */
export function inWindow(month: MonthKey, end: MonthKey, size: number = WINDOW_MONTHS): boolean {
  return month <= end && month >= addMonths(end, -(size - 1))
}

export type Metric = { value: number; n: number } | null

/** Solo se publica si hay al menos MIN_CASES valores detrás. */
export function thresholdMedian(values: readonly number[]): Metric {
  if (values.length < MIN_CASES) return null
  return { value: median(values)!, n: values.length }
}

export type ScopeStats = {
  /** Casos en el ámbito y la ventana; null si son menos de MIN_CASES. */
  n: number | null
  paid: Metric
  asked: Metric
  renewal: Metric
  /** Fracción de casos con al menos un abuso. */
  abuseShare: number | null
  /** Casos por tipo de abuso. */
  abuseCounts: Record<AbuseId, number> | null
}

export const EMPTY_STATS: ScopeStats = {
  n: null,
  paid: null,
  asked: null,
  renewal: null,
  abuseShare: null,
  abuseCounts: null,
}

export function scopeStats(
  cases: readonly CaseRecord[],
  end: MonthKey,
  scope: MunicipioId | null,
  windowSize: number = WINDOW_MONTHS,
): ScopeStats {
  const cs = cases.filter(
    (c) => inWindow(c.month, end, windowSize) && (scope === null || c.municipio === scope) && isPlausible(c),
  )
  if (cs.length < MIN_CASES) return EMPTY_STATS

  const paid: number[] = []
  const asked: number[] = []
  const renewals: number[] = []
  const abuseCounts = Object.fromEntries(ABUSE_IDS.map((a) => [a, 0])) as Record<AbuseId, number>
  let withAbuse = 0

  for (const c of cs) {
    const v = eurPerM2(c)
    if (v !== null) (c.source === 'pagado' ? paid : asked).push(v)
    const r = renewalIncrease(c)
    if (r !== null) renewals.push(r)
    const unique = new Set(c.abuses)
    if (unique.size > 0) withAbuse++
    for (const a of unique) abuseCounts[a]++
  }

  return {
    n: cs.length,
    paid: thresholdMedian(paid),
    asked: thresholdMedian(asked),
    renewal: thresholdMedian(renewals),
    abuseShare: withAbuse / cs.length,
    abuseCounts,
  }
}

export type ScopeKey = 'island' | MunicipioId

export type ObservatoryData = {
  /** Meses finales seleccionables, del más antiguo al más reciente. */
  periods: MonthKey[]
  stats: Record<MonthKey, Record<ScopeKey, ScopeStats>>
}

export function buildObservatory(cases: readonly CaseRecord[], latest: MonthKey): ObservatoryData {
  const periods = monthsEndingAt(latest, PERIODS)
  const stats: ObservatoryData['stats'] = {}
  for (const end of periods) {
    const byScope = { island: scopeStats(cases, end, null) } as Record<ScopeKey, ScopeStats>
    for (const m of MUNICIPIO_IDS) byScope[m] = scopeStats(cases, end, m)
    stats[end] = byScope
  }
  return { periods, stats }
}

export type CommunityReference = {
  /** Mediana de €/m² pagado en vivienda completa. */
  vivienda: Metric
  /** Mediana del precio pagado por habitación. */
  habitacion: Metric
}

/** Referencia de la comunidad para el evaluador: contratos de los últimos 6 meses del municipio. */
export function communityReference(
  cases: readonly CaseRecord[],
  latest: MonthKey,
  municipio: MunicipioId,
  months: number = PERIODS,
): CommunityReference {
  const cs = cases.filter(
    (c) => c.municipio === municipio && c.source === 'pagado' && inWindow(c.month, latest, months) && isPlausible(c),
  )
  const perM2 = cs.map(eurPerM2).filter((v): v is number => v !== null)
  const rooms = cs.filter((c) => c.tipo === 'habitacion').map((c) => c.price)
  return { vivienda: thresholdMedian(perM2), habitacion: thresholdMedian(rooms) }
}
