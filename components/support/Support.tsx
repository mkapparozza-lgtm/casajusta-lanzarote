import { INTL_LOCALE, type Locale } from '@/lib/domain'
import { eurCents, shortDate } from '@/lib/format'
import type { GoalKey } from '@/lib/goals'
import { fill, type Dict } from '@/lib/i18n'
import { monthLabel, type MonthKey } from '@/lib/months'
import type { SupportData } from '@/lib/server/support'
import { GiveBox } from './GiveBox'

export function goalTitle(t: Dict, key: GoalKey, month: MonthKey, lang: Locale): string {
  return fill(t.goals[key].title, { month: monthLabel(month, INTL_LOCALE[lang]) })
}

type Props = { lang: Locale; t: Dict; data: SupportData; flash: 'ok' | 'cancel' | null }

export function Support({ lang, t, data, flash }: Props) {
  const s = t.support
  const g = data.active
  const statusLabel = { done: s.statusDone, now: s.statusNow, next: s.statusNext }

  return (
    <section className="block" id="apoya" aria-labelledby="apoya-h2">
      <h2 id="apoya-h2">{s.h2}</h2>
      <p className="lead">{s.lead}</p>

      <div className="goal-now">
        {g ? (
          <div>
            <span className="goal-tag">{s.current}</span>
            <h3>{goalTitle(t, g.key, data.currentMonth, lang)}</h3>
            <p className="why">{t.goals[g.key].why}</p>
            <div
              className="big-bar"
              role="progressbar"
              aria-label={s.progress}
              aria-valuemin={0}
              aria-valuemax={g.targetCents / 100}
              aria-valuenow={Math.min(g.raisedCents, g.targetCents) / 100}
              aria-valuetext={fill(s.raisedOf, { raised: eurCents(g.raisedCents, lang), target: eurCents(g.targetCents, lang) })}
            >
              <span style={{ width: `${Math.min(100, (g.raisedCents / g.targetCents) * 100)}%` }} />
            </div>
            <div className="goal-figs">
              <span>
                <b>{eurCents(g.raisedCents, lang)}</b> {fill(s.raisedOf, { raised: '', target: eurCents(g.targetCents, lang) }).trim()}
              </span>
              <span>{fill(s.missing, { amount: eurCents(Math.max(0, g.targetCents - g.raisedCents), lang) })}</span>
            </div>
            <p className="people">{fill(s.people, { n: data.people })}</p>
          </div>
        ) : (
          <div>
            <span className="goal-tag">{s.allDoneTag}</span>
            <h3>{s.allDone}</h3>
            <p className="people">{fill(s.people, { n: data.people })}</p>
          </div>
        )}
        {g && <GiveBox lang={lang} t={s} enabled={data.donationsEnabled} flash={flash} />}
      </div>

      <div className="goal-queue">
        <h3>{s.listH3}</h3>
        <ol>
          {data.goals.map((goal) => (
            <li key={goal.id}>
              <span className={`status ${goal.status}`}>{statusLabel[goal.status]}</span>
              <div>
                <div className="g-t">{goalTitle(t, goal.key, data.currentMonth, lang)}</div>
                <div className="g-d">
                  {t.goals[goal.key].desc}
                  {goal.recurring && ` · ${s.recurringNote}`}
                </div>
              </div>
              <div className="g-a">{eurCents(goal.targetCents, lang)}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="ledger">
        <h3>{s.ledgerH3}</h3>
        <p className="therm-sub">{s.ledgerSub}</p>
        <div className="ledger-sum">
          <div>
            {s.raised}
            <b>{eurCents(data.totals.inCents, lang)}</b>
          </div>
          <div>
            {s.spent}
            <b>{eurCents(data.totals.outCents, lang)}</b>
          </div>
          <div>
            {s.available}
            <b>{eurCents(data.totals.inCents - data.totals.outCents, lang)}</b>
          </div>
        </div>
        {data.ledger.length === 0 ? (
          <div className="empty">{s.ledgerEmpty}</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">{s.colDate}</th>
                  <th scope="col">{s.colConcept}</th>
                  <th scope="col" className="r">
                    {s.colAmount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.ledger.map((row) => {
                  const concept =
                    row.kind === 'donations'
                      ? fill(s.ledgerDonations, { goal: goalTitle(t, row.goalKey, row.date, lang), n: row.people })
                      : row.concept
                  const key = row.kind === 'donations' ? `d-${row.goalKey}-${row.date}` : `e-${row.id}`
                  return (
                    <tr key={key}>
                      <td>{shortDate(row.date, lang)}</td>
                      <td>{concept}</td>
                      <td className={`r ${row.amountCents >= 0 ? 'in' : 'out'}`}>
                        {row.amountCents >= 0 ? '+' : '−'}
                        {eurCents(Math.abs(row.amountCents), lang)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
