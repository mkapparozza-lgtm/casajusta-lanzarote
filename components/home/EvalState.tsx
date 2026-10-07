'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { MunicipioId, Tipo } from '@/lib/domain'

/** Último cálculo del evaluador, para generar la carta de negociación. */
export type EvalResult = {
  tipo: Tipo
  municipio: MunicipioId
  m2: number
  precio: number
  media: number
  dif: number
}

const Ctx = createContext<{ result: EvalResult | null; setResult: (r: EvalResult | null) => void } | null>(null)

export function EvalStateProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<EvalResult | null>(null)
  return <Ctx.Provider value={{ result, setResult }}>{children}</Ctx.Provider>
}

export function useEvalState() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useEvalState fuera de EvalStateProvider')
  return v
}

/** Clave de sessionStorage para pasar datos del evaluador al formulario del observatorio sin ponerlos en la URL. */
export const PREFILL_KEY = 'cj_prefill'
/** Evento para avisar al formulario cuando evaluador y formulario están en la misma página (observatorio). */
export const PREFILL_EVENT = 'cj-prefill'
export type Prefill = { municipio: MunicipioId; tipo: Tipo; m2: number | null; price: number }
