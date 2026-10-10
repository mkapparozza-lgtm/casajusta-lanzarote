-- Mapa de denuncias: testimonios de residentes, anónimos y MODERADOS.
-- Nada se publica sin aprobación del admin. Sin nombre, email, IP ni dirección.
create table if not exists reports (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  municipio   text not null check (municipio in
                ('arrecife','haria','sanbartolome','teguise','tias','tinajo','yaiza')),
  -- Siempre el día 1: el mes, nunca la fecha exacta.
  month       date not null check (extract(day from month) = 1),
  category    text not null check (category in
                ('temporada','subida','honorarios','fianza','devolucion','reparaciones','anuncio','entrada','otro')),
  -- Ya limpio de emails, teléfonos y enlaces (scrubText) antes de guardar; el admin puede editarlo.
  body        text not null check (length(body) between 30 and 600),
  lang        text not null check (lang in ('es','it','en')),
  -- pending: en revisión · published: visible · rejected: descartado
  status      text not null default 'pending' check (status in ('pending','published','rejected')),
  published_at timestamptz,
  supports    integer not null default 0 check (supports >= 0),
  is_seed     boolean not null default false
);
create index if not exists reports_status on reports (status, published_at desc);

-- "A mí también me pasó": un apoyo por dispositivo y testimonio. El hash incluye el id del testimonio,
-- así no permite relacionar los apoyos de un mismo dispositivo entre testimonios distintos.
create table if not exists report_supports (
  report_id   bigint not null references reports(id) on delete cascade,
  device_hash text not null,
  created_at  timestamptz not null default now(),
  primary key (report_id, device_hash)
);
