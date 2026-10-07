'use client'

import { useEffect, useState } from 'react'
import { ABUSE_IDS, INTL_LOCALE, MUNICIPIOS, municipioName, type Locale, type MunicipioId } from '@/lib/domain'
import { dec1, pct, perM2, signedPct } from '@/lib/format'
import { fill, type Dict } from '@/lib/i18n'
import { monthLabel, type MonthKey } from '@/lib/months'
import { headline, windowText } from '@/lib/sentence'
import type { ObservatoryData, ScopeStats } from '@/lib/stats'
import { Figures } from './Figures'

type Metric = 'paid' | 'renewal' | 'abuse'

type Props = { lang: Locale; t: Dict; data: ObservatoryData }

// Extremos de la escala del mapa (mismos valores que --tile-low / --tile-high en globals.css).
const SCALE = {
  light: { low: [0xf2, 0xee, 0xe3], high: [0xff, 0x4f, 0x2b] },
  dark: { low: [0x2a, 0x27, 0x21], high: [0xff, 0x5a, 0x36] },
} as const

function useDarkMode(): boolean {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const forced = document.documentElement.dataset.theme
    if (forced) {
      setDark(forced === 'dark')
      return
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    const on = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return dark
}

function luminance([r, g, b]: number[]): number {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!)
}

/** Tinta o blanco, el que dé más contraste WCAG sobre el fondo. */
function textOn(rgb: number[]): string {
  const l = luminance(rgb)
  const vsInk = (l + 0.05) / (luminance([0x17, 0x15, 0x0f]) + 0.05)
  const vsWhite = 1.05 / (l + 0.05)
  return vsInk >= vsWhite ? '#17150F' : '#FFFFFF'
}

function metricValue(s: ScopeStats, m: Metric): number | null {
  if (m === 'paid') return s.paid?.value ?? null
  if (m === 'renewal') return s.renewal?.value ?? null
  return s.abuseShare
}

