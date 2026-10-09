import { ImageResponse } from 'next/og'
import { isLocale } from '@/lib/domain'
import { getDict } from '@/lib/i18n'
import { OFFICIAL, OFFICIAL_YEAR } from '@/lib/official'

// Imagen de vista previa al compartir el enlace (WhatsApp, Facebook, X…). Solo datos públicos.
export const alt = 'CasaJusta Lanzarote'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const lang = isLocale(raw) ? raw : 'es'
  const t = getDict(lang)
  const values = Object.values(OFFICIAL).map((o) => o.eurM2)
  const fmt = (v: number) => v.toLocaleString(lang === 'en' ? 'en-GB' : `${lang}-ES`, { maximumFractionDigits: 1 })
  const range = `${fmt(Math.min(...values))}–${fmt(Math.max(...values))} €/m²`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          color: '#17150F',
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Bandera de Canarias sin escudo */}
          <div style={{ display: 'flex', width: 96, height: 64, border: '2px solid #E3DED2', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: '#0077C8' }} />
            <div style={{ flex: 1, background: '#F1C400' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 700 }}>
            CasaJusta&nbsp;<span style={{ color: '#0A55B5' }}>Lanzarote</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1 }}>{t.meta.ogLine}</div>
          <div style={{ fontSize: 34, color: '#5E5A50' }}>{t.meta.ogSub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28 }}>
          <div style={{ display: 'flex', background: '#FF4F2B', color: '#ffffff', padding: '12px 22px', borderRadius: 12, fontWeight: 700 }}>
            casajustalanzarote.com
          </div>
          <div style={{ display: 'flex', color: '#5E5A50' }}>
            {range} · {t.obs.officialTag.replace('{year}', String(OFFICIAL_YEAR))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
