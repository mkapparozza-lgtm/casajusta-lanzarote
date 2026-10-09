'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import type { Locale } from '@/lib/domain'
import type { Dict } from '@/lib/i18n'

// Consentimiento de cookies (criterios AEPD): Google Analytics NO se carga ni instala cookies hasta que la
// persona pulsa "Aceptar". "Rechazar" está al mismo nivel. La elección se guarda en una cookie técnica
// (cj_consent, 6 meses) y se puede cambiar desde el enlace "Cookies" del pie (evento OPEN_EVENT).

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const COOKIE = 'cj_consent'
const MAX_AGE = 60 * 60 * 24 * 182
export const OPEN_CONSENT_EVENT = 'cj-open-consent'

type Choice = 'granted' | 'denied'

function readChoice(): Choice | null {
  const m = document.cookie.match(/(?:^|; )cj_consent=(granted|denied)/)
  return (m?.[1] as Choice | undefined) ?? null
}

function saveChoice(c: Choice) {
  const secure = location.protocol === 'https:' ? '; secure' : ''
  document.cookie = `${COOKIE}=${c}; max-age=${MAX_AGE}; path=/; samesite=lax${secure}`
}

/** Borra las cookies de Google Analytics (_ga, _ga_*) al retirar el consentimiento. */
function clearAnalyticsCookies() {
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const part of document.cookie.split('; ')) {
    const name = part.split('=')[0]
    if (!name || !/^_ga/.test(name)) continue
    for (const d of domains) document.cookie = `${name}=; max-age=0; path=/${d ? `; domain=${d}` : ''}`
  }
}

export function CookieConsent({ lang, t }: { lang: Locale; t: Dict['cookies'] }) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!GA_ID) return // sin Analytics no hay cookies no técnicas: no hace falta banner
    const c = readChoice()
    setChoice(c)
    setOpen(c === null)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  if (!GA_ID) return null

  function decide(c: Choice) {
    const before = choice
    saveChoice(c)
    setChoice(c)
    setOpen(false)
    if (c === 'denied' && before === 'granted') {
      clearAnalyticsCookies()
      location.reload() // descarga el script de Analytics ya cargado
    }
  }

  return (
    <>
      {choice === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {open && (
        <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text">
          <div className="cookie-inner">
            <div>
              <p id="cookie-title" className="cookie-title">
                {t.title}
              </p>
              <p id="cookie-text" className="cookie-text">
                {t.text}{' '}
                <Link href={`/${lang}/privacidad#cookies`}>{t.policy}</Link>
              </p>
            </div>
            <div className="cookie-actions">
              <button type="button" className="btn" onClick={() => decide('denied')}>
                {t.reject}
              </button>
              <button type="button" className="btn" onClick={() => decide('granted')}>
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Enlace del pie para volver a abrir el banner y cambiar la elección. */
export function CookieSettingsLink({ label }: { label: string }) {
  if (!GA_ID) return null
  return (
    <button type="button" className="link-btn" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      {label}
    </button>
  )
}
