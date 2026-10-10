import { ImageResponse } from 'next/og'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'

// Vista previa al compartir el comprobador en Facebook/WhatsApp: tiene que llamar la atención en los grupos.
export const alt = 'CasaJusta Lanzarote: ¿Es una estafa? Comprueba un anuncio de alquiler'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const t = getDict(isLocale(raw) ? raw : 'es').scam

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FFF4EF',
          color: '#17150F',
          padding: '56px 72px',
          borderTop: '22px solid #FF4F2B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', width: 72, height: 48, border: '2px solid #E3DED2', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: '#0077C8' }} />
            <div style={{ flex: 1, background: '#F1C400' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700 }}>
            CasaJusta&nbsp;<span style={{ color: '#0A55B5' }}>Lanzarote</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: -2, color: '#C7361A' }}>
            ⚠ {t.ogTitle}
          </div>
          <div style={{ display: 'flex', fontSize: 50, fontWeight: 700, lineHeight: 1.1 }}>{t.ogSub}</div>
          <div style={{ display: 'flex', fontSize: 30, color: '#5E5A50' }}>{t.ogPoints}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28 }}>
          <div style={{ display: 'flex', background: '#17150F', color: '#FFFFFF', padding: '12px 22px', borderRadius: 12, fontWeight: 700 }}>
            ✋ {t.ogWarn}
          </div>
          <div style={{ display: 'flex', color: '#C7361A', fontWeight: 700 }}>casajustalanzarote.com</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
