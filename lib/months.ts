// Los meses se manejan como claves 'YYYY-MM'. Nunca se guarda ni se muestra el día.

export type MonthKey = string

export function monthKey(year: number, month1to12: number): MonthKey {
  return `${year}-${String(month1to12).padStart(2, '0')}`
}

export function parseMonth(key: MonthKey): { year: number; month: number } {
  const [y, m] = key.split('-').map(Number)
  if (!y || !m || m < 1 || m > 12) throw new Error(`Mes inválido: ${key}`)
  return { year: y, month: m }
}

export function addMonths(key: MonthKey, delta: number): MonthKey {
  const { year, month } = parseMonth(key)
  const idx = year * 12 + (month - 1) + delta
  return monthKey(Math.floor(idx / 12), (idx % 12) + 1)
}

/** Mes actual en la hora de Canarias. */
export function currentMonth(now: Date = new Date()): MonthKey {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Atlantic/Canary',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now)
  const y = Number(parts.find((p) => p.type === 'year')?.value)
  const m = Number(parts.find((p) => p.type === 'month')?.value)
  return monthKey(y, m)
}

/** Los `count` meses que terminan en `end`, del más antiguo al más reciente. */
export function monthsEndingAt(end: MonthKey, count: number): MonthKey[] {
  return Array.from({ length: count }, (_, i) => addMonths(end, i - count + 1))
}

/** Primer día del mes, en formato de fecha SQL. */
export function monthToDate(key: MonthKey): string {
  return `${key}-01`
}

export function dateToMonth(value: string | Date): MonthKey {
  if (value instanceof Date) return monthKey(value.getUTCFullYear(), value.getUTCMonth() + 1)
  return value.slice(0, 7)
}

export function monthLabel(key: MonthKey, intlLocale: string, style: 'long' | 'short' = 'long'): string {
  const { year, month } = parseMonth(key)
  return new Intl.DateTimeFormat(intlLocale, { month: style, timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 15)),
  )
}
