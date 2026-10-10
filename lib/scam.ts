// Comprobador de anuncios: pura y sin datos personales. Se ejecuta en el navegador; nada se guarda ni se envía.
// Señales basadas en los consejos públicos de la Policía Nacional, la Guardia Civil e INCIBE.

import type { MunicipioId, Tipo } from './domain'
import { OFFICIAL } from './official'

/** Slug del artículo-guía sobre anuncios falsos (lib/news/articles/anuncio-falso.ts). */
export const SCAM_GUIDE_SLUG = 'anuncio-falso-alquiler-lanzarote-como-detectarlo'

export const SCAM_QUESTIONS = ['payBefore', 'away', 'payMethod', 'photos', 'rush', 'video', 'docs', 'noContract'] as const
export type ScamQuestion = (typeof SCAM_QUESTIONS)[number]
export type ScamFlag = ScamQuestion | 'cheap'
export type Answer = 'yes' | 'no' | 'unsure'

/** Peso de cada señal: 3 = típica de estafa por sí sola, 1 = sospechosa. */
const WEIGHT: Record<ScamFlag, number> = {
  payBefore: 3,
  away: 3,
  payMethod: 3,
  photos: 3,
  rush: 1,
  video: 1,
  docs: 1,
  noContract: 1,
  cheap: 1,
}

export type PriceInput = { municipio: MunicipioId; tipo: Tipo; m2: number | null; price: number }

export type PriceCheck =
  | { kind: 'cheap'; ref: number }
  | { kind: 'roomHigh' }
  | { kind: 'normal' }

/**
 * Precio sospechosamente bajo: vivienda por debajo del 75% de la mediana de Hacienda del municipio
 * (que ya es un mínimo, porque incluye contratos antiguos); habitación por debajo de 250 €.
 */
export function checkPrice(p: PriceInput): PriceCheck | null {
  if (!(p.price > 0)) return null
  if (p.tipo === 'habitacion') {
    if (p.price < 250) return { kind: 'cheap', ref: 509 }
    if (p.price >= 450) return { kind: 'roomHigh' }
    return { kind: 'normal' }
  }
  if (!p.m2 || p.m2 < 15) return null
  const ref = Math.round(OFFICIAL[p.municipio].eurM2 * p.m2)
  return p.price < ref * 0.75 ? { kind: 'cheap', ref } : { kind: 'normal' }
}

export type Assessment = { risk: 'high' | 'medium' | 'low'; flags: ScamFlag[]; score: number; price: PriceCheck | null }

export function assessListing(answers: Partial<Record<ScamQuestion, Answer>>, price?: PriceInput): Assessment {
  const flags: ScamFlag[] = []
  let score = 0
  for (const q of SCAM_QUESTIONS) {
    const a = answers[q]
    if (a === 'yes') {
      flags.push(q)
      score += WEIGHT[q]
    } else if (a === 'unsure' && WEIGHT[q] >= 3) {
      // No saber si te piden dinero antes de visitar ya merece atención.
      score += 1
    }
  }
  const pc = price ? checkPrice(price) : null
  if (pc?.kind === 'cheap') {
    flags.push('cheap')
    score += WEIGHT.cheap
  }
  const risk = score >= 3 ? 'high' : score >= 1 ? 'medium' : 'low'
  return { risk, flags, score, price: pc }
}
