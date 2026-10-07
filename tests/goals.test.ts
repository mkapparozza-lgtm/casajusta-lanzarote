import { describe, expect, it } from 'vitest'
import { resolveGoals, type GoalRow } from '@/lib/goals'

const goals: GoalRow[] = [
  { id: 1, key: 'legal', position: 1, targetCents: 18000, recurring: false },
  { id: 2, key: 'informe', position: 2, targetCents: 24000, recurring: true },
  { id: 3, key: 'campana', position: 3, targetCents: 30000, recurring: false },
]

describe('objetivos', () => {
  it('el activo es el primero sin completar', () => {
    const r = resolveGoals(goals, [{ goalId: 1, period: '2026-09', amountCents: 18000 }], '2026-10')
    expect(r.goals.map((g) => g.status)).toEqual(['done', 'now', 'next'])
    expect(r.active?.key).toBe('informe')
  })
  it('al completarse pasa al siguiente', () => {
    const r = resolveGoals(
      goals,
      [
        { goalId: 1, period: '2026-09', amountCents: 18000 },
        { goalId: 2, period: '2026-10', amountCents: 24000 },
      ],
      '2026-10',
    )
    expect(r.active?.key).toBe('campana')
  })
  it('el objetivo recurrente vuelve a empezar cada mes', () => {
    const r = resolveGoals(
      goals,
      [
        { goalId: 1, period: '2026-09', amountCents: 18000 },
        { goalId: 2, period: '2026-09', amountCents: 24000 },
      ],
      '2026-10',
    )
    expect(r.active?.key).toBe('informe')
    expect(r.active?.raisedCents).toBe(0)
  })
  it('sin objetivos pendientes no hay activo', () => {
    const r = resolveGoals(goals.slice(0, 1), [{ goalId: 1, period: '2026-09', amountCents: 20000 }], '2026-10')
    expect(r.active).toBeNull()
  })
})
