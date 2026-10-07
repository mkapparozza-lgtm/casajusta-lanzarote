'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LIMITS, MUNICIPIOS, municipioName, type Locale, type MunicipioId, type Tipo } from '@/lib/domain'
import { eur } from '@/lib/format'
import { fill, type Dict } from '@/lib/i18n'
import type { CommunityRefs } from '@/lib/server/observatory'
import { PREFILL_EVENT, PREFILL_KEY, useEvalState, type Prefill } from './EvalState'

// Referencias oficiales, solo cuando el municipio no tiene 5 contratos en el observatorio.
// Media provincial de Las Palmas (OBVIA / idealista, abril 2026; verificada julio 2026).
const OFFICIAL_PER_M2 = 15.56
// Habitación en piso compartido en Lanzarote (Drago Canarias, mayo 2025). No escala con m².
const OFFICIAL_ROOM = 509

type Props = { lang: Locale; t: Dict['ev']; tipoNames: Dict['tipo']; refs: CommunityRefs }

export function Evaluator({ lang, t, tipoNames, refs }: Props) {
  const router = useRouter()
  const { setResult } = useEvalState()
  const [tipo, setTipo] = useState<Tipo>('vivienda')
  const [municipio, setMunicipio] = useState<MunicipioId>('arrecife')
  const [m2Raw, setM2] = useState('70')
  const [priceRaw, setPrice] = useState('950')
  const [calculated, setCalculated] = useState(false)

  const m2 = Number(m2Raw)
  const precio = Number(priceRaw)
  const valid =
    precio >= LIMITS.price.min &&
    precio <= LIMITS.price.max &&
    (tipo === 'habitacion' || (m2 >= LIMITS.m2.min && m2 <= LIMITS.m2.max))

  const ref = refs[municipio]
  const community = tipo === 'vivienda' ? ref.vivienda : ref.habitacion
  const media = community
    ? Math.round(tipo === 'vivienda' ? community.value * m2 : community.value)
    : Math.round(tipo === 'vivienda' ? OFFICIAL_PER_M2 * m2 : OFFICIAL_ROOM)
  const dif = media > 0 ? Math.round(((precio - media) / media) * 100) : 0
  const tier = dif <= 10 ? 'ok' : dif <= 30 ? 'warn' : 'bad'

  const source = useMemo(() => {
    const name = municipioName(municipio)
    if (community) return fill(t.sourceCommunity, { n: community.n, municipio: name })
    return fill(tipo === 'vivienda' ? t.sourceFull : t.sourceRoom, { municipio: name })
  }, [community, municipio, tipo, t])

  function calculate() {
    if (!valid) {
      setResult(null)
      setCalculated(true)
      return
    }
    setResult({ tipo, municipio, m2, precio, media, dif })
    setCalculated(true)
  }

  function optIn() {
    const prefill: Prefill = { municipio, tipo, m2: tipo === 'vivienda' ? m2 : null, price: precio }
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify(prefill))
    } catch {
      /* sin almacenamiento: el formulario se abre vacío */
    }
    // Si el formulario ya está en esta página (observatorio), lo rellena al momento.
    window.dispatchEvent(new Event(PREFILL_EVENT))
    router.push(`/${lang}#caso`)
  }

  // Cualquier cambio invalida el cálculo mostrado hasta volver a calcular.
  function change<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setCalculated(false)
    }
  }

  const tierColor = tier === 'ok' ? 'var(--green)' : tier === 'warn' ? '#ffb020' : 'var(--red)'
  const show = calculated && valid
  const sign = dif >= 0 ? '+' : ''

  return (
    <div className="ev-grid">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          calculate()
        }}
        noValidate
      >
        <div className="field">
          <span className="label" id="ev-type">
            {t.type}
          </span>
          <div className="type-switch" role="group" aria-labelledby="ev-type">
            {(['vivienda', 'habitacion'] as const).map((k) => (
              <button
                key={k}
                type="button"
                className="type-btn"
                aria-pressed={tipo === k}
                onClick={() => change(setTipo)(k)}
              >
                {k === 'vivienda' ? t.typeFull : t.typeRoom}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="ev-zone">{t.zone}</label>
          <select id="ev-zone" value={municipio} onChange={(e) => change(setMunicipio)(e.target.value as MunicipioId)}>
            {MUNICIPIOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`row2${tipo === 'habitacion' ? ' single' : ''}`}>
          {tipo === 'vivienda' && (
            <div className="field">
              <label htmlFor="ev-m2">{t.m2}</label>
              <input
                id="ev-m2"
                type="number"
                inputMode="numeric"
                min={LIMITS.m2.min}
                max={LIMITS.m2.max}
                value={m2Raw}
                onChange={(e) => change(setM2)(e.target.value)}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="ev-price">{t.price}</label>
            <input
              id="ev-price"
              type="number"
              inputMode="numeric"
              min={LIMITS.price.min}
              max={LIMITS.price.max}
              value={priceRaw}
              onChange={(e) => change(setPrice)(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 8 }}>
          {t.btn}
        </button>
        {calculated && !valid && (
          <p className="ev-error" role="alert">
            {t.invalid}
          </p>
        )}
        <p className={`ev-source${community ? ' community' : ''}`}>{source}</p>
      </form>

      <div className="ev-result" aria-live="polite">
        <div className={`verdict ${show ? tier : 'ok'}`}>
          <span className="shutter" style={{ background: show ? tierColor : 'var(--panel-faint)' }} aria-hidden="true" />
          <div>
            <div className="verdict-title">
              {show ? (tier === 'ok' ? t.verdictOk : tier === 'warn' ? t.verdictWarn : t.verdictBad) : t.placeholderTitle}
            </div>
            <div className="verdict-sub">
              {show
                ? `${municipioName(municipio)} · ${tipo === 'habitacion' ? tipoNames.habitacion : `${m2} m²`} · ${sign}${dif}%`
                : t.placeholderSub}
            </div>
          </div>
        </div>
        <div className="ev-compare">
          <div>
            <div className="label">{t.asked}</div>
            <div className="val">{show ? eur(precio, lang) : '—'}</div>
          </div>
          <div>
            <div className="label">{t.reference}</div>
            <div className="val">{show ? eur(media, lang) : '—'}</div>
          </div>
          <div>
            <div className="label">{t.diff}</div>
            <div className="val">{show ? `${sign}${dif}%` : '—'}</div>
          </div>
        </div>
        {show && (
          <div className="ev-optin">
            <span>{t.optinQ}</span>
            <button type="button" className="btn" onClick={optIn}>
              {t.optinYes}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
