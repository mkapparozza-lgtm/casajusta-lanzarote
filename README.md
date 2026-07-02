# CasaJusta Lanzarote

Sitio estático — alquiler transparente para Lanzarote.

## Desarrollo local

No hay build step. Basta con abrir `index.html` en el navegador, o servirlo local:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Deploy

Recomendado: Cloudflare Pages o Vercel.

### Cloudflare Pages
1. Sube este repositorio a GitHub.
2. En el dashboard de Cloudflare Pages, conecta el repositorio.
3. Build command: (ninguno) — Output directory: `/`
4. Conecta el dominio `casajustalanzarote.com` desde la pestaña de dominios personalizados.
5. Configura `sosalquilerlanzarote.online` como redirect al dominio principal (Cloudflare
   Bulk Redirects o Page Rules).

### Vercel
1. `vercel` desde la raíz del proyecto, o conecta el repo desde el dashboard.
2. Sin framework detectado — se sirve como sitio estático automáticamente.

## Estructura

```
index.html    — sitio completo (HTML + CSS + JS inline)
CLAUDE.md     — memoria de proyecto para Claude Code
```