export function Observatory({ lang, t, data }: Props) {
  const dark = useDarkMode()
  const latest = data.periods[data.periods.length - 1]!
  const [end, setEnd] = useState<MonthKey>(latest)
  const [scope, setScope] = useState<MunicipioId | null>(null)
  const [metric, setMetric] = useState<Metric>('paid')
  const intl = INTL_LOCALE[lang]

  // Si los datos cambian (p. ej. al añadir un caso) y el periodo ya no existe, volver al último.
  const period = data.stats[end] ? end : latest
  const byScope = data.stats[period]!
  const s = byScope[scope ?? 'island']
  const place = scope ? municipioName(scope) : t.obs.islandPlace
  const win = windowText(t, lang, period)

  const metricText = (v: number) =>
    metric === 'paid' ? perM2(v, lang) : metric === 'renewal' ? signedPct(v) : pct(v)

  // ---- mapa ----
  const values = MUNICIPIOS.map((m) => metricValue(byScope[m.id], metric)).filter((v): v is number => v !== null)
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const scale = dark ? SCALE.dark : SCALE.light

  const cells: ({ kind: 'sea' } | { kind: 'muni'; id: MunicipioId; name: string })[] = []
  for (let r = 1; r <= 3; r++)
    for (let c = 1; c <= 4; c++) {
      const mu = MUNICIPIOS.find((m) => m.row === r && m.col === c)
      cells.push(mu ? { kind: 'muni', id: mu.id, name: mu.name } : { kind: 'sea' })
    }

  // ---- termómetro ----
  const abuseRows =
    s.n && s.abuseCounts
      ? [...ABUSE_IDS].sort((a, b) => s.abuseCounts![b] - s.abuseCounts![a]).map((id) => ({ id, count: s.abuseCounts![id] }))
      : []
  const maxCount = Math.max(1, ...abuseRows.map((r) => r.count))

  // ---- gráfico ----
  const pts = data.periods.map((p) => {
    const st = data.stats[p]![scope ?? 'island']
    return { p, paid: st.paid?.value ?? null, asked: st.asked?.value ?? null }
  })
  const all = pts.flatMap((p) => [p.paid, p.asked]).filter((v): v is number => v !== null)
  const paidPts = pts.filter((p) => p.paid !== null)
  const first = paidPts[0]
  const last = paidPts[paidPts.length - 1]
  let trendLead: string
  if (all.length < 2) trendLead = fill(t.obs.trendEmpty, { place })
  else if (first && last && first !== last)
    trendLead = fill(t.obs.trendLead, {
      place,
      from: dec1(first.paid!, lang),
      to: dec1(last.paid!, lang),
      pct: signedPct(last.paid! / first.paid! - 1),
    })
  else trendLead = fill(t.obs.trendLeadSimple, { place })

  return (
    <>
      <section className="obs-hero" aria-labelledby="obs-h1">
        <p className="obs-kicker">
          <span className="mark" style={{ background: 'var(--red)' }} aria-hidden="true" />
          {t.obs.kicker}
        </p>
        <h1 id="obs-h1" aria-live="polite">
          {headline(t, lang, s, period, place, scope === null)}
        </h1>
        <div className="controls">
          <div>
            <span className="ctl-label" id="period-label">
              {t.obs.periodLabel}
            </span>
            <div className="seg" role="group" aria-labelledby="period-label">
              {data.periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={p === period}
                  aria-label={monthLabel(p, intl, 'long')}
                  onClick={() => setEnd(p)}
                >
                  {monthLabel(p, intl, 'short').replace('.', '')}
                </button>
              ))}
            </div>
          </div>
          <div className="scope" aria-live="polite">
            <span>{scope ? municipioName(scope) : t.obs.island}</span>
            {scope && (
              <button type="button" onClick={() => setScope(null)}>
                {t.obs.resetScope}
              </button>
            )}
          </div>
        </div>
      </section>

      <Figures s={s} t={t.obs} lang={lang} />

      <section className="block" id="mapa" aria-labelledby="mapa-h2">
        <h2 id="mapa-h2">{t.obs.mapH2}</h2>
        <p className="lead">{t.obs.mapLead}</p>
        <div className="two">
          <div>
            <div className="seg metric-tabs" role="group" aria-label={t.obs.mapGroup}>
              {(
                [
                  ['paid', t.obs.metricPaid],
                  ['renewal', t.obs.metricRenewal],
                  ['abuse', t.obs.metricAbuse],
                ] as const
              ).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={metric === id} onClick={() => setMetric(id)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="map" role="group" aria-label={t.obs.mapLabel}>
              {cells.map((cell, i) => {
                if (cell.kind === 'sea') return <div key={i} className="cell sea" aria-hidden="true" />
                const st = byScope[cell.id]
                const v = metricValue(st, metric)
                const selected = scope === cell.id
                const onClick = () => setScope(selected ? null : cell.id)
                if (v === null) {
                  return (
                    <button
                      key={cell.id}
                      type="button"
                      className="cell tile few"
                      aria-pressed={selected}
                      aria-label={`${cell.name}: ${t.obs.fewCases}`}
                      onClick={onClick}
                    >
                      <span className="t-name">{cell.name}</span>
                      <span className="t-val">{t.obs.fewCases}</span>
                      <span className="t-n" />
                    </button>
                  )
                }
                const k = hi > lo ? (v - lo) / (hi - lo) : 0.5
                const mixT = 0.15 + k * 0.85
                const rgb = scale.low.map((a, j) => Math.round(a + (scale.high[j]! - a) * mixT))
                const casesText = fill(t.obs.tileCases, { n: st.n ?? 0 })
                return (
                  <button
                    key={cell.id}
                    type="button"
                    className="cell tile"
                    aria-pressed={selected}
                    aria-label={`${cell.name}: ${metricText(v)}, ${casesText}`}
                    onClick={onClick}
                    style={{ background: `rgb(${rgb.join(',')})`, color: textOn(rgb) }}
                  >
                    <span className="t-name">{cell.name}</span>
                    <span className="t-val">{metricText(v)}</span>
                    <span className="t-n">{casesText}</span>
                  </button>
                )
              })}
            </div>
            <p className="map-note">{t.obs.mapNote}</p>
          </div>

          <div className="therm">
            <h3 id="therm-h3">{t.obs.thermH3}</h3>
            {s.n ? (
              <>
                <p className="therm-sub">{fill(t.obs.thermSub, { place, window: win, n: s.n })}</p>
                <ul className="bar-list" aria-labelledby="therm-h3">
                  {abuseRows.map((r) => {
                    const share = pct(r.count / s.n!)
                    return (
                      <li className="bar-row" key={r.id} aria-label={fill(t.obs.thermBar, { label: t.abuses[r.id].label, pct: share })}>
                        <div className="bar-top" aria-hidden="true">
                          <b>{t.abuses[r.id].label}</b>
                          <span>{share}</span>
                        </div>
                        <div className="bar" aria-hidden="true">
                          <span style={{ width: `${(r.count / maxCount) * 100}%` }} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </>
            ) : (
              <>
                <p className="therm-sub">
                  {place}, {win}
                </p>
                <div className="empty">{t.obs.thermEmpty}</div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="trend-h2">
        <h2 id="trend-h2">{t.obs.trendH2}</h2>
        <p className="lead">{trendLead}</p>
        {all.length >= 2 && (
          <>
            <TrendChart pts={pts} all={all} period={period} lang={lang} label={fill(t.obs.trendAria, { place })} />
            <div className="sr-only">
            <table>
              <caption>{fill(t.obs.trendAria, { place })}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.obs.periodGroup}</th>
                  <th scope="col">{t.obs.legendPaid}</th>
                  <th scope="col">{t.obs.legendAsked}</th>
                </tr>
              </thead>
              <tbody>
                {pts.map((p) => (
                  <tr key={p.p}>
                    <th scope="row">{monthLabel(p.p, intl)}</th>
                    <td>{p.paid !== null ? perM2(p.paid, lang) : t.obs.fewCases}</td>
                    <td>{p.asked !== null ? perM2(p.asked, lang) : t.obs.fewCases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
        <div className="legend" aria-hidden="true">
          <span>
            <i style={{ background: 'var(--blue)' }} />
            {t.obs.legendPaid}
          </span>
          <span>
            <i className="dashed" />
            {t.obs.legendAsked}
          </span>
        </div>
      </section>
    </>
  )
}

function TrendChart({
  pts,
  all,
  period,
  lang,
  label,
}: {
  pts: { p: MonthKey; paid: number | null; asked: number | null }[]
  all: number[]
  period: MonthKey
  lang: Locale
  label: string
}) {
  const W = 640
  const H = 240
  const L = 48
  const R = 24
  const T = 16
  const B = 36
  const lo = Math.floor(Math.min(...all) - 0.5)
  const hi = Math.ceil(Math.max(...all) + 0.5)
  const x = (i: number) => L + (i * (W - L - R)) / Math.max(1, pts.length - 1)
  const y = (v: number) => T + ((hi - v) / (hi - lo)) * (H - T - B)
  const intl = INTL_LOCALE[lang]

  // Un tramo se corta donde falta un punto (periodo bajo el umbral): nunca se dibuja un dato inexistente.
  function line(key: 'paid' | 'asked', color: string, dashed: boolean) {
    let d = ''
    let started = false
    pts.forEach((p, i) => {
      const v = p[key]
      if (v === null) {
        started = false
        return
      }
      d += `${started ? 'L' : 'M'}${x(i)} ${y(v)} `
      started = true
    })
    return (
      <g>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={dashed ? '6 5' : undefined}
        />
        {pts.map((p, i) =>
          p[key] !== null ? <circle key={p.p} cx={x(i)} cy={y(p[key]!)} r={p.p === period ? 5.5 : 3.5} fill={color} /> : null,
        )}
      </g>
    )
  }

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {[0, 1, 2, 3].map((k) => {
          const v = lo + ((hi - lo) * k) / 3
          return (
            <g key={k}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" />
              <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={12} fill="var(--muted)">
                {dec1(v, lang)}
              </text>
            </g>
          )
        })}
        {pts.map((p, i) => (
          <text key={p.p} x={x(i)} y={H - 10} textAnchor="middle" fontSize={12} fill="var(--muted)">
            {monthLabel(p.p, intl, 'short').replace('.', '')}
          </text>
        ))}
        {line('asked', 'var(--red)', true)}
        {line('paid', 'var(--blue)', false)}
      </svg>
    </div>
  )
}
