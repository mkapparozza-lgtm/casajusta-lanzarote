# CasaJusta Lanzarote

Plataforma comunitaria de sensibilización sobre el precio del alquiler en Lanzarote.
Brand principal: CasaJusta Lanzarote. Nombre de campaña/hashtag: SOS Alquiler Lanzarote.

## Dominios
- casajustalanzarote.com — dominio principal
- sosalquilerlanzarote.online — redirect al dominio principal, usar para campañas/hashtag
- sosalquilerlanzarote.cat — NO usar como principal (TLD reservado a cultura catalana), solo redirect si acaso

## Stack
Sitio estático de una sola página (`index.html`), sin build step, HTML/CSS/JS vanilla.
Mismo enfoque que el proyecto ÑOOS Lanzarote (sitio estático, sin framework).

## Identidad visual
- Inspirado en la normativa arquitectónica de César Manrique en Lanzarote: casas blancas con
  persianas verdes (interior) o azules (costa). El motivo de "ventanas/persianas" es el elemento
  de firma visual (logo, divisores, iconos de sección).
- Paleta: colores de la bandera canaria (azul `--blue: #0057B8`, amarillo `--yellow: #FFC72C`,
  blanco `--paper: #ffffff`) como identidad de marca. Verde (`--green`) y coral (`--coral`) se
  reservan como colores FUNCIONALES (verde = valoración en línea con el mercado, coral = fuera
  de control / alerta). No reasignar estos dos a decoración pura, rompe la semántica del evaluador.
- Tipografía: Space Grotesk (display/headings) + Inter (cuerpo).

## Tono de contenido
Doble registro deliberado:
- Cuerpo del sitio (formulario, datos, evaluación): tono institucional, de confianza, neutral.
- Titulares/CTAs de impacto: tono directo, desafiante, sin miedo. Ejemplo actual del hero:
  "No tengas miedo. Si nos callamos, dormiremos donde toman el sol los turistas."

## Contexto legal (verificado, no inventar cifras nuevas sin buscar)
- Canarias no tiene NINGÚN municipio declarado zona de mercado residencial tensionado.
- El Cabildo de Lanzarote rechazó en pleno declarar la isla zona tensionada.
- Solo el municipio de Tías se interesó de forma informativa, sin aplicación ejecutiva.
- Esta información cambia con el tiempo — verificar con búsqueda web antes de actualizar cifras.

## Funcionalidad actual
- Evaluador de alquiler (`#evaluar`): calcula desviación del precio pedido respecto a un único
  valor de referencia, `AVG_PER_M2 = 15.56` €/m²/mes (constante en el `<script>`), en vez de un
  valor por zona. Motivo: no existe un índice oficial fiable desglosado por municipio en Lanzarote
  (Fotocasa/idealista devuelven "datos insuficientes" para Arrecife, Tías y Teguise y caen a la
  media de toda la provincia de Las Palmas). El valor usado es esa media provincial, fuente OBVIA/
  idealista, abril 2026, verificada julio 2026 — citada en el propio evaluador (`ev_source`).
  Si en el futuro aparece un dato oficial por municipio, sustituir la constante y volver a un
  `data-avg` por zona.
- El formulario es completamente anónimo por diseño: no se pide nombre, email ni dirección exacta.
  Mantener esta garantía en cualquier evolución del formulario (ej. si se conecta a un backend real).
- Botón "Generar mensaje": abre un modal con una carta de negociación generada a partir del último
  cálculo del evaluador (variable `state` en el script). Si el usuario no ha calculado nada, lo pide.
- Botón "Ver asociaciones": modal con 3 organizaciones reales y verificadas (PAH Lanzarote —
  contacto real, email y teléfono —, Sindicato de Inquilinas de Gran Canaria, Sindicato de
  Inquilinas de Tenerife). No hay asociación específica de inquilinos en Lanzarote a día de hoy.
- Botón "Firmar ahora": abre un `mailto:` real a `atencioninformacionciudadana@cabildodelanzarote.com`
  (Oficina de Información y Atención Ciudadana del Cabildo, contacto oficial verificado), con asunto
  y cuerpo pre-redactados según el idioma activo (`updateSignMailto()`). Decisión del usuario
  (jul-2026): mejor esto que fabricar un enlace externo o un contador de firmas falso. Si en el
  futuro existe una petición real en Change.org/Google Forms, se puede sustituir o complementar.
- `#casos`: los 3 casos siguen siendo estáticos/de ejemplo, pero ahora se generan desde el array
  `casesData` en JS (con barra de desviación visual). No se convirtió en mapa geográfico real
  porque asignar coordenadas a casos anónimos rompería la garantía de "sin dirección exacta".
- Multilenguaje ES/IT/EN: implementado con diccionario `translations` + atributos `data-i18n`,
  selector en el header, persistencia en `localStorage('lang')`. Sin librerías externas.
- Evaluador con dos modos (`vivienda completa` / `habitación`, toggle `#typeSwitch`): el modo
  habitación usa `ROOM_AVG = 509` €/mes fijo (informe Drago Canarias, mayo 2025 — precio de
  habitación en piso compartido, no escala con m²), distinto de `AVG_PER_M2` que es para vivienda
  completa. Son mercados distintos, no mezclar ambas fuentes en una sola cifra.
- Contexto legal: 4ª tarjeta sobre la Ley 6/2025 de Ordenación Sostenible del Uso Turístico de
  Viviendas (Canarias, en vigor desde dic-2025): tope del 10% de vivienda vacacional en suelo
  residencial (20% en La Palma/Gomera/Hierro), moratoria de 5 años. Aclarar siempre que esto limita
  la vivienda turística, no el precio del alquiler de larga duración — no confundirlo con el "tope
  al alquiler" que sigue sin existir.

## Pendiente / próximos pasos conocidos
- Conectar el evaluador a una base de datos real por zona si aparece una fuente oficial fiable.
- Deploy en Cloudflare Pages o Vercel, con dominio conectado desde el registrar.

## Convenciones de código
- Un único `index.html` autocontenido (CSS y JS inline) mientras el sitio siga siendo simple.
  Si crece mucho, separar en `styles.css` / `script.js`, pero evaluar primero si aporta valor real.
- Variables de color siempre en `:root` como CSS custom properties, nunca hex hardcodeado suelto
  en el HTML (excepción actual: algunos estados de warning que faltan por migrar a variable).
