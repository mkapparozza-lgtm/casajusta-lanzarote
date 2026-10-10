'use client'

import { useEffect, useState } from 'react'

// Escala de color de los mapas por municipio (mismos extremos que --tile-low / --tile-high en globals.css).
const SCALE = {
  light: { low: [0xf2, 0xee, 0xe3], high: [0xff, 0x4f, 0x2b] },
  dark: { low: [0x2a, 0x27, 0x21], high: [0xff, 0x5a, 0x36] },
} as const

export function useDarkMode(): boolean {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const forced = document.documentElement.dataset.theme
    if (forced) {
      setDark(forced === 'dark')
      return
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    const on = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return dark
}

function luminance([r, g, b]: number[]): number {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!)
}

/** Tinta o blanco, el que dé más contraste WCAG sobre el fondo. */
function textOn(rgb: number[]): string {
  const l = luminance(rgb)
  const vsInk = (l + 0.05) / (luminance([0x17, 0x15, 0x0f]) + 0.05)
  const vsWhite = 1.05 / (l + 0.05)
  return vsInk >= vsWhite ? '#17150F' : '#FFFFFF'
}

/** Fondo y color de texto para un valor normalizado k ∈ [0, 1]. */
export function tileStyle(k: number, dark: boolean): { background: string; color: string } {
  const scale = dark ? SCALE.dark : SCALE.light
  const t = 0.15 + Math.min(1, Math.max(0, k)) * 0.85
  const rgb = scale.low.map((a, j) => Math.round(a + (scale.high[j]! - a) * t))
  return { background: `rgb(${rgb.join(',')})`, color: textOn(rgb) }
}
