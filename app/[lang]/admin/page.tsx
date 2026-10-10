import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { isLocale, municipioName, type MunicipioId } from '@/lib/domain'
import { eurCents } from '@/lib/format'
import { getDict } from '@/lib/i18n'
import { adminConfigured, isAdmin } from '@/lib/server/admin-auth'
import { getSupportData, supportSectionEnabled } from '@/lib/server/support'
import { LoginForm } from '@/components/admin/LoginForm'
import { goalTitle } from '@/components/support/Support'
import {
  addLedgerEntry,
  addManualDonation,
  deleteCase,
  deleteLedgerEntry,
  deleteReport,
  logout,
  saveReport,
  setCaseStatus,
  toggleVerified,
  updateGoalTarget,
} from './actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — CasaJusta', robots: { index: false, follow: false } }

type Tab = 'review' | 'published' | 'discarded' | 'reports' | 'support'
const TABS: { id: Tab; label: string }[] = [
  { id: 'reports', label: 'Testimonios por revisar' },
  { id: 'review', label: 'Casos en revisión' },
  { id: 'published', label: 'Casos publicados' },
  { id: 'discarded', label: 'Casos descartados' },
  { id: 'support', label: 'Objetivos y cuentas' },
]

type ReportStatus = 'pending' | 'published' | 'rejected'
const REPORT_VIEWS: { id: ReportStatus; label: string }[] = [
  { id: 'pending', label: 'Pendientes' },
  { id: 'published', label: 'Publicados' },
  { id: 'rejected', label: 'Rechazados' },
]

type CaseRow = {
  id: number
  created_at: string
  municipio: MunicipioId
  month: string
  tipo: string
  source: string
  m2: number | null
  price: number
  prev_price: number | null
  abuses: string[]
  other_text: string | null
  verified: boolean
  is_seed: boolean
}

export default async function AdminPage({ params, searchParams }: PageProps<'/[lang]/admin'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDict(lang)

  if (!adminConfigured())
    return (
      <main id="main" className="wrap admin">
        <h1>Panel de administración</h1>
        <p>{t.admin.notConfigured}</p>
      </main>
    )

  if (!(await isAdmin()))
    return (
      <main id="main" className="wrap admin">
        <h1>Panel de administración</h1>
        <LoginForm />
      </main>
    )

  const sp = await searchParams
  const tabs = TABS.filter((x) => x.id !== 'support' || supportSectionEnabled())
  const tab: Tab = tabs.some((x) => x.id === sp.tab) ? (sp.tab as Tab) : 'reports'
  const rview: ReportStatus = REPORT_VIEWS.some((x) => x.id === sp.rs) ? (sp.rs as ReportStatus) : 'pending'
  const db = await getDb()
  const [caseCounts] = await db.query<{ review: string; published: string; discarded: string }>(
    `select count(*) filter (where status = 'review') as review,
            count(*) filter (where status = 'published') as published,
            count(*) filter (where status = 'discarded') as discarded from cases`,
  )
  const [rc] = await db.query<{ n: string }>(`select count(*) as n from reports where status = 'pending'`)
  const counts: Record<string, string | undefined> = { ...caseCounts, reports: rc?.n }

  return (
    <main id="main" className="wrap admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h1>Panel de administración</h1>
        <form action={logout}>
          <button className="btn mini" type="submit">
            Salir
          </button>
        </form>
      </div>
      <nav className="admin-tabs" aria-label="Secciones">
        {tabs.map((x) => (
          <Link key={x.id} href={`/${lang}/admin?tab=${x.id}`} aria-current={tab === x.id ? 'page' : undefined}>
            {x.label}
            {counts[x.id] !== undefined ? ` (${counts[x.id]})` : ''}
          </Link>
        ))}
      </nav>
      {tab === 'support' ? (
        <SupportAdmin lang={lang} t={t} />
      ) : tab === 'reports' ? (
        <ReportsAdmin lang={lang} status={rview} />
      ) : (
        <CasesAdmin status={tab} />
      )}
    </main>
  )
}

