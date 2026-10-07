'use server'

import { refresh } from 'next/cache'
import { getDb } from '@/lib/db'
import { LIMITS, MAX_EUR_M2, MIN_EUR_M2, isAbuse, isMunicipio, scrubOtherText, type MunicipioId } from '@/lib/domain'
import { currentMonth, monthToDate } from '@/lib/months'
import { countInCurrentWindow } from '@/lib/server/observatory'
import {
  clientInfo,
  deviceHash,
  looksLikeSpike,
  rateLimitAllows,
  recordSubmission,
  verifyTurnstile,
} from '@/lib/server/security'

export type CaseErrorCode = 'm2' | 'price' | 'prev' | 'ratio' | 'other' | 'invalid' | 'captcha' | 'rate' | 'server'

export type CaseResult =
  | { ok: true; municipio: MunicipioId; count: number | null }
  | { ok: false; error: CaseErrorCode }
  | null

function int(v: FormDataEntryValue | null): number | null {
  if (typeof v !== 'string' || v.trim() === '') return null
  const n = Number(v)
  return Number.isInteger(n) ? n : NaN
}

export async function submitCase(_prev: CaseResult, form: FormData): Promise<CaseResult> {
  // ---- validación (el cliente valida lo mismo, pero aquí es lo que cuenta) ----
  const municipio = form.get('municipio')
  const tipo = form.get('tipo')
  const source = form.get('source')
  if (!isMunicipio(municipio) || (tipo !== 'vivienda' && tipo !== 'habitacion') || (source !== 'pagado' && source !== 'pedido'))
    return { ok: false, error: 'invalid' }

  const m2 = int(form.get('m2'))
  const price = int(form.get('price'))
  const prevRaw = int(form.get('prev'))
  const prev = source === 'pagado' ? prevRaw : null

  if (tipo === 'vivienda' && (m2 === null || Number.isNaN(m2) || m2 < LIMITS.m2.min || m2 > LIMITS.m2.max))
    return { ok: false, error: 'm2' }
  if (tipo === 'habitacion' && m2 !== null && (Number.isNaN(m2) || m2 < LIMITS.m2.min || m2 > LIMITS.m2.max))
    return { ok: false, error: 'm2' }
  if (price === null || Number.isNaN(price) || price < LIMITS.price.min || price > LIMITS.price.max)
    return { ok: false, error: 'price' }
  if (prev !== null && (Number.isNaN(prev) || prev < LIMITS.price.min || prev >= price)) return { ok: false, error: 'prev' }
  if (tipo === 'vivienda' && m2 && (price / m2 < MIN_EUR_M2 || price / m2 > MAX_EUR_M2)) return { ok: false, error: 'ratio' }

  const abuses = [...new Set(form.getAll('abuses'))]
  if (!abuses.every(isAbuse)) return { ok: false, error: 'invalid' }

  // Texto de "Otro": solo si está marcado; se limpia de emails/teléfonos/enlaces y nunca se publica.
  let otherText: string | null = null
  if (abuses.includes('otro')) {
    const raw = form.get('other')
    otherText = typeof raw === 'string' ? scrubOtherText(raw) : ''
    if (otherText.length < LIMITS.otherText.min) return { ok: false, error: 'other' }
  }

  // ---- anti-manipulación ----
  const { ip, ua } = await clientInfo()
  const token = form.get('cf-turnstile-response')
  if (!(await verifyTurnstile(typeof token === 'string' ? token : null, ip))) return { ok: false, error: 'captcha' }

  try {
    const db = await getDb()
    const hash = deviceHash(ip, ua)
    if (!(await rateLimitAllows(db, hash))) return { ok: false, error: 'rate' }

    const candidate = { municipio, tipo, source, m2: tipo === 'vivienda' ? m2 : m2 ?? null, price }
    const status = (await looksLikeSpike(db, candidate)) ? 'review' : 'published'

    await db.query(
      `insert into cases (municipio, month, tipo, source, m2, price, prev_price, abuses, other_text, status)
       values ($1, $2, $3, $4, $5, $6, $7, $8::text[], $9, $10)`,
      [municipio, monthToDate(currentMonth()), tipo, source, candidate.m2, price, prev, abuses, otherText, status],
    )
    await recordSubmission(db, hash)

    // El mensaje no revela si el caso ha ido a revisión.
    const count = await countInCurrentWindow(municipio)
    refresh()
    return { ok: true, municipio, count }
  } catch (e) {
    console.error('submitCase', e)
    return { ok: false, error: 'server' }
  }
}
