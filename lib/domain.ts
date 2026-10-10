// Vocabulario compartido entre servidor y cliente. Sin dependencias de Node.

export const MUNICIPIOS = [
  { id: 'arrecife', name: 'Arrecife', row: 2, col: 3 },
  { id: 'haria', name: 'Haría', row: 1, col: 4 },
  { id: 'sanbartolome', name: 'San Bartolomé', row: 2, col: 2 },
  { id: 'teguise', name: 'Teguise', row: 1, col: 3 },
  { id: 'tias', name: 'Tías', row: 3, col: 2 },
  { id: 'tinajo', name: 'Tinajo', row: 2, col: 1 },
  { id: 'yaiza', name: 'Yaiza', row: 3, col: 1 },
] as const

export type MunicipioId = (typeof MUNICIPIOS)[number]['id']
export const MUNICIPIO_IDS = MUNICIPIOS.map((m) => m.id) as MunicipioId[]

export function isMunicipio(v: unknown): v is MunicipioId {
  return typeof v === 'string' && (MUNICIPIO_IDS as string[]).includes(v)
}

export function municipioName(id: MunicipioId): string {
  return MUNICIPIOS.find((m) => m.id === id)?.name ?? id
}

export const ABUSE_IDS = [
  'temporada',
  'subida',
  'honorarios',
  'fianza',
  'devolucion',
  'reparaciones',
  'anuncio',
  'entrada',
  'otro',
] as const

export type AbuseId = (typeof ABUSE_IDS)[number]

export function isAbuse(v: unknown): v is AbuseId {
  return typeof v === 'string' && (ABUSE_IDS as readonly string[]).includes(v)
}

export type Tipo = 'vivienda' | 'habitacion'
export type Source = 'pagado' | 'pedido'

/** Umbral de anonimato: nada se publica con menos de MIN casos detrás. */
export const MIN_CASES = 5
/** Valores de €/m² fuera de este rango se descartan como errores o manipulación. */
export const MIN_EUR_M2 = 4
export const MAX_EUR_M2 = 45
/** Meses que abarca cada ventana móvil. */
export const WINDOW_MONTHS = 3
/** Periodos seleccionables (meses finales). */
export const PERIODS = 6

export const LIMITS = {
  m2: { min: 15, max: 400 },
  price: { min: 100, max: 6000 },
  donation: { min: 1, max: 500 },
  otherText: { min: 3, max: 200 },
  report: { min: 30, max: 600 },
} as const

/** Quita emails, enlaces y teléfonos de un texto libre y normaliza espacios, recortando a `max`. */
export function scrubText(input: string, max: number): string {
  return input
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[email]')
    .replace(/(https?:\/\/|www\.)\S+/gi, '[enlace]')
    .replace(/\+?\d[\d\s.-]{7,}\d/g, '[teléfono]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/**
 * Limpia el texto libre de "Otro": quita emails, teléfonos y enlaces antes de guardarlo.
 * Ese texto nunca se publica (solo lo ve el admin), pero así se reduce el riesgo de que contenga datos personales.
 */
export function scrubOtherText(input: string): string {
  return scrubText(input, LIMITS.otherText.max)
}

export type Locale = 'es' | 'it' | 'en'
export const LOCALES: Locale[] = ['es', 'it', 'en']
export const DEFAULT_LOCALE: Locale = 'es'
export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as string[]).includes(v)
}
export const INTL_LOCALE: Record<Locale, string> = { es: 'es-ES', it: 'it-IT', en: 'en-GB' }
