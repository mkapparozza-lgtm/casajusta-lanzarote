import { en } from './en'
import { es, type Dict } from './es'
import { it } from './it'
import type { Locale } from '../domain'

export type { Dict }

const dictionaries: Record<Locale, Dict> = { es, it, en }

export function getDict(locale: Locale): Dict {
  return dictionaries[locale]
}

/** Rellena {variables} en una plantilla. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
