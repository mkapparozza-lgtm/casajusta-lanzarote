'use client'

import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ABUSE_IDS,
  LIMITS,
  MAX_EUR_M2,
  MIN_EUR_M2,
  MUNICIPIOS,
  isMunicipio,
  municipioName,
  type AbuseId,
  type Locale,
  type MunicipioId,
  type Source,
  type Tipo,
} from '@/lib/domain'
import { fill, type Dict } from '@/lib/i18n'
import { submitCase, type CaseErrorCode, type CaseResult } from '@/app/[lang]/observatorio/actions'
import { PREFILL_KEY, type Prefill } from '@/components/home/EvalState'
import { Turnstile } from './Turnstile'

type Props = { lang: Locale; t: Dict['form']; abuses: Dict['abuses']; tipoNames: Dict['tipo'] }

const sortedMunis = [...MUNICIPIOS].sort((a, b) => a.name.localeCompare(b.name, 'es'))

export function CaseForm({ lang, t, abuses, tipoNames }: Props) {
  const [state, action, pending] = useActionState<CaseResult, FormData>(submitCase, null)
  const [municipio, setMunicipio] = useState<MunicipioId>('arrecife')
  const [tipo, setTipo] = useState<Tipo>('vivienda')
  const [source, setSource] = useState<Source>('pagado')
  const [m2, setM2] = useState('')
  const [price, setPrice] = useState('')
  const [prev, setPrev] = useState('')
  const [checked, setChecked] = useState<AbuseId[]>([])
  const [other, setOther] = useState('')
  const [localError, setLocalError] = useState<CaseErrorCode | null>(null)
  const [prefilled, setPrefilled] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const handled = useRef<CaseResult>(null)

  // Datos que llegan del evaluador (sessionStorage, nunca por la URL).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PREFILL_KEY)
      if (!raw) return
      sessionStorage.removeItem(PREFILL_KEY)
      const p = JSON.parse(raw) as Partial<Prefill>
      if (isMunicipio(p.municipio)) setMunicipio(p.municipio)
      if (p.tipo === 'vivienda' || p.tipo === 'habitacion') setTipo(p.tipo)
      if (typeof p.m2 === 'number') setM2(String(p.m2))
      if (typeof p.price === 'number') setPrice(String(p.price))
      setPrefilled(true)
    } catch {
      /* sin prefill */
    }
  }, [])

  // Tras un envío correcto se vacía el formulario (se conserva el municipio).
  useEffect(() => {
    if (!state || state === handled.current) return
    handled.current = state
    setResetKey((k) => k + 1)
    if (state.ok) {
      setM2('')
      setPrice('')
      setPrev('')
      setChecked([])
      setOther('')
      setPrefilled(false)
    }
  }, [state])

  function validate(): CaseErrorCode | null {
    const nM2 = m2 === '' ? null : Number(m2)
    const nPrice = Number(price)
    const nPrev = prev === '' ? null : Number(prev)
    const m2Bad = nM2 === null ? tipo === 'vivienda' : !(Number.isInteger(nM2) && nM2 >= LIMITS.m2.min && nM2 <= LIMITS.m2.max)
    if (m2Bad) return 'm2'
    if (!(Number.isInteger(nPrice) && nPrice >= LIMITS.price.min && nPrice <= LIMITS.price.max)) return 'price'
    if (source === 'pagado' && nPrev !== null && !(Number.isInteger(nPrev) && nPrev >= LIMITS.price.min && nPrev < nPrice))
      return 'prev'
    if (tipo === 'vivienda' && nM2 && (nPrice / nM2 < MIN_EUR_M2 || nPrice / nM2 > MAX_EUR_M2)) return 'ratio'
    if (checked.includes('otro') && other.trim().length < LIMITS.otherText.min) return 'other'
    return null
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const err = validate()
    setLocalError(err)
    if (err) e.preventDefault()
  }

  const errorText: Record<CaseErrorCode, string> = {
    m2: t.errM2,
    price: t.errPrice,
    prev: t.errPrev,
    ratio: t.errRatio,
    other: t.errOther,
    invalid: t.errInvalid,
    captcha: t.errCaptcha,
    rate: t.errRate,
    server: t.errServer,
  }
  const error = localError ?? (state && !state.ok ? state.error : null)

  let msg: { cls: string; text: string } | null = null
  if (pending) msg = { cls: 'msg info', text: t.sending }
  else if (error) msg = { cls: 'msg err', text: errorText[error] }
  else if (state?.ok)
    msg = {
      cls: 'msg ok',
      text:
        state.count !== null
          ? fill(t.okCount, { municipio: municipioName(state.municipio), n: state.count })
          : fill(t.okFew, { municipio: municipioName(state.municipio) }),
    }
  else if (prefilled) msg = { cls: 'msg info', text: t.prefilled }

  const invalid = (code: CaseErrorCode) => (error === code ? true : undefined)

  return (
    <form className="form" action={action} onSubmit={onSubmit} noValidate aria-describedby="case-msg">
      <div className="grid-f">
        <div className="f">
          <label htmlFor="fMuni">{t.municipio}</label>
          <select id="fMuni" name="municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value as MunicipioId)}>
            {sortedMunis.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="f">
          <label htmlFor="fTipo">{t.tipo}</label>
          <select id="fTipo" name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as Tipo)}>
            <option value="vivienda">{tipoNames.vivienda}</option>
            <option value="habitacion">{tipoNames.habitacion}</option>
          </select>
        </div>
        <div className="f span2">
          <label htmlFor="fSource">{t.source}</label>
          <select id="fSource" name="source" value={source} onChange={(e) => setSource(e.target.value as Source)}>
            <option value="pagado">{t.sourcePagado}</option>
            <option value="pedido">{t.sourcePedido}</option>
          </select>
        </div>
        <div className="f">
          <label htmlFor="fM2">
            {t.m2} {tipo === 'habitacion' && <span className="hint">({t.m2Room})</span>}
          </label>
          <input
            id="fM2"
            name="m2"
            type="number"
            inputMode="numeric"
            min={LIMITS.m2.min}
            max={LIMITS.m2.max}
            placeholder="70"
            value={m2}
            onChange={(e) => setM2(e.target.value)}
            aria-invalid={invalid('m2') ?? invalid('ratio')}
            required={tipo === 'vivienda'}
          />
        </div>
        <div className="f">
          <label htmlFor="fPrice">{t.price}</label>
          <input
            id="fPrice"
            name="price"
            type="number"
            inputMode="numeric"
            min={LIMITS.price.min}
            max={LIMITS.price.max}
            placeholder="950"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-invalid={invalid('price') ?? invalid('ratio')}
            required
          />
        </div>
        {source === 'pagado' && (
          <div className="f span2">
            <label htmlFor="fPrev">
              {t.prev} <span className="hint">{t.prevHint}</span>
            </label>
            <input
              id="fPrev"
              name="prev"
              type="number"
              inputMode="numeric"
              min={LIMITS.price.min}
              max={LIMITS.price.max}
              placeholder={t.prevPlaceholder}
              value={prev}
              onChange={(e) => setPrev(e.target.value)}
              aria-invalid={invalid('prev')}
            />
          </div>
        )}
        <fieldset className="f span4">
          <legend>{t.abuses}</legend>
          <div className="checks">
            {ABUSE_IDS.map((id) => (
              <label key={id}>
                <input
                  type="checkbox"
                  name="abuses"
                  value={id}
                  checked={checked.includes(id)}
                  onChange={(e) => setChecked((c) => (e.target.checked ? [...c, id] : c.filter((x) => x !== id)))}
                />
                <span>{abuses[id].label}</span>
              </label>
            ))}
          </div>
          {checked.includes('otro') && (
            <div className="other-text">
              <label htmlFor="fOther">{t.otherLabel}</label>
              <textarea
                id="fOther"
                name="other"
                rows={2}
                maxLength={LIMITS.otherText.max}
                value={other}
                onChange={(e) => setOther(e.target.value)}
                aria-invalid={invalid('other')}
                aria-describedby="fOtherHint"
                required
              />
              <p id="fOtherHint" className="hint">
                {t.otherHint} ({other.length}/{LIMITS.otherText.max})
              </p>
            </div>
          )}
        </fieldset>
      </div>
      <Turnstile lang={lang} resetKey={resetKey} />
      <div className="f-actions">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? t.sending : t.submit}
        </button>
        <p id="case-msg" className={msg?.cls ?? 'msg'} role="status" aria-live="polite">
          {msg?.text}
        </p>
      </div>
    </form>
  )
}
