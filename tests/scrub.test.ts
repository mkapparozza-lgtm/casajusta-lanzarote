import { describe, expect, it } from 'vitest'
import { scrubOtherText } from '@/lib/domain'

describe('texto libre de "Otro"', () => {
  it('borra emails, teléfonos y enlaces', () => {
    const out = scrubOtherText('Escribidme a pepe.perez@gmail.com o al +34 685 568 333, ver https://idealista.com/x')
    expect(out).not.toMatch(/@|685|idealista/)
    expect(out).toContain('[email]')
    expect(out).toContain('[teléfono]')
    expect(out).toContain('[enlace]')
  })
  it('no toca importes ni metros normales', () => {
    expect(scrubOtherText('Me piden 1200 € por 70 m2')).toBe('Me piden 1200 € por 70 m2')
  })
  it('recorta a 200 caracteres y limpia espacios', () => {
    expect(scrubOtherText('  a\n\nb  ')).toBe('a b')
    expect(scrubOtherText('x'.repeat(500))).toHaveLength(200)
  })
})
