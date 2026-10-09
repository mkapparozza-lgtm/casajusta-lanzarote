// Frase titular del observatorio, generada a partir de los agregados (nunca de casos sueltos).

import {
  ABUSE_IDS,
  INTL_LOCALE,
  MUNICIPIO_IDS,
  WINDOW_MONTHS,
  municipioName,
  type AbuseId,
  type Locale,
  type MunicipioId,
} from './domain'
import { dec1, eur, pct } from './format'
import { OFFICIAL, OFFICIAL_YEAR } from './official'
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

/** Frase con el dato oficial de Hacienda (SERPAVI) cuando aún no hay 5 casos de la comunidad. */
function officialHeadline(dict: Dict, locale: Locale, scope: MunicipioId | null): string {
  const euro = (v: number) => `${dec1(v, locale)} €`
  if (scope) {
    const o = OFFICIAL[scope]
    return fill(dict.obs.sOfficialMuni, {
      year: OFFICIAL_YEAR,
      place: municipioName(scope),
      value: euro(o.eurM2),
      rent: eur(o.rent, locale),
    })
  }
  const sorted = MUNICIPIO_IDS.map((id) => ({ id, v: OFFICIAL[id].eurM2 })).sort((a, b) => a.v - b.v)
  const min = sorted[0]!
  const max = sorted[sorted.length - 1]!
  return fill(dict.obs.sOfficial, {
    year: OFFICIAL_YEAR,
    min: euro(min.v),
    minPlace: municipioName(min.id),
    max: euro(max.v),
    maxPlace: municipioName(max.id),
  })
}

export function headline(
  dict: Dict,
  locale: Locale,
  s: ScopeStats,
  end: MonthKey,
  place: string,
  scope: MunicipioId | null,
): string {
  const window = windowText(dict, locale, end)
  const Window = capitalize(window)
  if (s.n === null) return officialHeadline(dict, locale, scope)

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
