// Datos del responsable de la web para los textos legales (LSSI y RGPD).
// CasaJusta NO es una asociación: el titular es la persona responsable del proyecto.
// Mientras un campo sea null, la web muestra "pendiente de publicar" en lugar de inventar un dato.
export const LEGAL_HOLDER = {
  name: null as string | null,
  nif: null as string | null,
  address: null as string | null,
  email: null as string | null,
}

import type { Locale } from './domain'

/** URL pública del sitio (sin barra final). */
export const SITE_URL = (process.env.SITE_URL || 'https://casajustalanzarote.com').replace(/\/$/, '')

export const OG_LOCALE: Record<Locale, string> = { es: 'es_ES', it: 'it_IT', en: 'en_GB' }

/** hreflang de una ruta (sin el prefijo de idioma), con x-default al español. */
export function languageAlternates(path: string): Record<string, string> {
  const p = path ? `/${path.replace(/^\//, '')}` : ''
  return { es: `/es${p}`, it: `/it${p}`, en: `/en${p}`, 'x-default': `/es${p}` }
}

/** Fecha de la última revisión de los textos legales (AAAA-MM-DD). */
export const LEGAL_UPDATED = '2026-10-07'
