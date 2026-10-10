'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { MUNICIPIOS, municipioName, type Locale, type MunicipioId, type Tipo } from '@/lib/domain'
import { eur, perM2 } from '@/lib/format'
import { fill, type Dict } from '@/lib/i18n'
import { OFFICIAL } from '@/lib/official'
import { SCAM_QUESTIONS, assessListing, type Answer, type Assessment, type ScamQuestion } from '@/lib/scam'

type Props = { lang: Locale; t: Dict['scam']; tipoNames: Dict['tipo']; guideSlug: string }

const sortedMunis = [...MUNICIPIOS].sort((a, b) => a.name.localeCompare(b.name, 'es'))

export function ScamChecker({ lang, t, tipoNames, guideSlug }: Props) {
  const [answers, setAnswers] = useState<Partial<Record<ScamQuestion, Answer>>>({})
  const [municipio, setMunicipio] = useState<MunicipioId>('arrecife')
  const [tipo, setTipo] = useState<Tipo>('habitacion')
  const [m2, setM2] = useState('')
  const [price, setPrice] = useState('')
  const [result, setResult] = useState<Assessment | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function evaluate() {
    const p = Number(price)
    const r = assessListing(
      answers,
      p > 0 ? { municipio, tipo, m2: tipo === 'vivienda' && m2 ? Number(m2) : null, price: p } : undefined,
    )
    setResult(r)
    // Lleva el foco al resultado (accesible con teclado y lector de pantalla).
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  const riskTitle = result && { high: t.riskHigh, medium: t.riskMid, low: t.riskLow }[result.risk]
  const riskText = result && { high: t.riskHighText, medium: t.riskMidText, low: t.riskLowText }[result.risk]

  return (
    <div className="scam">
      <section className="form" aria-labelledby="scam-q-h2">
        <h2 id="scam-q-h2" className="scam-h2">
          {t.questionsH2}
        </h2>
        <ol className="scam-questions">
          {SCAM_QUESTIONS.map((q) => (
            <li key={q}>
              <fieldset>
                <legend>{t.q[q]}</legend>
                <div className="seg" role="radiogroup">
                  {(['yes', 'no', 'unsure'] as const).map((a) => (
                    <label key={a} className={`choice${answers[q] === a ? ' on' : ''}`}>
                      <input
                        type="radio"
                        name={q}
                        value={a}
                        checked={answers[q] === a}
                        onChange={() => setAnswers((s) => ({ ...s, [q]: a }))}
                      />
                      {a === 'yes' ? t.yes : a === 'no' ? t.no : t.unsure}
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        <h2 className="scam-h2" style={{ marginTop: 28 }}>
          {t.priceH2}
        </h2>
        <p className="hint" style={{ margin: '0 0 12px', color: 'var(--muted)' }}>
          {t.priceLead}
        </p>
        <div className="grid-f">
          <div className="f">
            <label htmlFor="sMuni">{t.municipio}</label>
            <select id="sMuni" value={municipio} onChange={(e) => setMunicipio(e.target.value as MunicipioId)}>
              {sortedMunis.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="f">
            <label htmlFor="sTipo">{t.tipo}</label>
            <select id="sTipo" value={tipo} onChange={(e) => setTipo(e.target.value as Tipo)}>
              <option value="habitacion">{tipoNames.habitacion}</option>
              <option value="vivienda">{tipoNames.vivienda}</option>
            </select>
          </div>
          {tipo === 'vivienda' && (
            <div className="f">
              <label htmlFor="sM2">{t.m2}</label>
              <input id="sM2" type="number" inputMode="numeric" min={15} max={400} value={m2} onChange={(e) => setM2(e.target.value)} />
            </div>
          )}
          <div className="f">
            <label htmlFor="sPrice">{t.price}</label>
            <input id="sPrice" type="number" inputMode="numeric" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>

        <div className="f-actions">
          <button type="button" className="btn btn-primary" onClick={evaluate}>
            {t.check}
          </button>
          <span className="hint" style={{ color: 'var(--muted)', fontSize: 13 }}>
            {t.privacy}
          </span>
        </div>
      </section>

      {result && (
        <section
          ref={resultRef}
          tabIndex={-1}
          className={`scam-result risk-${result.risk}`}
          aria-live="polite"
          aria-labelledby="scam-r-h2"
        >
          <h2 id="scam-r-h2" className="scam-h2">
            {t.resultH2}: {riskTitle}
          </h2>
          <p>{riskText}</p>

          <h3>{t.flagsH3}</h3>
          {result.flags.length === 0 ? (
            <p>{t.noFlags}</p>
          ) : (
            <ul>
              {result.flags.map((f) => (
                <li key={f}>{t.flags[f]}</li>
              ))}
            </ul>
          )}

          {result.price && (
            <p className="scam-price">
              {result.price.kind === 'cheap'
                ? fill(t.priceCheap, { ref: eur(result.price.ref, lang) })
                : result.price.kind === 'roomHigh'
                  ? fill(t.priceRoomHigh, { price: eur(Number(price), lang) })
                  : t.priceNormal}{' '}
              {tipo === 'vivienda' &&
                fill(t.priceOfficial, {
                  municipio: municipioName(municipio),
                  eurM2: perM2(OFFICIAL[municipio].eurM2, lang),
                })}
            </p>
          )}

          <div className="two" style={{ marginTop: 18 }}>
            <div>
              <h3>{t.adviceH3}</h3>
              <ul>
                {t.advice.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{t.paidH3}</h3>
              <ul>
                {t.paid.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="teaser-actions">
            {result.risk !== 'low' && (
              <Link href={`/${lang}/denuncias?tipo=anuncio#contar`} className="btn btn-primary">
                {t.warnOthers}
              </Link>
            )}
            <Link href={`/${lang}/noticias/${guideSlug}`} className="btn">
              {t.readGuide}
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
