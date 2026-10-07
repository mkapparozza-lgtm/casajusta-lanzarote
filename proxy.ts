import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './lib/domain'

function preferredLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get('lang')?.value
  if (isLocale(cookie)) return cookie
  const header = req.headers.get('accept-language') ?? ''
  for (const part of header.split(',')) {
    const code = part.split(';')[0]?.trim().slice(0, 2).toLowerCase()
    if (isLocale(code)) return code
  }
  return DEFAULT_LOCALE
}

// Toda URL sin idioma (/, /observatorio…) se redirige a /es, /it o /en.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const first = pathname.split('/')[1]
  if (first && (LOCALES as string[]).includes(first)) return NextResponse.next()
  const url = req.nextUrl.clone()
  url.pathname = `/${preferredLocale(req)}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
