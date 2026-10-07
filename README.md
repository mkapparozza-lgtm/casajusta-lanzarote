# CasaJusta Lanzarote

Alquiler transparente para Lanzarote: evaluador, observatorio comunitario por municipio y apoyo por objetivos.
Next.js 16 (App Router) + TypeScript + Postgres (Neon).

## Desarrollo local

```bash
npm install
cp .env.example .env.local     # deja DATABASE_URL vacío para usar PGlite en local
npm run db:seed                # datos de EJEMPLO (is_seed = true)
npm run dev                    # http://localhost:3000/es
```

Sin `DATABASE_URL`, la base de datos es PGlite (Postgres en WASM) guardada en `./.pglite`.
Para ver los datos de ejemplo pon `SHOW_SEED_DATA=true` en `.env.local`.
No ejecutes `db:seed` con `next dev` abierto: PGlite no admite dos procesos a la vez.

Abre la web en `http://localhost:…`, no en `127.0.0.1`: el servidor de desarrollo bloquea la recarga
en caliente desde otro origen.

## Comprobaciones

```bash
npm test            # mediana, umbral de 5, ventanas de 3 meses, subida al renovar, objetivos
npm run typecheck
npm run build
```

## Deploy (Vercel + Neon)

1. Crea un proyecto en Neon y copia la cadena de conexión *pooled*.
2. `DATABASE_URL=… npm run db:migrate` (crea tablas y objetivos).
3. En Vercel, importa el repositorio y añade las variables de `.env.example`:
   `DATABASE_URL`, `DEVICE_HASH_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
   `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `SITE_URL`. Deja `SHOW_SEED_DATA` vacío y `DONATIONS_ENABLED=false`.
4. Conecta `casajustalanzarote.com` y redirige `sosalquilerlanzarote.online` al dominio principal.
5. Nunca ejecutes `db:seed` contra la base de producción. Si alguna vez se hizo: `npm run db:seed:clear`.

### Activar aportaciones (cuando haya una cuenta para recibirlas)

1. Claves de Stripe de la cuenta que recibirá las aportaciones: `STRIPE_SECRET_KEY`.
2. Webhook en Stripe → `https://casajustalanzarote.com/api/stripe/webhook`, eventos
   `checkout.session.completed` y `checkout.session.async_payment_succeeded`. Copia `STRIPE_WEBHOOK_SECRET`.
3. `DONATIONS_ENABLED=true` y redeploy.

## Panel de administración

`/es/admin` con `ADMIN_PASSWORD`. Permite revisar la cola de casos sospechosos, publicar, descartar,
marcar como verificados, cambiar importes de objetivos, registrar aportaciones recibidas fuera de la web
y publicar gastos en "Cuentas claras".
