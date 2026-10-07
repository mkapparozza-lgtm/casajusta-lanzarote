// Acceso a Postgres. En producción: Neon (DATABASE_URL). En local sin DATABASE_URL:
// PGlite, un Postgres real en WASM guardado en ./.pglite, con el mismo SQL.
// Este módulo no importa 'server-only' para poder usarlo también desde los scripts.

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

type Row = Record<string, unknown>

export type Db = {
  kind: 'neon' | 'pglite'
  query<T = Row>(text: string, params?: unknown[]): Promise<T[]>
  /** Varias sentencias sin parámetros (migraciones). */
  exec(text: string): Promise<void>
}

async function createNeon(url: string): Promise<Db> {
  const { neon, Pool } = await import('@neondatabase/serverless')
  const sql = neon(url)
  return {
    kind: 'neon',
    async query<T>(text: string, params: unknown[] = []) {
      return (await sql.query(text, params)) as T[]
    },
    async exec(text: string) {
      const pool = new Pool({ connectionString: url })
      try {
        await pool.query(text)
      } finally {
        await pool.end()
      }
    },
  }
}

async function createPglite(): Promise<Db> {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PGLITE !== 'true') {
    throw new Error('Falta DATABASE_URL. PGlite solo está pensado para desarrollo local.')
  }
  const { PGlite } = await import('@electric-sql/pglite')
  const pg = new PGlite(path.join(process.cwd(), '.pglite'))
  await pg.waitReady
  return {
    kind: 'pglite',
    async query<T>(text: string, params: unknown[] = []) {
      return (await pg.query<T>(text, params)).rows
    },
    async exec(text: string) {
      await pg.exec(text)
    },
  }
}

export async function createDb(): Promise<Db> {
  const url = process.env.DATABASE_URL
  return url ? createNeon(url) : createPglite()
}

/** Aplica en orden las migraciones de db/migrations que aún no se hayan aplicado. */
export async function migrate(db: Db): Promise<string[]> {
  await db.exec(`create table if not exists schema_migrations (
    name text primary key, applied_at timestamptz not null default now())`)
  const done = new Set((await db.query<{ name: string }>('select name from schema_migrations')).map((r) => r.name))
  const dir = path.join(process.cwd(), 'db', 'migrations')
  const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()
  const applied: string[] = []
  for (const f of files) {
    if (done.has(f)) continue
    await db.exec(await readFile(path.join(dir, f), 'utf8'))
    await db.query('insert into schema_migrations (name) values ($1)', [f])
    applied.push(f)
  }
  return applied
}
