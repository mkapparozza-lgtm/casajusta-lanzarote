import { NextResponse } from 'next/server'
import { LIMITS, isLocale } from '@/lib/domain'
import { getDict, fill } from '@/lib/i18n'
import { currentMonth, monthLabel, monthToDate } from '@/lib/months'
import { donationsEnabled, getActiveGoal } from '@/lib/server/support'

// Crea una sesión de Stripe Checkout para una aportación puntual (mode=payment, nunca suscripción)
// imputada al objetivo activo. Desactivado mientras DONATIONS_ENABLED no sea true.
export async function POST(req: Request) {
  if (!donationsEnabled()) return NextResponse.json({ error: 'disabled' }, { status: 503 })

  let body: { amount?: unknown; lang?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  const amount = Number(body.amount)
  const lang = isLocale(body.lang) ? body.lang : 'es'
  if (!Number.isInteger(amount) || amount < LIMITS.donation.min || amount > LIMITS.donation.max)
    return NextResponse.json({ error: 'amount' }, { status: 400 })

  const goal = await getActiveGoal()
  if (!goal) return NextResponse.json({ error: 'no-goal' }, { status: 409 })

  const t = getDict(lang)
  const month = currentMonth()
  const title = fill(t.goals[goal.key].title, { month: monthLabel(month, 'es-ES') })
  const site = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, '')

  const params = new URLSearchParams({
    mode: 'payment',
    submit_type: 'donate',
    locale: lang,
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(amount * 100),
    'line_items[0][price_data][product_data][name]': `CasaJusta Lanzarote · ${title}`,
    'metadata[goal_id]': String(goal.id),
    'metadata[period]': monthToDate(month),
    success_url: `${site}/${lang}/observatorio?aporte=ok#apoya`,
    cancel_url: `${site}/${lang}/observatorio?aporte=cancel#apoya`,
  })

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })
  const data = (await res.json()) as { url?: string; error?: { message?: string } }
  if (!res.ok || !data.url) {
    console.error('stripe checkout', data.error?.message)
    return NextResponse.json({ error: 'stripe' }, { status: 502 })
  }
  return NextResponse.json({ url: data.url })
}
