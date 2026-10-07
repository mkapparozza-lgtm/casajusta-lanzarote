@AGENTS.md

# CasaJusta Lanzarote

Plataforma comunitaria y sin ánimo de lucro de sensibilización sobre el precio del alquiler en Lanzarote.
Brand principal: CasaJusta Lanzarote. Nombre de campaña/hashtag: SOS Alquiler Lanzarote.
CasaJusta NO es una asociación (ni empresa): es un proyecto ciudadano. Nunca escribir "Asociación
CasaJusta" (decisión del usuario, oct-2026). El titular legal es la persona responsable (`lib/site.ts`).
El usuario habla italiano: explicarle todo en italiano.

## Dominios
- casajustalanzarote.com — dominio principal
- sosalquilerlanzarote.online — redirect al dominio principal, usar para campañas/hashtag
- sosalquilerlanzarote.cat — NO usar como principal (TLD reservado a cultura catalana), solo redirect si acaso

## Stack (migrado en oct-2026 desde un index.html estático)
- Next.js 16 App Router + TypeScript strict. Next 16 tiene cambios incompatibles: leer
  `node_modules/next/dist/docs/` antes de tocar routing, caching o server actions.
  `middleware.ts` ahora es `proxy.ts`; `params`/`searchParams`/`cookies()` son async.
- Postgres: Neon en producción (`DATABASE_URL`). En local sin `DATABASE_URL` se usa PGlite (Postgres en
  WASM en `./.pglite`), mismo SQL. Acceso solo desde el servidor (`lib/db`, `import 'server-only'`).
- Migraciones SQL en `db/migrations/` (`npm run db:migrate` para Neon; PGlite migra solo).
- i18n ES/IT/EN por ruta (`/es`, `/it`, `/en`); `proxy.ts` redirige según cookie `lang` o Accept-Language.
  Diccionarios en `lib/i18n/{es,it,en}.ts`: TypeScript obliga a que tengan las mismas claves.
- Gráficos en SVG inline, sin librerías. Fuentes por `<link>` de Google Fonts (next/font/google falla en el
  build de Turbopack 16.4 en esta ruta con espacios).

## Estructura
- `app/[lang]/page.tsx` — home: hero, evaluador, contexto legal, teaser del observatorio, acciones (3 modales).
- `app/[lang]/observatorio/` — observatorio + formulario "Añade tu caso" (server action) + "Haz oír nuestra voz".
- `app/[lang]/admin/` — panel protegido (ADMIN_PASSWORD + cookie firmada HMAC).
- `app/[lang]/privacidad`, `aviso-legal` — textos legales; datos del titular en `lib/site.ts`.
- `app/api/donate` (Stripe Checkout), `app/api/stripe/webhook`.
- `lib/stats.ts` — cálculos puros del observatorio (testeados en `tests/`).
- `lib/server/` — lectura de datos, anti-manipulación, sesión admin.

## Reglas del observatorio (críticas, no relajar)
- Mediana, nunca media. Casos con €/m² < 4 o > 45 se descartan enteros.
- Umbral MIN_CASES = 5 para TODO dato publicado (por municipio y por métrica). Por debajo: "Menos de 5
  casos", sin mostrar ni siquiera el número; el caso cuenta solo en el total de la isla.
- Ventanas móviles de 3 meses; se eligen los 6 últimos meses finales.
- Todo se calcula en el servidor; el cliente recibe solo `ObservatoryData` ya filtrado. Nunca enviar casos
  sueltos al cliente ni combinaciones estrechas (municipio + m² + precio).
- €/m² solo con vivienda completa. Las habitaciones cuentan en abusos y subidas, y tienen su propia
  mediana de precio en el evaluador. En habitación los m² son opcionales (desviación consciente del brief,
  que los pedía siempre).
