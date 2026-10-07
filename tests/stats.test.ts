import { describe, expect, it } from 'vitest'
import {
  buildObservatory,
  communityReference,
  inWindow,
  isPlausible,
  median,
  renewalIncrease,
  scopeStats,
  type CaseRecord,
} from '@/lib/stats'
import { addMonths, monthsEndingAt } from '@/lib/months'

function c(over: Partial<CaseRecord> = {}): CaseRecord {
  return {
    municipio: 'arrecife',
    month: '2026-09',
    tipo: 'vivienda',
    source: 'pagado',
    m2: 70,
    price: 900,
    prevPrice: null,
    abuses: [],
    ...over,
  }
}

const many = (k: number, over: Partial<CaseRecord> = {}) => Array.from({ length: k }, () => c(over))

describe('median', () => {
  it('devuelve null sin valores', () => expect(median([])).toBeNull())
  it('impar: el valor central', () => expect(median([9, 1, 5])).toBe(5))
  it('par: media de los dos centrales', () => expect(median([4, 1, 3, 2])).toBe(2.5))
  it('no la mueve un valor absurdo (a diferencia de la media)', () => {
    expect(median([10, 11, 12, 13, 1000])).toBe(12)
  })
  it('no modifica el array original', () => {
    const a = [3, 1, 2]
    median(a)
    expect(a).toEqual([3, 1, 2])
  })
})

describe('ventanas de 3 meses', () => {
  it('incluye el mes final y los dos anteriores', () => {
    expect(inWindow('2026-09', '2026-09')).toBe(true)
    expect(inWindow('2026-07', '2026-09')).toBe(true)
    expect(inWindow('2026-06', '2026-09')).toBe(false)
    expect(inWindow('2026-10', '2026-09')).toBe(false)
  })
  it('cruza el cambio de año', () => {
    expect(inWindow('2025-11', '2026-01')).toBe(true)
    expect(inWindow('2025-10', '2026-01')).toBe(false)
  })
  it('addMonths y monthsEndingAt', () => {
    expect(addMonths('2026-01', -1)).toBe('2025-12')
    expect(addMonths('2025-12', 1)).toBe('2026-01')
    expect(monthsEndingAt('2026-02', 3)).toEqual(['2025-12', '2026-01', '2026-02'])
  })
  it('scopeStats solo cuenta casos de la ventana', () => {
    const cases = [...many(5, { month: '2026-09' }), ...many(10, { month: '2026-05' })]
    expect(scopeStats(cases, '2026-09', null).n).toBe(5)
    expect(scopeStats(cases, '2026-11', null).n).toBe(5) // sep–nov
    expect(scopeStats(cases, '2026-08', null).n).toBeNull() // jun–ago: vacío
    expect(scopeStats(cases, '2026-07', null).n).toBe(10) // may–jul
  })
})

describe('umbral mínimo de 5 casos', () => {
  it('con 4 casos no se publica nada', () => {
    const s = scopeStats(many(4), '2026-09', 'arrecife')
    expect(s).toEqual({ n: null, paid: null, asked: null, renewal: null, abuseShare: null, abuseCounts: null })
  })
  it('con 5 casos se publica', () => {
    const s = scopeStats(many(5), '2026-09', 'arrecife')
    expect(s.n).toBe(5)
    expect(s.paid?.value).toBeCloseTo(900 / 70)
    expect(s.paid?.n).toBe(5)
  })
  it('cada métrica necesita sus propios 5 valores', () => {
    const cases = [...many(5, { source: 'pagado' }), ...many(4, { source: 'pedido', price: 1200 })]
    const s = scopeStats(cases, '2026-09', null)
    expect(s.n).toBe(9)
    expect(s.paid).not.toBeNull()
    expect(s.asked).toBeNull()
    expect(s.renewal).toBeNull()
  })
  it('un municipio por debajo del umbral cuenta en el total de la isla', () => {
    const cases = [...many(3, { municipio: 'haria' }), ...many(5, { municipio: 'arrecife' })]
    const data = buildObservatory(cases, '2026-09')
    expect(data.stats['2026-09']!.haria.n).toBeNull()
    expect(data.stats['2026-09']!.arrecife.n).toBe(5)
    expect(data.stats['2026-09']!.island.n).toBe(8)
  })
  it('buildObservatory genera 6 periodos', () => {
    expect(buildObservatory([], '2026-09').periods).toEqual([
      '2026-04',
      '2026-05',
      '2026-06',
      '2026-07',
      '2026-08',
      '2026-09',
    ])
  })
})