async function ReportsAdmin({ lang, status }: { lang: string; status: ReportStatus }) {
  const db = await getDb()
  const rows = await db.query<{
    id: number
    created_at: string
    municipio: MunicipioId
    month: string
    category: string
    body: string
    lang: string
    supports: number
    is_seed: boolean
  }>(
    `select id, to_char(created_at at time zone 'Atlantic/Canary', 'YYYY-MM-DD HH24:MI') as created_at, municipio,
            to_char(month, 'YYYY-MM') as month, category, body, lang, supports, is_seed
       from reports where status = $1 order by created_at desc limit 200`,
    [status],
  )
  return (
    <>
      <nav className="admin-tabs" aria-label="Estado de los testimonios">
        {REPORT_VIEWS.map((v) => (
          <Link key={v.id} href={`/${lang}/admin?tab=reports&rs=${v.id}`} aria-current={status === v.id ? 'page' : undefined}>
            {v.label}
          </Link>
        ))}
      </nav>
      <p className="lead" style={{ color: 'var(--muted)' }}>
        Antes de publicar, quita del texto nombres de personas, propietarios, empresas o agencias, direcciones y cualquier dato
        que identifique a alguien. Publica solo testimonios en primera persona y sin acusaciones a terceros identificables.
      </p>
      {rows.length === 0 ? (
        <div className="empty">No hay testimonios.</div>
      ) : (
        rows.map((r) => (
          <form key={r.id} action={saveReport} className="card" style={{ marginBottom: 14 }}>
            <input type="hidden" name="id" value={r.id} />
            <p style={{ margin: '0 0 8px', fontSize: 13 }}>
              <b>{municipioName(r.municipio)}</b> · {r.category} · mes {r.month} · enviado {r.created_at} · idioma {r.lang}
              {status === 'published' && ` · ${r.supports} apoyos`} {r.is_seed && <span className="pill seed">ejemplo</span>}
            </p>
            <textarea
              name="body"
              defaultValue={r.body}
              rows={4}
              minLength={30}
              maxLength={600}
              aria-label="Texto del testimonio"
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line)', font: 'inherit' }}
            />
            <div className="admin-form" style={{ marginTop: 8 }}>
              <button className="btn mini btn-primary" type="submit" name="status" value="published">
                {status === 'published' ? 'Guardar cambios' : 'Publicar'}
              </button>
              {status !== 'rejected' && (
                <button className="btn mini" type="submit" name="status" value="rejected">
                  Rechazar
                </button>
              )}
              {status !== 'pending' && (
                <button className="btn mini" type="submit" name="status" value="pending">
                  Volver a pendientes
                </button>
              )}
              {status === 'rejected' && (
                <button className="btn mini" type="submit" formAction={deleteReport}>
                  Borrar definitivamente
                </button>
              )}
            </div>
          </form>
        ))
      )}
    </>
  )
}

