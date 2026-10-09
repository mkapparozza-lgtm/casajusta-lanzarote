import type { Locale } from '../domain'

// Artículos de actualidad. Texto plano estructurado (sin HTML) para evitar inyecciones y mantener el estilo.
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'quote'; text: string; cite: string }
  | { t: 'note'; text: string }

export type ArticleText = {
  title: string
  /** Resumen para Google y la lista (máx. ~155 caracteres). */
  description: string
  body: Block[]
}

export type Source = { name: string; title: string; url: string; date: string }

export type Article = {
  slug: string
  /** AAAA-MM-DD */
  date: string
  updated?: string
  i18n: Record<Locale, ArticleText>
  /** Fuentes verificadas que respaldan el texto. Obligatorias: no se publica nada sin fuente. */
  sources: Source[]
}