describe('valores fuera de escala', () => {
  it('descarta €/m² < 4 o > 45', () => {
    expect(isPlausible(c({ price: 200, m2: 100 }))).toBe(false) // 2 €/m²
    expect(isPlausible(c({ price: 4000, m2: 50 }))).toBe(false) // 80 €/m²
    expect(isPlausible(c({ price: 400, m2: 100 }))).toBe(true) // 4 €/m² exacto
    expect(isPlausible(c({ tipo: 'habitacion', m2: null, price: 450 }))).toBe(true)
  })
  it('un caso descartado no cuenta para el umbral', () => {
    const cases = [...many(4), c({ price: 6000, m2: 20 })]
    expect(scopeStats(cases, '2026-09', null).n).toBeNull()
  })
})

describe('subida al renovar', () => {
  it('precio / precio anterior − 1', () => {
    expect(renewalIncrease(c({ price: 1100, prevPrice: 1000 }))).toBeCloseTo(0.1)
  })
  it('ignora pedidos, ausencia de precio anterior y bajadas', () => {
    expect(renewalIncrease(c({ source: 'pedido', prevPrice: 800 }))).toBeNull()
    expect(renewalIncrease(c({ prevPrice: null }))).toBeNull()
    expect(renewalIncrease(c({ price: 900, prevPrice: 900 }))).toBeNull()
  })
  it('mediana de las subidas con umbral propio', () => {
    const subidas = [0.05, 0.1, 0.2, 0.3, 0.5].map((r) => c({ prevPrice: 1000, price: Math.round(1000 * (1 + r)) }))
    const s = scopeStats(subidas, '2026-09', null)
    expect(s.renewal?.value).toBeCloseTo(0.2)
    expect(s.renewal?.n).toBe(5)
    expect(scopeStats(subidas.slice(0, 4).concat(c()), '2026-09', null).renewal).toBeNull()
  })
})

describe('abusos', () => {
  it('porcentaje de casos con al menos un abuso y recuento por tipo', () => {
    const cases = [
      c({ abuses: ['temporada', 'fianza'] }),
      c({ abuses: ['temporada'] }),
      c({ abuses: [] }),
      c({ abuses: [] }),
      c({ abuses: ['temporada', 'temporada'] }),
    ]
    const s = scopeStats(cases, '2026-09', null)
    expect(s.abuseShare).toBeCloseTo(3 / 5)
    expect(s.abuseCounts?.temporada).toBe(3)
    expect(s.abuseCounts?.fianza).toBe(1)
  })
})

describe('referencia de la comunidad para el evaluador', () => {
  it('usa solo contratos de los últimos 6 meses del municipio', () => {
    const cases = [
      ...many(5, { month: '2026-04', price: 700 }),
      ...many(5, { month: '2026-03', price: 2000 }), // fuera de la ventana
      ...many(5, { source: 'pedido', price: 2000 }),
      ...many(5, { municipio: 'tias', price: 2000 }),
    ]
    const ref = communityReference(cases, '2026-09', 'arrecife')
    expect(ref.vivienda?.value).toBeCloseTo(10)
    expect(ref.vivienda?.n).toBe(5)
    expect(ref.habitacion).toBeNull()
  })
  it('sin 5 contratos no hay referencia', () => {
    expect(communityReference(many(4), '2026-09', 'arrecife').vivienda).toBeNull()
  })
})
