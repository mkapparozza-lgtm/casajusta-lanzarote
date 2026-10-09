import Link from 'next/link'
import type { Locale } from '@/lib/domain'
import { shortDate } from '@/lib/format'
import type { Dict } from '@/lib/i18n'
import type { Article } from '@/lib/news'

export function NewsList({ lang, t, articles }: { lang: Locale; t: Dict['news']; articles: Article[] }) {
  return (
    <ul className="news-list">
      {articles.map((a) => {
        const x = a.i18n[lang]
        return (
          <li key={a.slug} className="news-item">
            <time dateTime={a.date}>{shortDate(a.date, lang)}</time>
            <h3>
              <Link href={`/${lang}/noticias/${a.slug}`}>{x.title}</Link>
            </h3>
            <p>{x.description}</p>
            <Link href={`/${lang}/noticias/${a.slug}`} className="news-read" aria-hidden="true" tabIndex={-1}>
              {t.read} →
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
