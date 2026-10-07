import 'server-only'
import { getDb, showSeedData } from '@/lib/db'
import { resolveGoals, type GoalKey, type GoalRow, type GoalView } from '@/lib/goals'
import { currentMonth, type MonthKey } from '@/lib/months'

export type LedgerItem =
  | { kind: 'donations'; date: MonthKey; goalKey: GoalKey; people: number; amountCents: number }
  | { kind: 'entry'; id: number; date: string; concept: string; amountCents: number }

export type SupportData = {
  goals: GoalView[]
  active: GoalView | null
  currentMonth: MonthKey
  people: number
  ledger: LedgerItem[]
  totals: { inCents: number; outCents: number }
  donationsEnabled: boolean
  hasSeed: boolean
}

/** Muestra la sección "Haz oír nuestra voz" (objetivos y cuentas). Apagada por defecto (decisión oct-2026). */
export function supportSectionEnabled(): boolean {
  return process.env.SHOW_SUPPORT_SECTION === 'true'
}

export function donationsEnabled(): boolean {
  return (
    supportSectionEnabled() && process.env.DONATIONS_ENABLED === 'true' && Boolean(process.env.STRIPE_SECRET_KEY)
  )
}

export async function getGoalRows(): Promise<GoalRow[]> {
  const db = await getDb()
  const rows = await db.query<{ id: number; key: GoalKey; position: number; target_cents: number; recurring: boolean }>(
    'select id, key, position, target_cents, recurring from goals order by position',
  )
  return rows.map((r) => ({
    id: r.id,
    key: r.key,
    position: r.position,
    targetCents: r.target_cents,
    recurring: r.recurring,
  }))
}

export async function getActiveGoal(): Promise<GoalView | null> {
  const db = await getDb()
  const [goalRows, donations] = await Promise.all([getGoalRows(), loadDonationSums(db)])
  return resolveGoals(goalRows, donations, currentMonth()).active
}

type DbLike = Awaited<ReturnType<typeof getDb>>

async function loadDonationSums(db: DbLike) {
  const rows = await db.query<{ goal_id: number; period: string; amount_cents: string | number; people: string | number; is_seed: boolean }>(
    `select goal_id, to_char(period, 'YYYY-MM') as period, sum(amount_cents) as amount_cents,
            count(*) as people, bool_or(is_seed) as is_seed
       from donations where ($1 or not is_seed)
      group by goal_id, period order by period`,
    [showSeedData()],
  )
  return rows.map((r) => ({
    goalId: r.goal_id,
    period: r.period,
    amountCents: Number(r.amount_cents),
    people: Number(r.people),
    isSeed: r.is_seed,
  }))
}

export async function getSupportData(): Promise<SupportData> {
  const db = await getDb()
  const month = currentMonth()
  const [goalRows, sums, entries] = await Promise.all([
    getGoalRows(),
    loadDonationSums(db),
    db.query<{ id: number; entry_date: string; concept: string; amount_cents: number; is_seed: boolean }>(
      `select id, to_char(entry_date, 'YYYY-MM-DD') as entry_date, concept, amount_cents, is_seed
         from ledger_entries where ($1 or not is_seed) order by entry_date`,
      [showSeedData()],
    ),
  ])
  const { goals, active } = resolveGoals(goalRows, sums, month)
  const keyById = new Map(goalRows.map((g) => [g.id, g.key]))

  const ledger: LedgerItem[] = [
    ...sums.map(
      (s): LedgerItem => ({
        kind: 'donations',
        date: s.period,
        goalKey: keyById.get(s.goalId)!,
        people: s.people,
        amountCents: s.amountCents,
      }),
    ),
    ...entries.map(
      (e): LedgerItem => ({ kind: 'entry', id: e.id, date: e.entry_date, concept: e.concept, amountCents: e.amount_cents }),
    ),
  ].sort((a, b) => a.date.localeCompare(b.date))

  const inCents = ledger.reduce((s, l) => s + Math.max(0, l.amountCents), 0)
  const outCents = ledger.reduce((s, l) => s + Math.max(0, -l.amountCents), 0)

  return {
    goals,
    active,
    currentMonth: month,
    people: sums.reduce((s, d) => s + d.people, 0),
    ledger,
    totals: { inCents, outCents },
    donationsEnabled: donationsEnabled(),
    hasSeed: sums.some((s) => s.isSeed) || entries.some((e) => e.is_seed),
  }
}
