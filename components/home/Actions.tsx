'use client'

import { useRef, useState, type ReactNode, type RefObject } from 'react'
import { municipioName, type Locale } from '@/lib/domain'
import { eur } from '@/lib/format'
import { fill, type Dict } from '@/lib/i18n'
import { useEvalState } from './EvalState'

// Oficina de Información y Atención Ciudadana del Cabildo (contacto oficial verificado, jul-2026).
const CABILDO_EMAIL = 'atencioninformacionciudadana@cabildodelanzarote.com'

type Props = { lang: Locale; t: Dict['actions']; m: Dict['modal'] }

function Modal({
  dialogRef,
  title,
  closeLabel,
  children,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>
  title: string
  closeLabel: string
  children: ReactNode
}) {
  const id = `dlg-${title.replace(/\W+/g, '-').toLowerCase()}`
  return (
    // <dialog> con showModal(): foco atrapado, Escape cierra y el fondo queda inerte.
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={id}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close()
      }}
    >
      <button type="button" className="modal-close" aria-label={closeLabel} onClick={() => dialogRef.current?.close()}>
        ×
      </button>
      <h3 id={id}>{title}</h3>
      {children}
    </dialog>
  )
}

export function Actions({ lang, t, m }: Props) {
  const { result } = useEvalState()
  const msgRef = useRef<HTMLDialogElement>(null)
  const assocRef = useRef<HTMLDialogElement>(null)
  const signRef = useRef<HTMLDialogElement>(null)
  const [copied, setCopied] = useState(false)

  let message: string | null = null
  if (result) {
    const vars = {
      zona: municipioName(result.municipio),
      precio: eur(result.precio, lang),
      media: eur(result.media, lang),
      dif: result.dif,
      unit: result.tipo === 'habitacion' ? m.msgUnitRoom : fill(m.msgUnitFull, { m2: result.m2 }),
      propuesta: eur(Math.round((result.precio + result.media) / 2 / 10) * 10, lang),
    }
    message = fill(result.dif > 0 ? m.msgAbove : m.msgFair, vars)
  }

  const mailto = `mailto:${CABILDO_EMAIL}?subject=${encodeURIComponent(m.signSubject)}&body=${encodeURIComponent(m.signEmailBody)}`

  async function copy() {
    if (!message) return
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* sin portapapeles: el texto sigue visible para copiarlo a mano */
    }
  }

  const cards = [
    { color: 'var(--blue)', h: t.a1h, p: t.a1p, btn: t.a1btn, ref: msgRef },
    { color: 'var(--green)', h: t.a2h, p: t.a2p, btn: t.a2btn, ref: assocRef },
    { color: 'var(--red)', h: t.a3h, p: t.a3p, btn: t.a3btn, ref: signRef },
  ]

  return (
    <>
      <div className="actions-grid">
        {cards.map((c) => (
          <div className="card action-card" key={c.h}>
            <span className="shutter" style={{ background: c.color }} aria-hidden="true" />
            <h3>{c.h}</h3>
            <p>{c.p}</p>
            <button type="button" className="btn" onClick={() => c.ref.current?.showModal()}>
              {c.btn}
            </button>
          </div>
        ))}
      </div>

      <Modal dialogRef={msgRef} title={m.msgTitle} closeLabel={m.close}>
        <div className="msg-box">{message ?? m.msgNeedData}</div>
        {message && (
          <button type="button" className="btn btn-primary" onClick={copy} aria-live="polite">
            {copied ? m.msgCopied : m.msgCopy}
          </button>
        )}
      </Modal>

      <Modal dialogRef={assocRef} title={m.assocTitle} closeLabel={m.close}>
        <div className="assoc-item">
          <h4>{m.pahName}</h4>
          <p>{m.pahDesc}</p>
          <a href="mailto:pahlanzarote@gmail.com">pahlanzarote@gmail.com</a> · <a href="tel:+34685568333">685 568 333</a>
        </div>
        <div className="assoc-item">
          <h4>{m.sigcName}</h4>
          <p>{m.sigcDesc}</p>
          <a href="https://sindicatodeinquilinasgc.noblogs.org/" target="_blank" rel="noopener noreferrer">
            sindicatodeinquilinasgc.noblogs.org
          </a>
        </div>
        <div className="assoc-item">
          <h4>{m.sitName}</h4>
          <p>{m.sitDesc}</p>
          <a href="https://www.facebook.com/SindicatoInquilinasTF/" target="_blank" rel="noopener noreferrer">
            facebook.com/SindicatoInquilinasTF
          </a>
        </div>
      </Modal>

      <Modal dialogRef={signRef} title={m.signTitle} closeLabel={m.close}>
        <p>{m.signBody}</p>
        <a href={mailto} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
          {m.signBtn}
        </a>
      </Modal>
    </>
  )
}
