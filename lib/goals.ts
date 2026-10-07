// Lógica de objetivos de apoyo. Pura y compartida: sin acceso a la base de datos.

import type { MonthKey } from './months'

export const GOAL_KEYS = ['legal', 'informe', 'campana', 'tecnico'] as const
export type GoalKey = (typeof GOAL_KEYS)[number]

export type GoalRow = {
  id: number
  key: GoalKey
  position: number
  targetCents: number
  /** Un objetivo recurrente vuelve a empezar cada mes. */
  recurring: boolean
}

export type DonationRow = { goalId: number; period: MonthKey; amountCents: number }

export type GoalStatus = 'done' | 'now' | 'next'

export type GoalView = GoalRow & { raisedCents: number; status: GoalStatus }

/**
 * El objetivo activo es el primero (por posición) que aún no ha llegado a su meta.
 * Un objetivo recurrente solo cuenta lo aportado en el mes en curso, así que vuelve
 * a quedar pendiente cada mes y pasa por delante de los que van detrás.
 */
export function resolveGoals(
  goals: readonly GoalRow[],
  donations: readonly DonationRow[],
  current: MonthKey,
): { goals: GoalView[]; active: GoalView | null } {
  const sorted = [...goals].sort((a, b) => a.position - b.position)
  let active: GoalView | null = null
  const views = sorted.map((g): GoalView => {
    const raisedCents = donations
      .filter((d) => d.goalId === g.id && (!g.recurring || d.period === current))
      .reduce((s, d) => s + d.amountCents, 0)
    const done = raisedCents >= g.targetCents
    const view: GoalView = { ...g, raisedCents, status: done ? 'done' : active ? 'next' : 'now' }
    if (!done && !active) active = view
    return view
  })
  return { goals: views, active }
}