- Tabla `cases`: sin nombre, email, dirección ni IP en claro. `month` siempre día 1.
- Única excepción de texto libre (pedida por el usuario, oct-2026): abuso "otro" con `other_text`
  (3–200 caracteres). Se limpia en servidor con `scrubOtherText` (emails, teléfonos, enlaces), NUNCA se
  publica ni sale del servidor salvo en el panel admin. "otro" sí cuenta como abuso en el termómetro.
- Anti-manipulación: rate limit por hash HMAC(IP|UA) borrado a las 24 h (`RATE_LIMIT_HOURS`), Turnstile
  (obligatorio en producción), detección de picos → `status='review'` (no cuenta hasta que admin publique).
  El mensaje al usuario no revela si su caso fue a revisión.

## Evaluador
- Si el municipio tiene ≥5 contratos (`source='pagado'`) en los últimos 6 meses: mediana de la comunidad
  ("Basado en N casos reales de X"). Si no: referencia oficial, declarada en pantalla:
  vivienda 15,56 €/m²/mes (media provincial Las Palmas, OBVIA/idealista abr-2026, verificada jul-2026);
  habitación 509 €/mes (Drago Canarias, may-2025). No mezclar ambos mercados.
- Usa los 7 municipios (antes eran localidades como Puerto del Carmen o Playa Blanca).
- Opt-in al final: pasa los datos al formulario del observatorio por sessionStorage (nunca por la URL).
- Los 3 "casos de la comunidad" estáticos del sitio viejo se eliminaron (eran inventados y mostraban
  casos sueltos); en su lugar hay un teaser con agregados del observatorio.

## Aportaciones ("Haz oír nuestra voz") — OCULTA desde 7-oct-2026
- Decisión del usuario: por ahora el sitio NO pide dinero. Todo está detrás de `SHOW_SUPPORT_SECTION`
  (por defecto false): no se muestra la sección, ni el CTA del header (pasa a "Añade tu caso"), ni la
  pestaña de admin. Los textos de privacidad/aviso legal sobre aportaciones se quitaron de los
  diccionarios (recuperarlos de git si se reactiva). Código y tablas se mantienen.
- Monetización pendiente de decidir con el usuario (ver memoria del asistente / conversación oct-2026).
- Solo aportaciones puntuales (3/5/10 € o libre 1–500 €). Nunca suscripciones ni cuotas.
- Objetivos en tabla `goals` (orden e importes; textos en diccionarios). "informe" es recurrente: solo
  cuenta lo aportado en el mes en curso, así que vuelve a estar activo cada mes. Lógica en `lib/goals.ts`.
- Stripe Checkout detrás de `DONATIONS_ENABLED` (APAGADO: aún no hay cuenta para recibir aportaciones).
  Apagado → botón "Próximamente". El webhook registra la aportación (idempotente por session id).
  Ojo: al no ser asociación, recibir aportaciones a título personal tiene implicaciones fiscales; decidirlo
  antes de activar Stripe.
- "Cuentas claras": aportaciones agregadas por objetivo/mes + movimientos que publica el admin.
- Sin sponsors. Footer: "CasaJusta Lanzarote es un proyecto ciudadano, no una asociación. Cada aportación
  va íntegra al objetivo publicado."

## Datos de ejemplo
- `npm run db:seed` inserta casos/aportaciones con `is_seed = true`; bloqueado con NODE_ENV=production y
  contra bases remotas salvo `SEED_ALLOW_REMOTE=true`. `npm run db:seed:clear` los borra.
- Solo se muestran con `SHOW_SEED_DATA=true` (por defecto no), y entonces aparece un banner amarillo.

