// Datos de EJEMPLO para desarrollo. Todos llevan is_seed = true y solo se muestran
// con SHOW_SEED_DATA=true. Nunca ejecutar contra la base de datos de producción.
//
//   npm run db:seed          → borra los datos de ejemplo anteriores e inserta nuevos
//   npm run db:seed:clear    → solo borra los datos de ejemplo

import { config } from 'dotenv'
config({ path: ['.env.local', '.env'], quiet: true })

const { createDb, migrate } = await import('../lib/db/core')
const { ABUSE_IDS, MUNICIPIOS } = await import('../lib/domain')
const { addMonths, currentMonth, monthToDate } = await import('../lib/months')

const clearOnly = process.argv.includes('--clear')

if (process.env.NODE_ENV === 'production') {
  console.error('Seed bloqueado: NODE_ENV=production.')
  process.exit(1)
}
if (process.env.DATABASE_URL && process.env.SEED_ALLOW_REMOTE !== 'true' && !clearOnly) {
  console.error(
    'Hay DATABASE_URL: para sembrar datos de ejemplo en una base remota (p. ej. una rama de desarrollo de Neon)\n' +
      'añade SEED_ALLOW_REMOTE=true. No lo hagas nunca en la base de producción.',
  )
  process.exit(1)
}

const db = await createDb()
await migrate(db)

await db.query('delete from donations where is_seed')
await db.query('delete from ledger_entries where is_seed')
const removed = await db.query<{ id: number }>('delete from cases where is_seed returning id')
console.log(`[${db.kind}] Datos de ejemplo borrados (${removed.length} casos).`)
if (clearOnly) process.exit(0)

// Generador determinista: los mismos datos en cada ejecución.
function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const R = rng(20261007)

// Base de €/m² y volumen mensual de casos por municipio (inventados, solo para probar la interfaz).
const PROFILE: Record<string, { base: number; n: number }> = {
  teguise: { base: 13.4, n: 9 },
  haria: { base: 11.2, n: 1 },
  tinajo: { base: 10.6, n: 3 },
  sanbartolome: { base: 11.3, n: 8 },
  arrecife: { base: 12.6, n: 22 },
  yaiza: { base: 15.1, n: 10 },
  tias: { base: 14.6, n: 13 },
}
// Mismo orden que ABUSE_IDS (el último es "otro").
const ABUSE_WEIGHTS = [0.26, 0.2, 0.15, 0.12, 0.1, 0.09, 0.05, 0.03, 0.04]
function pickAbuse(): string {
  let x = R() * ABUSE_WEIGHTS.reduce((a, b) => a + b, 0)
  for (let i = 0; i < ABUSE_IDS.length; i++) {
    x -= ABUSE_WEIGHTS[i]!
    if (x <= 0) return ABUSE_IDS[i]!
  }
  return ABUSE_IDS[0]
}

const latest = currentMonth()
const MONTHS = 8
const rows: unknown[][] = []
for (let i = 0; i < MONTHS; i++) {
  const month = addMonths(latest, i - MONTHS + 1)
  for (const mu of MUNICIPIOS) {
    const p = PROFILE[mu.id]!
    const count = Math.max(0, Math.round(p.n * (0.75 + R() * 0.5) * (1 + i * 0.06)))
    for (let k = 0; k < count; k++) {
      const room = R() < 0.15
      const paid = R() < 0.68
      let m2: number | null = null
      let price: number
      if (room) {
        price = Math.round((420 + R() * 220) * (paid ? 1 : 1.1) / 5) * 5
      } else {
        m2 = Math.round(38 + R() * 62)
        const e = p.base * (1 + i * 0.008) * (0.82 + R() * 0.36) * (paid ? 1 : 1.13 + R() * 0.06)
        price = Math.round((m2 * e) / 5) * 5
      }
      let prev: number | null = null
      if (paid && R() < 0.45) {
        const inc = 0.06 + R() * 0.24 + i * 0.006
        prev = Math.round(price / (1 + inc) / 5) * 5
      }
      const abuses: string[] = []
      if (R() < 0.62) {
        abuses.push(pickAbuse())
        if (R() < 0.3) {
          const b = pickAbuse()
          if (!abuses.includes(b)) abuses.push(b)
        }
      }
      rows.push([mu.id, monthToDate(month), room ? 'habitacion' : 'vivienda', paid ? 'pagado' : 'pedido', m2, price, prev, abuses, R() < 0.2])
    }
  }
}

for (const r of rows) {
  await db.query(
    `insert into cases (municipio, month, tipo, source, m2, price, prev_price, abuses, verified, is_seed)
     values ($1, $2, $3, $4, $5, $6, $7, $8::text[], $9, true)`,
    r,
  )
}

// Aportaciones y movimientos de ejemplo.
const goals = await db.query<{ id: number; key: string }>('select id, key from goals')
const goalId = (key: string) => goals.find((g) => g.key === key)!.id
async function donate(key: string, period: string, totalCents: number, people: number) {
  let left = totalCents
  for (let i = 0; i < people; i++) {
    const amount = i === people - 1 ? left : Math.min(left - (people - i - 1) * 100, [300, 500, 1000][Math.floor(R() * 3)]!)
    left -= amount
    await db.query(
      `insert into donations (goal_id, period, amount_cents, provider, is_seed) values ($1, $2, $3, 'manual', true)`,
      [goalId(key), monthToDate(period), amount],
    )
  }
}
const prevMonth = addMonths(latest, -1)
await donate('legal', prevMonth, 18000, 23)
await donate('informe', latest, 15200, 38)
await db.query(
  `insert into ledger_entries (entry_date, concept, amount_cents, is_seed) values ($1, $2, $3, true)`,
  [`${prevMonth}-18`, 'Pago al despacho por la revisión legal de las cartas (EJEMPLO)', -18000],
)

console.log(`[${db.kind}] Insertados ${rows.length} casos, 61 aportaciones y 1 movimiento de EJEMPLO.`)
console.log('Recuerda: solo se ven con SHOW_SEED_DATA=true.')
