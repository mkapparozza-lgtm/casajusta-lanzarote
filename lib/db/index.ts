import 'server-only'
import { createDb, migrate, type Db } from './core'

// Una sola conexión por proceso (sobrevive a la recarga en caliente de `next dev`).
const g = globalThis as unknown as { __cjDb?: Promise<Db> }

export function getDb(): Promise<Db> {
  g.__cjDb ??= (async () => {
    const db = await createDb()
    // En local se migra solo. En Neon las migraciones se lanzan con `npm run db:migrate`.
    if (db.kind === 'pglite') await migrate(db)
    return db
  })()
  return g.__cjDb
}

/** Incluir datos de ejemplo solo si se pide explícitamente (nunca por defecto). */
export function showSeedData(): boolean {
  return process.env.SHOW_SEED_DATA === 'true'
}
