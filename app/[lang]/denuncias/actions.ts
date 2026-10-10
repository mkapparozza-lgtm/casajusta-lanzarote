'use server'

import { getDb } from '@/lib/db'
import { LIMITS, isAbuse, isLocale, isMunicipio, scrubText } from '@/lib/domain'
import { currentMonth, monthToDate } from '@/lib/months'
import { clientInfo, deviceHash, rateLimitAllows, recordSubmission, verifyTurnstile } from '@/lib/server/security'

export type ReportErrorCode = 'invalid' | 'length' | 'consent' | 'captcha' | 'rate' | 'server'
export type ReportResult = { ok: true } | { ok: false; error: ReportErrorCode } | null

/** Nuevo testimonio: SIEMPRE entra como 'pending'. Solo el admin puede publicarlo. */
export async function submitReport(_prev: ReportResult, form: FormData): Promise<ReportResult> {
  const municipio = form.get('municipio')
  const category = form.get('category')
  const lang = form.get('lang')
  if (!isMunicipio(municipio) || !isAbuse(category) || !isLocale(lang)) return { ok: false, error: 'invalid' }
  if (form.get('consent') !== 'yes') return { ok: false, error: 'consent' }

  const raw = form.get('body')
  const body = typeof raw === 'string' ? scrubText(raw, LIMITS.report.max) : ''
  if (body.length < LIMITS.report.min) return { ok: false, error: 'length' }

  const { ip, ua } = await clientInfo()
  const token = form.get('cf-turnstile-response')
  if (!(await verifyTurnstile(typeof token === 'string' ? token : null, ip))) return { ok: false, error: 'captcha' }

  try {
    const db = await getDb()
    const hash = deviceHash(ip, ua, 'report')
    if (!(await rateLimitAllows(db, hash))) return { ok: false, error: 'rate' }
    await db.query(
      `insert into reports (municipio, month, category, body, lang) values ($1, $2, $3, $4, $5)`,
      [municipio, monthToDate(currentMonth()), category, body, lang],
    )
    await recordSubmission(db, hash)
    return { ok: true }
  } catch (e) {
    console.error('submitReport', e)
    return { ok: false, error: 'server' }
  }
}

/** "A mí también me pasó": un apoyo por dispositivo y testimonio. Devuelve el total actualizado. */
export async function supportReport(id: number): Promise<{ ok: boolean; supports: number | null }> {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, supports: null }
  try {
    const { ip, ua } = await clientInfo()
    const db = await getDb()
    const inserted = await db.query(
      `insert into report_supports (report_id, device_hash)
       select id, $2 from reports where id = $1 and status = 'published'
       on conflict do nothing returning report_id`,
      [id, deviceHash(ip, ua, `support:${id}`)],
    )
    const [row] =
      inserted.length > 0
        ? await db.query<{ supports: number }>(
            `update reports set supports = supports + 1 where id = $1 returning supports`,
            [id],
          )
        : await db.query<{ supports: number }>(`select supports from reports where id = $1 and status = 'published'`, [id])
    return { ok: inserted.length > 0, supports: row?.supports ?? null }
  } catch (e) {
    console.error('supportReport', e)
    return { ok: false, supports: null }
  }
}
