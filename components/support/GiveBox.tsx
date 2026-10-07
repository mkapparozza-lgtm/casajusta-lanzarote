'use client'

import { useState } from 'react'
import { LIMITS, type Locale } from '@/lib/domain'
import { eur } from '@/lib/format'
import { fill, type Dict } from '@/lib/i18n'

const PRESETS = [3, 5, 10] as const

type Props = { lang: Locale; t: Dict['support']; enabled: boolean; flash: 'ok' | 'cancel' | null }

/** Selección de importe y paso a Stripe Checkout. Solo aportaciones puntuales. */
export function GiveBox({ lang, t, enabled, flash }: Props) {
  const [amount, setAmount] = useState<number>(5)
  const [other, setOther] = useState(false)
  const [otherRaw, setOtherRaw] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const value = other ? Math.round(Number(otherRaw)) || 0 : amount
  const label = value ? fill(t.give, { amount: eur(value, lang) }) : t.giveNoAmount

  async function give() {
    if (!(value >= LIMITS.donation.min && value <= LIMITS.donation.max)) {
      setError(t.errAmount)
      return
    }
    setError(null)
    setBusy(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: value, lang }),
      })
      const data = (await res.json()) as { url?: string }
      if (!res.ok || !data.url) throw new Error('checkout')
      window.location.href = data.url
    } catch {
      setError(t.errCheckout)
      setBusy(false)
    }
  }

  return (
    <div className="give">
      <span className="give-l" id="give-label">
        {t.once}
      </span>
      <div className="amounts" role="group" aria-labelledby="give-label">
        {PRESETS.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={!other && amount === a}
            onClick={() => {
              setOther(false)
              setAmount(a)
            }}
          >
            {eur(a, lang)}
          </button>
        ))}
        <button type="button" aria-pressed={other} onClick={() => setOther(true)}>
          {t.other}
        </button>
      </div>
      {other && (
        <div className="other">
          <label className="give-l" htmlFor="otherAmt" style={{ marginTop: 6 }}>
            {t.otherLabel}
          </label>
          <input
            id="otherAmt"
            type="number"
            inputMode="numeric"
            min={LIMITS.donation.min}
            max={LIMITS.donation.max}
            placeholder="20"
            value={otherRaw}
            onChange={(e) => setOtherRaw(e.target.value)}
            autoFocus
          />
        </div>
      )}
      {enabled ? (
        <button className="btn btn-primary" type="button" onClick={give} disabled={busy}>
          {label}
        </button>
      ) : (
        <button className="btn btn-primary" type="button" disabled aria-describedby="give-soon">
          {t.soon}
        </button>
      )}
      <p className={`msg ${error ? 'err' : flash === 'ok' ? 'ok' : 'info'}`} role="status" aria-live="polite">
        {error ?? (flash === 'ok' ? t.thanks : flash === 'cancel' ? t.cancelled : '')}
      </p>
      <p className="note" id="give-soon">
        {enabled ? t.note : t.soonNote}
      </p>
    </div>
  )
}
