import Link from 'next/link'
import { getDict } from '@/lib/i18n'

// not-found no recibe params: se muestra en español con enlace a la home.
export default function NotFound() {
  const t = getDict('es')
  return (
    <main id="main" className="wrap">
      <div className="prose">
        <h1>{t.notFound.h1}</h1>
        <p>
          <Link href="/es">{t.notFound.back}</Link>
        </p>
      </div>
    </main>
  )
}