async function CasesAdmin({ status }: { status: Exclude<Tab, 'support' | 'reports'> }) {
  const db = await getDb()
  const rows = await db.query<CaseRow>(
    `select id, to_char(created_at at time zone 'Atlantic/Canary', 'YYYY-MM-DD HH24:MI') as created_at, municipio,
            to_char(month, 'YYYY-MM') as month, tipo, source, m2, price, prev_price, abuses, other_text, verified, is_seed
       from cases where status = $1 order by created_at desc limit 300`,
    [status],
  )
  const help = {
    review: 'Casos retenidos por la detección de picos. No cuentan en las estadísticas hasta que los publiques.',
    published: 'Casos que cuentan en las estadísticas. Marca como verificados los que tengan documentación revisada.',
    discarded: 'Casos descartados. No cuentan en nada y se pueden borrar definitivamente.',
  }[status]

  return (
    <>
      <p className="lead" style={{ color: 'var(--muted)' }}>
        {help} Se muestran los 300 más recientes.
      </p>
      {rows.length === 0 ? (
        <div className="empty">No hay casos.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Enviado</th>
                <th>Municipio</th>
                <th>Mes</th>
                <th>Tipo</th>
                <th>Origen</th>
                <th className="r">m²</th>
                <th className="r">Precio</th>
                <th className="r">Antes</th>
                <th>Abusos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.created_at} {c.is_seed && <span className="pill seed">ejemplo</span>}
                  </td>
                  <td>{municipioName(c.municipio)}</td>
                  <td>{c.month}</td>
                  <td>{c.tipo}</td>
                  <td>{c.source}</td>
                  <td className="r">{c.m2 ?? '—'}</td>
                  <td className="r">{c.price} €</td>
                  <td className="r">{c.prev_price ? `${c.prev_price} €` : '—'}</td>
                  <td style={{ maxWidth: 280 }}>
                    {c.abuses.join(', ') || '—'}
                    {c.other_text && (
                      <>
                        <br />
                        <em style={{ color: 'var(--muted)' }}>«{c.other_text}»</em>
                      </>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {status !== 'published' && <StatusButton id={c.id} status="published" label="Publicar" />}
                    {status !== 'discarded' && <StatusButton id={c.id} status="discarded" label="Descartar" />}
                    {status === 'published' && (
                      <form action={toggleVerified}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="btn mini" type="submit">
                          {c.verified ? '✓ Verificado' : 'Verificar'}
                        </button>
                      </form>
                    )}
                    {status === 'discarded' && (
                      <form action={deleteCase}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="btn mini" type="submit">
                          Borrar
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function StatusButton({ id, status, label }: { id: number; status: string; label: string }) {
  return (
    <form action={setCaseStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className="btn mini" type="submit">
        {label}
      </button>
    </form>
  )
}

async function SupportAdmin({ lang, t }: { lang: 'es' | 'it' | 'en'; t: ReturnType<typeof getDict> }) {
  const data = await getSupportData()
  const today = new Date().toISOString().slice(0, 10)
  return (
    <>
      <h2>Objetivos</h2>
      <p style={{ color: 'var(--muted)' }}>
        El orden y los textos están en el código (diccionarios). Aquí se cambia el importe de cada objetivo. Ahora mismo hay{' '}
        {data.people} aportaciones registradas.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Objetivo</th>
              <th>Estado</th>
              <th className="r">Recaudado</th>
              <th>Importe objetivo (€)</th>
            </tr>
          </thead>
          <tbody>
            {data.goals.map((g) => (
              <tr key={g.id}>
                <td>
                  {goalTitle(t, g.key, data.currentMonth, lang)}
                  {g.recurring && ' (mensual)'}
                </td>
                <td>{g.status}</td>
                <td className="r">{eurCents(g.raisedCents, lang)}</td>
                <td>
                  <form action={updateGoalTarget} className="admin-form">
                    <input type="hidden" name="id" value={g.id} />
                    <input name="target" type="number" min={1} step="1" defaultValue={g.targetCents / 100} aria-label="Importe objetivo" />
                    <button className="btn mini" type="submit">
                      Guardar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Registrar una aportación recibida fuera de la web</h2>
      <form action={addManualDonation} className="admin-form">
        <label>
          Objetivo
          <select name="goal" defaultValue={data.active?.id}>
            {data.goals.map((g) => (
              <option key={g.id} value={g.id}>
                {goalTitle(t, g.key, data.currentMonth, lang)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Importe (€)
          <input name="amount" type="number" min={1} max={500} step="0.01" required />
        </label>
        <button className="btn btn-primary" type="submit">
          Añadir
        </button>
      </form>

      <h2>Cuentas claras: añadir movimiento</h2>
      <p style={{ color: 'var(--muted)' }}>
        Las aportaciones por web se suman solas. Aquí van los gastos (pagos a proveedores) y otros ingresos. Todo lo que añadas
        se publica.
      </p>
      <form action={addLedgerEntry} className="admin-form">
        <label>
          Fecha
          <input name="date" type="date" defaultValue={today} required />
        </label>
        <label style={{ flex: '1 1 260px' }}>
          Concepto (público)
          <input name="concept" minLength={3} maxLength={200} required />
        </label>
        <label>
          Tipo
          <select name="kind" defaultValue="out">
            <option value="out">Gasto</option>
            <option value="in">Ingreso</option>
          </select>
        </label>
        <label>
          Importe (€)
          <input name="amount" type="number" min={0.01} step="0.01" required />
        </label>
        <button className="btn btn-primary" type="submit">
          Publicar movimiento
        </button>
      </form>

      <h2>Movimientos publicados</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th className="r">Importe</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.ledger.map((row) => (
              <tr key={row.kind === 'entry' ? `e${row.id}` : `d${row.goalKey}${row.date}`}>
                <td>{row.date}</td>
                <td>
                  {row.kind === 'entry'
                    ? row.concept
                    : `Aportaciones: ${goalTitle(t, row.goalKey, row.date, lang)} (${row.people})`}
                </td>
                <td className={`r ${row.amountCents >= 0 ? 'in' : 'out'}`}>{eurCents(row.amountCents, lang)}</td>
                <td>
                  {row.kind === 'entry' && (
                    <form action={deleteLedgerEntry}>
                      <input type="hidden" name="id" value={row.id} />
                      <button className="btn mini" type="submit">
                        Borrar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