## Identidad visual
- Logo y favicon: bandera de Canarias sin escudo (`components/CanaryFlag.tsx`), franjas verticales
  blanco / azul Pantone 3005 (#0077C8) / amarillo Pantone 7406 (#F1C400), tokens `--flag-*`.
- Inspirada en la normativa de César Manrique: casas blancas con persianas; el motivo "ventana/persiana"
  (`.shutter`) se usa en divisores e iconos de sección.
- Tokens en `app/globals.css` (`:root`, con tema oscuro por prefers-color-scheme y `data-theme`):
  blanco, azul #0A55B5, amarillo #FFC72C, rojo #FF4F2B, arena #F2EEE3, tinta #17150F.
  Verde y rojo son FUNCIONALES (en línea / alerta); no usarlos como decoración.
- Tipografía: Space Grotesk (titulares) + Inter (texto). Nunca hex sueltos en componentes salvo los
  extremos de la escala del mapa (`SCALE` en Observatory.tsx, espejo de --tile-low/--tile-high).

## Tono de contenido
- Cuerpo (formularios, datos, metodología): institucional, de confianza, neutral.
- Titulares/CTAs: directo, desafiante. Hero: "No tengas miedo. Si nos callamos, dormiremos donde toman el
  sol los turistas."

## Contexto legal (re-verificado 7-oct-2026 — verificar con búsqueda web antes de cambiar cifras)
- Canarias no tiene NINGÚN municipio declarado zona tensionada. Solo 3 ayuntamientos lo pidieron
  formalmente (Las Palmas de GC, Granadilla de Abona, Adeje) y el Gobierno canario no aceptó ninguno.
- En España: 317 municipios declarados a 30-sep-2026 (271 Cataluña, 21 Navarra, 18 País Vasco, 5 Asturias, 2 Galicia).
- El Cabildo de Lanzarote rechazó en pleno declarar la isla zona tensionada. Tías pidió en abril de 2024 al
  Gobierno de Canarias un diagnóstico para poder declararse; sin resultado. Lanzarote se quedó fuera de
  90 M€ estatales por no declarar ninguna zona (dato no publicado en la web).
- Ley 6/2025 (vivienda vacacional, en vigor 13-dic-2025): 90% de la edificabilidad residencial para
  vivienda habitual (10% máx. vacacional; 80/20 en La Palma, La Gomera, El Hierro), suspensión de 5 años
  para nuevas viviendas vacacionales hasta que el planeamiento municipal las habilite. NO limita el precio.
- Ley 7/2026 (en vigor 15-ago-2026) modifica la 6/2025: el contrato de temporada debe recoger por escrito el
  motivo real y su relación con la duración; si no, multas hasta 30.000 €. Tarjeta c5 del contexto legal.
- Estatal, inestable (NO publicado en la web): RDL 26 y 27/2026 derogados por el Congreso el 2-oct-2026;
  anunciados RDL 28 y 29/2026 (prórroga 2 años, subidas ≤2%, temporada con causa). Revisar antes de publicar.
- Acciones: PAH Lanzarote, Sindicatos de Inquilinas GC y Tenerife; firma = mailto a
  atencioninformacionciudadana@cabildodelanzarote.com (confirmado en la Carta de Servicios de la OIAC).
  El email y teléfono de la PAH Lanzarote NO se han podido re-verificar online en oct-2026.
- Referencias del evaluador: 509 €/habitación (Drago Canarias, mayo 2025) confirmado; 15,56 €/m² provincial
  (idealista abr-2026) no re-verificado (idealista bloquea la consulta automática).

## Pendiente antes del lanzamiento
- Crear proyecto Neon, `npm run db:migrate`, variables de entorno en Vercel (ver `.env.example`).
- Claves de Cloudflare Turnstile (sin ellas, en producción se rechazan los envíos).
- Datos del titular en `lib/site.ts` (nombre, NIF, domicilio, email de la persona responsable); hasta
  entonces los textos legales muestran "pendiente de publicar". La LSSI los exige para publicar la web.
- Revisión legal de privacidad/aviso legal (los textos son un borrador razonable, no asesoramiento).
- Activar Stripe (`DONATIONS_ENABLED=true`, claves, webhook `checkout.session.completed`) cuando haya una
  cuenta para recibir aportaciones y esté clara la parte fiscal.
- Re-verificar las cifras del contexto legal y las referencias oficiales del evaluador.
