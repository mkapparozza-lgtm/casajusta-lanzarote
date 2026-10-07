import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE = 'cj_admin'
const SESSION_HOURS = 8

function sessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

/** El panel solo existe si hay contraseña y secreto configurados. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && sessionSecret())
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !input) return false
  // Comparar hashes de igual longitud evita filtrar la longitud de la contraseña.
  const key = sessionSecret() ?? ''
  return safeEqual(sign(input, key), sign(expected, key))
}

export async function startSession(): Promise<void> {
  const key = sessionSecret()
  if (!key) throw new Error('Falta ADMIN_SESSION_SECRET')
  const expires = String(Date.now() + SESSION_HOURS * 3600_000)
  ;(await cookies()).set(COOKIE, `${expires}.${sign(expires, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  })
}

export async function endSession(): Promise<void> {
  ;(await cookies()).delete(COOKIE)
}

export async function isAdmin(): Promise<boolean> {
  const key = sessionSecret()
  if (!key || !process.env.ADMIN_PASSWORD) return false
  const value = (await cookies()).get(COOKIE)?.value
  if (!value) return false
  const [expires, mac] = value.split('.')
  if (!expires || !mac || Number(expires) < Date.now()) return false
  return safeEqual(mac, sign(expires, key))
}

/** Para Server Actions: lanza si no hay sesión de admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error('No autorizado')
}
