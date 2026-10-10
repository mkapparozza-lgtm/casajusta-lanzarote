'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import {
  ABUSE_IDS,
  INTL_LOCALE,
  LIMITS,
  MUNICIPIOS,
  municipioName,
  type AbuseId,
  type Locale,
  type MunicipioId,
} from '@/lib/domain'
import { fill, type Dict } from '@/lib/i18n'
import type { PublicReport } from '@/lib/server/reports'
import { submitReport, supportReport, type ReportErrorCode, type ReportResult } from '@/app/[lang]/denuncias/actions'
import { Turnstile } from '@/components/observatory/Turnstile'
import { tileStyle, useDarkMode } from '@/components/mapScale'

type Props = {
  lang: Locale
  t: Dict['reports']
  abuses: Dict['abuses']
  reports: PublicReport[]
  counts: Record<MunicipioId, number>
}

const LANG_NAMES: Record<Locale, Record<Locale, string>> = {
  es: { es: 'español', it: 'italiano', en: 'inglés' },
  it: { es: 'spagnolo', it: 'italiano', en: 'inglese' },
  en: { es: 'Spanish', it: 'Italian', en: 'English' },
}

// Recuerda en este navegador qué testimonios ya apoyó (solo para la interfaz: el servidor ya evita duplicados).
const SUPPORTED_KEY = 'cj_supported'
function readSupported(): number[] {
  try {
    return JSON.parse(localStorage.getItem(SUPPORTED_KEY) ?? '[]') as number[]
  } catch {
    return []
  }
}

function monthText(key: string, lang: Locale): string {
  const [y, m] = key.split('-').map(Number)
  if (!y || !m) return key
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 15)),
  )
}

