'use client'

import { useState } from 'react'
import { tileStyle, useDarkMode } from '../mapScale'
import { ABUSE_IDS, INTL_LOCALE, MUNICIPIOS, municipioName, type Locale, type MunicipioId } from '@/lib/domain'
import { dec1, eur, pct, perM2, signedPct } from '@/lib/format'
import { OFFICIAL, OFFICIAL_PROVINCE, OFFICIAL_SOURCE_URL, OFFICIAL_YEAR } from '@/lib/official'
import { fill, type Dict } from '@/lib/i18n'
import { monthLabel, type MonthKey } from '@/lib/months'
import { headline, windowText } from '@/lib/sentence'
import type { ObservatoryData, ScopeStats } from '@/lib/stats'
import { Figures } from './Figures'

type Metric = 'paid' | 'renewal' | 'abuse'

type Props = { lang: Locale; t: Dict; data: ObservatoryData }

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
  // En "€/m² pagado", si la comunidad aún no tiene 5 casos en un municipio, se muestra el dato oficial de
  // Hacienda (SERPAVI) marcado como tal. Subidas y abusos no tienen equivalente oficial.
  const tileValue = (id: MunicipioId): { v: number; official: boolean } | null => {
    const v = metricValue(byScope[id], metric)
    if (v !== null) return { v, official: false }
    return metric === 'paid' ? { v: OFFICIAL[id].eurM2, official: true } : null
  }
  const tiles = Object.fromEntries(MUNICIPIOS.map((m) => [m.id, tileValue(m.id)])) as Record<
    MunicipioId,
    { v: number; official: boolean } | null
  >
  const anyOfficial = Object.values(tiles).some((x) => x?.official)
  const officialTag = fill(t.obs.officialTag, { year: OFFICIAL_YEAR })
  const values = Object.values(tiles)
    .filter((x): x is { v: number; official: boolean } => x !== null)
    .map((x) => x.v)
  const lo = Math.min(...values)
  const hi = Math.max(...values)

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
          {headline(t, lang, s, period, place, scope)}
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
                const tile = tiles[cell.id]
                const selected = scope === cell.id
                const onClick = () => setScope(selected ? null : cell.id)
                if (tile === null) {
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
                const v = tile.v
                const k = hi > lo ? (v - lo) / (hi - lo) : 0.5
                const casesText = tile.official ? officialTag : fill(t.obs.tileCases, { n: st.n ?? 0 })
                return (
                  <button
                    key={cell.id}
                    type="button"
                    className={`cell tile${tile.official ? ' official' : ''}`}
                    aria-pressed={selected}
                    aria-label={`${cell.name}: ${metricText(v)}, ${casesText}`}
                    onClick={onClick}
                    style={tileStyle(k, dark)}
                  >
                    <span className="t-name">{cell.name}</span>
                    <span className="t-val">{metricText(v)}</span>
                    <span className="t-n">{casesText}</span>
                  </button>
                )
              })}
            </div>
            <p className="map-note">{t.obs.mapNote}</p>
            {anyOfficial && <p className="map-note">{fill(t.obs.mapOfficialNote, { year: OFFICIAL_YEAR })}</p>}
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

      <section className="block" id="oficial" aria-labelledby="oficial-h2">
        <h2 id="oficial-h2">{t.obs.officialH2}</h2>
        <p className="lead">{fill(t.obs.officialLead, { year: OFFICIAL_YEAR })}</p>
        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th scope="col">{t.obs.colMuni}</th>
                <th scope="col" className="r">{t.obs.colEurM2}</th>
                <th scope="col" className="r">{t.obs.colRent}</th>
                <th scope="col" className="r">{t.obs.colM2}</th>
                <th scope="col" className="r">{t.obs.colContracts}</th>
                <th scope="col" className="r">{t.obs.colChange}</th>
              </tr>
            </thead>
            <tbody>
              {[...MUNICIPIOS]
                .sort((a, b) => OFFICIAL[b.id].eurM2 - OFFICIAL[a.id].eurM2)
                .map((m) => {
                  const o = OFFICIAL[m.id]
                  return (
                    <tr key={m.id} aria-current={scope === m.id ? 'true' : undefined} style={scope === m.id ? { fontWeight: 600 } : undefined}>
                      <th scope="row" style={{ fontWeight: 600, textAlign: 'left' }}>{m.name}</th>
                      <td className="r">{perM2(o.eurM2, lang)}</td>
                      <td className="r">{eur(o.rent, lang)}</td>
                      <td className="r">{o.m2} m²</td>
                      <td className="r">{o.contracts.toLocaleString(intl)}</td>
                      <td className="r out">{signedPct(o.eurM2 / o.eurM2_2019 - 1)}</td>
                    </tr>
                  )
                })}
              <tr>
                <th scope="row" style={{ fontWeight: 400, textAlign: 'left', color: 'var(--muted)' }}>{t.obs.province}</th>
                <td className="r">{perM2(OFFICIAL_PROVINCE.eurM2, lang)}</td>
                <td className="r">{eur(OFFICIAL_PROVINCE.rent, lang)}</td>
                <td className="r">{OFFICIAL_PROVINCE.m2} m²</td>
                <td className="r">{OFFICIAL_PROVINCE.contracts.toLocaleString(intl)}</td>
                <td className="r out">{signedPct(OFFICIAL_PROVINCE.eurM2 / OFFICIAL_PROVINCE.eurM2_2019 - 1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="map-note">
          {fill(t.obs.officialSource, { year: OFFICIAL_YEAR })}{' '}
          <a href={OFFICIAL_SOURCE_URL} target="_blank" rel="noopener noreferrer">
            serpavi.mivau.gob.es
          </a>
        </p>
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
