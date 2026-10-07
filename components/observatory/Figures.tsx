// Las tres cifras del observatorio. Sin hooks: se usa desde la home (servidor) y desde el observatorio (cliente).

import type { Locale } from '@/lib/domain'
import { eur, perM2, signedPct } from '@/lib/format'
import { fill, type Dict } from '@/lib/i18n'
import type { ScopeStats } from '@/lib/stats'

export function Figures({ s, t, lang }: { s: ScopeStats; t: Dict['obs']; lang: Locale }) {
  const gap = s.paid && s.asked ? s.asked.value / s.paid.value - 1 : null
  return (
    <div className="figures">
      <div className="fig">
        {s.paid ? (
          <>
            <div className="num blue">{perM2(s.paid.value, lang)}</div>
            <div className="what">{t.figPaid}</div>
            <div className="sub">{fill(t.figPaidSub, { amount: eur(s.paid.value * 70, lang) })}</div>
          </>
        ) : (
          <>
            <div className="num none">{t.fewCases}</div>
            <div className="what">{t.figPaid}</div>
            <div className="sub">{t.figFewSub}</div>
          </>
        )}
      </div>
      <div className="fig">
        {s.renewal ? (
          <>
            <div className="num red">{signedPct(s.renewal.value)}</div>
            <div className="what">{t.figRenewal}</div>
            <div className="sub">{fill(t.figRenewalSub, { n: s.renewal.n })}</div>
          </>
        ) : (
          <>
            <div className="num none">{t.fewCases}</div>
            <div className="what">{t.figRenewal}</div>
            <div className="sub">{t.figFewSub}</div>
          </>
        )}
      </div>
      <div className="fig">
        {gap !== null && s.asked ? (
          <>
            <div className="num red">{signedPct(gap)}</div>
            <div className="what">{t.figGap}</div>
            <div className="sub">{fill(t.figGapSub, { value: perM2(s.asked.value, lang) })}</div>
          </>
        ) : (
          <>
            <div className="num none">{t.fewCases}</div>
            <div className="what">{t.figGap}</div>
            <div className="sub">{t.figGapFewSub}</div>
          </>
        )}
      </div>
    </div>
  )
}
