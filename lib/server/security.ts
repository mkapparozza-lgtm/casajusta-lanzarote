import 'server-only'
import { createHmac } from 'node:crypto'
import { headers } from 'next/headers'
import type { Db } from '@/lib/db/core'

function secret(name: string): string {
  const v = process.env[name]
  if (v) return v
  if (process.env.NODE_ENV === 'production') throw new Error(`Falta ${name}`)
  return 'dev-only-not-secret'
}

export async function clientInfo(): Promise<{ ip: string; ua: string }> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  return { ip, ua: h.get('user-agent') ?? '' }
}

/** Hash HMAC no reversible del dispositivo. La IP nunca se guarda en claro. */
export function deviceHash(ip: string, ua: string): string {
  return createHmac('sha256', secret('DEVICE_HASH_SECRET')).update(`${ip}|${ua}`).digest('hex')
}

function rateLimitHours(): number {
  const n = Number(process.env.RATE_LIMIT_HOURS ?? 24)
  return Number.isFinite(n) && n >= 0 ? n : 24
}

/** true si el dispositivo puede enviar. Borra de paso los registros caducados. */
export async function rateLimitAllows(db: Db, hash: string): Promise<boolean> {
  const hours = rateLimitHours()
  if (hours === 0) return true
  await db.query(`delete from rate_limits where last_at < now() - make_interval(hours => $1)`, [hours])
  const rows = await db.query('select 1 from rate_limits where device_hash = $1', [hash])
  return rows.length === 0
}

export async function recordSubmission(db: Db, hash: string): Promise<void> {
  if (rateLimitHours() === 0) return
  await db.query(
    `insert into rate_limits (device_hash, last_at) values ($1, now())
     on conflict (device_hash) do update set last_at = excluded.last_at`,
    [hash],
  )
}

/** Verifica el token de Cloudflare Turnstile. Sin clave configurada: solo se permite en desarrollo. */
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const key = process.env.TURNSTILE_SECRET_KEY
  if (!key) return process.env.NODE_ENV !== 'production'
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: key, response: token, remoteip: ip }),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export type CandidateCase = {
  municipio: string
  tipo: string
  source: string
  m2: number | null
  price: number
}

/**
 * Detección de picos: si en las últimas 2 horas ya hay 2 o más casos casi iguales
 * (mismo municipio, tipo y origen, ±5 m², ±5 % de precio), o más de 40 casos en
 * total en la última hora, el nuevo caso va a la cola de revisión y no cuenta en
 * las estadísticas hasta que alguien lo apruebe.
 */
export async function looksLikeSpike(db: Db, c: CandidateCase): Promise<boolean> {
  const [similar] = await db.query<{ n: string | number }>(
    `select count(*) as n from cases
      where created_at > now() - interval '2 hours' and not is_seed
        and municipio = $1 and tipo = $2 and source = $3
        and abs(price - $4) <= $4 * 0.05
        and (($5::int is null and m2 is null) or abs(m2 - $5::int) <= 5)`,
    [c.municipio, c.tipo, c.source, c.price, c.m2],
  )
  if (Number(similar?.n ?? 0) >= 2) return true
  const [recent] = await db.query<{ n: string | number }>(
    `select count(*) as n from cases where created_at > now() - interval '1 hour' and not is_seed`,
  )
  return Number(recent?.n ?? 0) >= 40
}
