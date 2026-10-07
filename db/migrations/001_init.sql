-- Casos anónimos del observatorio.
-- Por diseño NO hay nombre, email, dirección, IP ni texto libre.
create table if not exists cases (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  municipio   text not null check (municipio in
                ('arrecife','haria','sanbartolome','teguise','tias','tinajo','yaiza')),
  -- Siempre el día 1: nunca se guarda la fecha exacta.
  month       date not null check (extract(day from month) = 1),
  tipo        text not null check (tipo in ('vivienda','habitacion')),
  source      text not null check (source in ('pagado','pedido')),
  -- Obligatorio en vivienda completa; opcional en habitación.
  m2          integer check (m2 between 15 and 400),
  price       integer not null check (price between 100 and 6000),
  prev_price  integer check (
                prev_price is null
                or (source = 'pagado' and prev_price >= 100 and prev_price < price)),
  abuses      text[] not null default '{}' check (abuses <@ array[
                'temporada','subida','honorarios','fianza',
                'devolucion','reparaciones','anuncio','entrada']::text[]),
  verified    boolean not null default false,
  -- published: cuenta en las estadísticas · review: en cola por posible manipulación · discarded: descartado
  status      text not null default 'published' check (status in ('published','review','discarded')),
  -- Datos de ejemplo del script de seed. Nunca se muestran salvo con SHOW_SEED_DATA=true.
  is_seed     boolean not null default false,
  check (tipo = 'habitacion' or m2 is not null)
);
create index if not exists cases_month_status on cases (month, status);
create index if not exists cases_created_at on cases (created_at);

-- Límite de envíos por dispositivo. Solo un hash HMAC no reversible; se borra pasadas 24 h.
create table if not exists rate_limits (
  device_hash text primary key,
  last_at     timestamptz not null
);

-- Objetivos de apoyo. Títulos y textos viven en los diccionarios (clave `key`).
create table if not exists goals (
  id            serial primary key,
  key           text not null unique,
  position      integer not null,
  target_cents  integer not null check (target_cents > 0),
  recurring     boolean not null default false
);

insert into goals (key, position, target_cents, recurring) values
  ('legal',   1, 18000, false),
  ('informe', 2, 24000, true),
  ('campana', 3, 30000, false),
  ('tecnico', 4, 12000, false)
on conflict (key) do nothing;

-- Aportaciones puntuales (nunca suscripciones). Sin datos de quien aporta.
create table if not exists donations (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  goal_id       integer not null references goals(id),
  -- Mes al que se imputa (para objetivos recurrentes).
  period        date not null check (extract(day from period) = 1),
  amount_cents  integer not null check (amount_cents between 100 and 50000),
  provider      text not null check (provider in ('stripe','manual')),
  provider_ref  text unique,
  is_seed       boolean not null default false
);
create index if not exists donations_goal on donations (goal_id, period);

-- Movimientos publicados en "Cuentas claras" (gastos e ingresos que no son aportaciones web).
create table if not exists ledger_entries (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  entry_date    date not null,
  concept       text not null check (length(concept) between 3 and 200),
  amount_cents  integer not null check (amount_cents <> 0),
  is_seed       boolean not null default false
);
