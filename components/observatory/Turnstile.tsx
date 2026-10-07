'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/domain'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`)
  return new Promise((resolve, reject) => {
    const s = existing ?? document.createElement('script')
    s.addEventListener('load', () => resolve())
    s.addEventListener('error', () => reject(new Error('turnstile')))
    if (!existing) {
      s.src = SCRIPT
      s.async = true
      document.head.appendChild(s)
    }
  })
}

/**
 * Widget de Cloudflare Turnstile. Dentro de un <form> añade el campo oculto
 * `cf-turnstile-response`. Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY no se pinta nada
 * (el servidor solo lo acepta así en desarrollo).
 */
export function Turnstile({ lang, resetKey }: { lang: Locale; resetKey: number }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const el = useRef<HTMLDivElement>(null)
  const id = useRef<string | null>(null)

  useEffect(() => {
    if (!siteKey || !el.current) return
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !el.current || !window.turnstile) return
        id.current = window.turnstile.render(el.current, { sitekey: siteKey, language: lang, appearance: 'interaction-only' })
      })
      .catch(() => {
        /* sin captcha el servidor rechazará el envío con un mensaje claro */
      })
    return () => {
      cancelled = true
      if (id.current && window.turnstile) window.turnstile.remove(id.current)
      id.current = null
    }
  }, [siteKey, lang])

  // Cada token sirve una sola vez: tras un envío se pide uno nuevo.
  useEffect(() => {
    if (resetKey > 0 && id.current && window.turnstile) window.turnstile.reset(id.current)
  }, [resetKey])

  if (!siteKey) return null
  return <div ref={el} className="turnstile" />
}
