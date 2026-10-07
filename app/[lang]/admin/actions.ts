'use server'

import { refresh } from 'next/cache'
import { getDb } from '@/lib/db'
import { checkPassword, endSession, requireAdmin, startSession } from '@/lib/server/admin-auth'
import { currentMonth, monthToDate } from '@/lib/months'

// Pequeño freno a la fuerza bruta: espera fija antes de responder a un intento fallido.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function login(_prev: string | null, form: FormData): Promise<string | null> {
  const ok = checkPassword(String(form.get('password') ?? ''))
  if (!ok) {
    await sleep(1500)
    return 'Contraseña incorrecta.'
  }
  await startSession()
  return null
}

export async function logout(): Promise<void> {
  await endSession()
}

const STATUSES = ['published', 'review', 'discarded'] as const

export async function setCaseStatus(form: FormData): Promise<void> {
  await requireAdmin()
  const id = Number(form.get('id'))
  const status = form.get('status')
  if (!Number.isInteger(id) || !STATUSES.includes(status as (typeof STATUSES)[number])) return
  const db = await getDb()
  await db.query('update cases set status = $1 where id = $2', [status, id])
  refresh()
}

export async function toggleVerified(form: FormData): Promise<void> {
  await requireAdmin()
  const id = Number(form.get('id'))
  if (!Number.isInteger(id)) return
  const db = await getDb()
  await db.query('update cases set verified = not verified where id = $1', [id])
  refresh()
}

/** Borrado definitivo, solo para casos ya descartados. */
export async function deleteCase(form: FormData): Promise<void> {
  await requireAdmin()
  const id = Number(form.get('id'))
  if (!Number.isInteger(id)) return
  const db = await getDb()
  await db.query(`delete from cases where id = $1 and status = 'discarded'`, [id])
  refresh()
}

function euroToCents(v: FormDataEntryValue | null): number | null {
  const n = Number(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) ? Math.round(n * 100) : null
}

export async function updateGoalTarget(form: FormData): Promise<void> {
  await requireAdmin()
  const id = Number(form.get('id'))
  const cents = euroToCents(form.get('target'))
  if (!Number.isInteger(id) || !cents || cents <= 0) return
  const db = await getDb()
  await db.query('update goals set target_cents = $1 where id = $2', [cents, id])
  refresh()
}

export async function addLedgerEntry(form: FormData): Promise<void> {
  await requireAdmin()
  const date = String(form.get('date') ?? '')
  const concept = String(form.get('concept') ?? '').trim()
  const cents = euroToCents(form.get('amount'))
  const kind = form.get('kind')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || concept.length < 3 || concept.length > 200 || !cents) return
  const signed = kind === 'out' ? -Math.abs(cents) : Math.abs(cents)
  const db = await getDb()
  await db.query('insert into ledger_entries (entry_date, concept, amount_cents) values ($1, $2, $3)', [date, concept, signed])
  refresh()
}

export async function deleteLedgerEntry(form: FormData): Promise<void> {
  await requireAdmin()
  const id = Number(form.get('id'))
  if (!Number.isInteger(id)) return
  const db = await getDb()
  await db.query('delete from ledger_entries where id = $1', [id])
  refresh()
}

/** Aportación recibida fuera de la web (p. ej. transferencia o efectivo en una asamblea). */
export async function addManualDonation(form: FormData): Promise<void> {
  await requireAdmin()
  const goalId = Number(form.get('goal'))
  const cents = euroToCents(form.get('amount'))
  if (!Number.isInteger(goalId) || !cents || cents < 100 || cents > 50000) return
  const db = await getDb()
  await db.query(
    `insert into donations (goal_id, period, amount_cents, provider) values ($1, $2, $3, 'manual')`,
    [goalId, monthToDate(currentMonth()), cents],
  )
  refresh()
}
