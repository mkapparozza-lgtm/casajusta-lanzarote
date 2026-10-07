import { INTL_LOCALE, type Locale } from './domain'

export function eur(n: number, locale: Locale): string {
  return `${Math.round(n).toLocaleString(INTL_LOCALE[locale])} €`
}

export function eurCents(cents: number, locale: Locale): string {
  const v = cents / 100
  const opts = Number.isInteger(v) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  return `${v.toLocaleString(INTL_LOCALE[locale], opts)} €`
}

export function dec1(n: number, locale: Locale): string {
  return n.toLocaleString(INTL_LOCALE[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function perM2(n: number, locale: Locale): string {
  return `${dec1(n, locale)} €/m²`
}

/** +12 % */
export function signedPct(x: number): string {
  const v = Math.round(x * 100)
  return `${v >= 0 ? '+' : '−'}${Math.abs(v)} %`
}

export function pct(x: number): string {
  return `${Math.round(x * 100)} %`
}

export function shortDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m) return iso
  const date = new Date(Date.UTC(y, m - 1, d || 1))
  return d
    ? new Intl.DateTimeFormat(INTL_LOCALE[locale], { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date)
    : new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}
