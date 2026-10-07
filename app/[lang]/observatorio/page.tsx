import { permanentRedirect } from 'next/navigation'

// El observatorio es ahora la home (oct-2026). Se mantiene la ruta para no romper enlaces ya compartidos.
export default async function ObservatorioRedirect({ params, searchParams }: PageProps<'/[lang]/observatorio'>) {
  const { lang } = await params
  const sp = await searchParams
  const aporte = typeof sp.aporte === 'string' ? `?aporte=${encodeURIComponent(sp.aporte)}` : ''
  permanentRedirect(`/${lang}${aporte}`)
}
