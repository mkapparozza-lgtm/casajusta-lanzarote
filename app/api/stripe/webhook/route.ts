import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const TOLERANCE_SECONDS = 300

/** Verifica la cabecera Stripe-Signature (t=…, v1=…) con el secreto del webhook. */
function verify(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=') as [string, string]))
  const t = parts.t
  if (!t || Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_SECONDS) return false
  const expected = createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex')
  const sigs = header
    .split(',')
    .filter((p) => p.startsWith('v1='))
    .map((p) => p.slice(3))
  return sigs.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)))
}

type CheckoutSession = {
  id: string
  payment_status: string
  amount_total: number | null
  metadata?: { goal_id?: string; period?: string }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'disabled' }, { status: 503 })

  const payload = await req.text()
  if (!verify(payload, req.headers.get('stripe-signature'), secret))
    return NextResponse.json({ error: 'signature' }, { status: 400 })

  const event = JSON.parse(payload) as { type: string; data: { object: CheckoutSession } }
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const s = event.data.object
    const goalId = Number(s.metadata?.goal_id)
    const period = s.metadata?.period
    if (s.payment_status === 'paid' && s.amount_total && goalId && period && /^\d{4}-\d{2}-01$/.test(period)) {
      const db = await getDb()
      // provider_ref único: si Stripe reenvía el evento, no se duplica la aportación.
      await db.query(
        `insert into donations (goal_id, period, amount_cents, provider, provider_ref)
         values ($1, $2, $3, 'stripe', $4) on conflict (provider_ref) do nothing`,
        [goalId, period, Math.min(Math.max(s.amount_total, 100), 50000), s.id],
      )
    }
  }
  return NextResponse.json({ received: true })
}
