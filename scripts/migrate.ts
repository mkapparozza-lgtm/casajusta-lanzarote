import { config } from 'dotenv'
config({ path: ['.env.local', '.env'], quiet: true })

const { createDb, migrate } = await import('../lib/db/core')

const db = await createDb()
const applied = await migrate(db)
console.log(
  `[${db.kind}] ${applied.length ? `Migraciones aplicadas: ${applied.join(', ')}` : 'Base de datos al día.'}`,
)
