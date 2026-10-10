import { describe, expect, it } from 'vitest'
import { assessListing, checkPrice } from '@/lib/scam'

describe('comprobador de anuncios', () => {
  it('pedir dinero antes de visitar ya es riesgo alto', () => {
    expect(assessListing({ payBefore: 'yes' }).risk).toBe('high')
  })
  it('dos señales leves son riesgo medio, tres son alto', () => {
    expect(assessListing({ rush: 'yes', video: 'yes' }).risk).toBe('medium')
    expect(assessListing({ rush: 'yes', video: 'yes', docs: 'yes' }).risk).toBe('high')
  })
  it('todo "no" es riesgo bajo', () => {
    expect(assessListing({ payBefore: 'no', away: 'no', rush: 'no' })).toMatchObject({ risk: 'low', flags: [] })
  })
  it('"no lo sé" en una señal grave sube a medio', () => {
    expect(assessListing({ payBefore: 'unsure' }).risk).toBe('medium')
    expect(assessListing({ rush: 'unsure' }).risk).toBe('low')
  })
  it('precio muy bajo cuenta como señal', () => {
    // Arrecife: mediana Hacienda 7,1 €/m² → 70 m² ≈ 497 €; 300 € es < 75%
    const r = assessListing({}, { municipio: 'arrecife', tipo: 'vivienda', m2: 70, price: 300 })
    expect(r.flags).toContain('cheap')
    expect(r.risk).toBe('medium')
  })
  it('habitación a 500 € no es estafa: es cara pero en la media', () => {
    expect(checkPrice({ municipio: 'tias', tipo: 'habitacion', m2: null, price: 500 })).toEqual({ kind: 'roomHigh' })
    expect(checkPrice({ municipio: 'tias', tipo: 'habitacion', m2: null, price: 200 })?.kind).toBe('cheap')
  })
  it('sin precio no hay comprobación de precio', () => {
    expect(checkPrice({ municipio: 'tias', tipo: 'vivienda', m2: null, price: 900 })).toBeNull()
  })
})