export function Reports({ lang, t, abuses, reports, counts }: Props) {
  const dark = useDarkMode()
  const [muni, setMuni] = useState<MunicipioId | null>(null)
  const [cat, setCat] = useState<AbuseId | 'all'>('all')
  const [supports, setSupports] = useState<Record<number, number>>(() =>
    Object.fromEntries(reports.map((r) => [r.id, r.supports])),
  )
  const [supported, setSupported] = useState<number[]>([])
  const [, startTransition] = useTransition()

  useEffect(() => setSupported(readSupported()), [])

  const max = Math.max(1, ...Object.values(counts))
  const visible = reports.filter((r) => (!muni || r.municipio === muni) && (cat === 'all' || r.category === cat))

  function support(id: number) {
    if (supported.includes(id)) return
    const next = [...supported, id]
    setSupported(next)
    setSupports((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }))
    try {
      localStorage.setItem(SUPPORTED_KEY, JSON.stringify(next))
    } catch {
      /* sin almacenamiento */
    }
    startTransition(async () => {
      const res = await supportReport(id)
      if (res.supports !== null) setSupports((s) => ({ ...s, [id]: res.supports! }))
    })
  }

  const cells: ({ kind: 'sea' } | { kind: 'muni'; id: MunicipioId; name: string })[] = []
  for (let r = 1; r <= 3; r++)
    for (let c = 1; c <= 4; c++) {
      const mu = MUNICIPIOS.find((m) => m.row === r && m.col === c)
      cells.push(mu ? { kind: 'muni', id: mu.id, name: mu.name } : { kind: 'sea' })
    }

  const countText = (n: number) => (n === 0 ? t.tileNone : n === 1 ? t.tileOne : fill(t.tileCount, { n }))

  return (
    <>
      <div className="two">
        <div>
          <div className="map" role="group" aria-label={t.mapLabel}>
            {cells.map((cell, i) => {
              if (cell.kind === 'sea') return <div key={i} className="cell sea" aria-hidden="true" />
              const n = counts[cell.id]
              const selected = muni === cell.id
              return (
                <button
                  key={cell.id}
                  type="button"
                  className={`cell tile${n === 0 ? ' few' : ''}`}
                  aria-pressed={selected}
                  aria-label={`${cell.name}: ${countText(n)}`}
                  onClick={() => setMuni(selected ? null : cell.id)}
                  style={n > 0 ? tileStyle(n / max, dark) : undefined}
                >
                  <span className="t-name">{cell.name}</span>
                  <span className="t-val">{n}</span>
                  <span className="t-n">{countText(n)}</span>
                </button>
              )
            })}
          </div>
          <div className="controls" style={{ marginTop: 16 }}>
            <div className="scope">
              <span>{muni ? municipioName(muni) : t.allMunis}</span>
              {muni && (
                <button type="button" onClick={() => setMuni(null)}>
                  {t.allMunis}
                </button>
              )}
            </div>
            <label className="f" style={{ minWidth: 240 }}>
              <span className="sr-only">{t.filterLabel}</span>
              <select value={cat} onChange={(e) => setCat(e.target.value as AbuseId | 'all')} aria-label={t.filterLabel}>
                <option value="all">
                  {t.filterLabel}: {t.allCategories}
                </option>
                {ABUSE_IDS.map((a) => (
                  <option key={a} value={a}>
                    {abuses[a].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="therm">
          <h3>{t.rulesH3}</h3>
          <ul className="rules">
            {t.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <a href="#contar" className="btn btn-primary" style={{ marginTop: 8 }}>
            {t.formH2}
          </a>
        </div>
      </div>

      <section className="block" aria-labelledby="list-h2" aria-live="polite">
        <h2 id="list-h2">
          {t.listH2} <span className="count-note">· {fill(t.listCount, { n: visible.length })}</span>
        </h2>
        {visible.length === 0 ? (
          <div className="empty" style={{ marginTop: 16 }}>
            {reports.length === 0 ? t.emptyAll : t.empty}
          </div>
        ) : (
          <ul className="report-list">
            {visible.map((r) => {
              const done = supported.includes(r.id)
              const n = supports[r.id] ?? r.supports
              return (
                <li key={r.id} className="report">
                  <p className="report-meta">
                    <b>{municipioName(r.municipio)}</b> · {abuses[r.category].label} · {monthText(r.month, lang)}
                  </p>
                  <p className="report-body" lang={r.lang}>
                    «{r.body}»
                  </p>
                  {r.lang !== lang && (
                    <p className="report-lang">{fill(t.langNote, { lang: LANG_NAMES[lang][r.lang] })}</p>
                  )}
                  <button
                    type="button"
                    className={`support-btn${done ? ' done' : ''}`}
                    aria-pressed={done}
                    aria-label={`${t.support}. ${fill(t.supportAria, { n })}`}
                    onClick={() => support(r.id)}
                  >
                    🤝 {done ? t.supported : t.support} · {n}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        <p className="map-note">{t.disclaimer}</p>
      </section>

      <section className="block" id="contar" aria-labelledby="contar-h2">
        <h2 id="contar-h2">{t.formH2}</h2>
        <p className="lead">{t.formLead}</p>
        <ReportForm lang={lang} t={t} abuses={abuses} defaultMuni={muni} />
      </section>
    </>
  )
}

function ReportForm({
  lang,
  t,
  abuses,
  defaultMuni,
}: {
  lang: Locale
  t: Dict['reports']
  abuses: Dict['abuses']
  defaultMuni: MunicipioId | null
}) {
  const [state, action, pending] = useActionState<ReportResult, FormData>(submitReport, null)
  const [municipio, setMunicipio] = useState<MunicipioId>(defaultMuni ?? 'arrecife')
  const [category, setCategory] = useState<AbuseId>('temporada')
  const [body, setBody] = useState('')
  const [consent, setConsent] = useState(false)
  const [localError, setLocalError] = useState<ReportErrorCode | null>(null)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (defaultMuni) setMunicipio(defaultMuni)
  }, [defaultMuni])

  useEffect(() => {
    if (!state) return
    setResetKey((k) => k + 1)
    if (state.ok) {
      setBody('')
      setConsent(false)
    }
  }, [state])

  const errorText: Record<ReportErrorCode, string> = {
    invalid: t.errInvalid,
    length: t.errLength,
    consent: t.errConsent,
    captcha: t.errCaptcha,
    rate: t.errRate,
    server: t.errServer,
  }
  const error = localError ?? (state && !state.ok ? state.error : null)
  const len = body.trim().length

  return (
    <form
      className="form"
      action={action}
      noValidate
      onSubmit={(e) => {
        const err: ReportErrorCode | null =
          len < LIMITS.report.min || len > LIMITS.report.max ? 'length' : !consent ? 'consent' : null
        setLocalError(err)
        if (err) e.preventDefault()
      }}
    >
      <input type="hidden" name="lang" value={lang} />
      <div className="grid-f">
        <div className="f span2">
          <label htmlFor="rMuni">{t.municipio}</label>
          <select id="rMuni" name="municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value as MunicipioId)}>
            {[...MUNICIPIOS]
              .sort((a, b) => a.name.localeCompare(b.name, 'es'))
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>
        <div className="f span2">
          <label htmlFor="rCat">{t.category}</label>
          <select id="rCat" name="category" value={category} onChange={(e) => setCategory(e.target.value as AbuseId)}>
            {ABUSE_IDS.map((a) => (
              <option key={a} value={a}>
                {abuses[a].label}
              </option>
            ))}
          </select>
        </div>
        <div className="f span4 other-text" style={{ maxWidth: 'none', marginTop: 0 }}>
          <label htmlFor="rBody">{t.body}</label>
          <textarea
            id="rBody"
            name="body"
            rows={5}
            maxLength={LIMITS.report.max}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-invalid={error === 'length' ? true : undefined}
            aria-describedby="rBodyHint"
            required
          />
          <p id="rBodyHint" className="hint">
            {t.bodyHint} ({len}/{LIMITS.report.max})
          </p>
        </div>
        <div className="f span4 checks" style={{ gridTemplateColumns: '1fr' }}>
          <label>
            <input
              type="checkbox"
              name="consent"
              value="yes"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={error === 'consent' ? true : undefined}
            />
            <span>{t.consent}</span>
          </label>
        </div>
      </div>
      <Turnstile lang={lang} resetKey={resetKey} />
      <div className="f-actions">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? t.sending : t.submit}
        </button>
        <p className={`msg ${error ? 'err' : state?.ok ? 'ok' : ''}`} role="status" aria-live="polite">
          {pending ? '' : error ? errorText[error] : state?.ok ? t.ok : ''}
        </p>
      </div>
    </form>
  )
}
