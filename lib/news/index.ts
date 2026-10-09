import { acampadaArrecife } from './articles/acampada-arrecife'
import { contratosTemporada } from './articles/contratos-temporada'
import { hacienda2024 } from './articles/hacienda-2024'
import { playaBlanca } from './articles/playa-blanca'
import type { Article } from './types'

export type { Article, Block, Source } from './types'

// Para publicar un artículo nuevo: crear lib/news/articles/<nombre>.ts (con fuentes) y añadirlo aquí.
const ALL: Article[] = [acampadaArrecife, playaBlanca, hacienda2024, contratosTemporada]

/** Más recientes primero (a igual fecha, el orden de ALL). */
export const ARTICLES: Article[] = ALL.map((a, i) => ({ a, i }))
  .sort((x, y) => y.a.date.localeCompare(x.a.date) || x.i - y.i)
  .map(({ a }) => a)

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}
