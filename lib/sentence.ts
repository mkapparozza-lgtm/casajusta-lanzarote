// Frase titular del observatorio, generada a partir de los agregados (nunca de casos sueltos).

import { ABUSE_IDS, INTL_LOCALE, WINDOW_MONTHS, type AbuseId, type Locale } from './domain'
import { dec1, pct } from './format'
import { capitalize, fill, type Dict } from './i18n'
import { addMonths, monthLabel, type MonthKey } from './months'
import type { ScopeStats } from './stats'

export function windowText(dict: Dict, locale: Locale, end: MonthKey): string {
  const intl = INTL_LOCALE[locale]
  return fill(dict.obs.window, {
    from: monthLabel(addMonths(end, -(WINDOW_MONTHS - 1)), intl),
    to: monthLabel(end, intl),
  })
}

export function topAbuse(s: ScopeStats): { id: AbuseId; share: number } | null {
  if (!s.n || !s.abuseCounts) return null
  let best: AbuseId | null = null
  for (const a of ABUSE_IDS) if (best === null || s.abuseCounts[a] > s.abuseCounts[best]) best = a
  return best ? { id: best, share: s.abuseCounts[best] / s.n } : null
}

export function headline(
  dict: Dict,
  locale: Locale,
  s: ScopeStats,
  end: MonthKey,
  place: string,
  isIsland: boolean,
): string {
  const window = windowText(dict, locale, end)
  const Window = capitalize(window)
  if (s.n === null) return isIsland ? fill(dict.obs.sEmpty, { window }) : fill(dict.obs.sFew, { place, window })

  const top = topAbuse(s)
  // Solo si al menos 1 de cada 10 casos lo señala.
  if (top && top.share >= 0.1) {
    return fill(dict.obs.sAbuse, {
      Window,
      x: Math.round(top.share * 10),
      place,
      phrase: dict.abuses[top.id].phrase,
    })
  }
  if (s.renewal) return fill(dict.obs.sRenewal, { Window, place, pct: pct(s.renewal.value) })
  if (s.paid) return fill(dict.obs.sMedian, { Window, place, value: `${dec1(s.paid.value, locale)} €` })
  return fill(dict.obs.sCount, { Window, place, n: s.n })
}
