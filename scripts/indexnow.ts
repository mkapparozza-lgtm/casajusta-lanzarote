// Avisa a Bing (y a los buscadores que usan IndexNow: Yandex, Seznam, Naver…) de las URLs del sitemap.
// Uso: npm run indexnow   (después de publicar cambios importantes)
// La clave es pública por diseño: está en public/<clave>.txt para demostrar que el sitio es nuestro.

const SITE = 'https://casajustalanzarote.com'
const KEY = 'da55fd8bc4bcf4aa747160fb36f548eb'

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!)
if (urlList.length === 0) throw new Error('El sitemap no tiene URLs')

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
})
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} URLs enviadas`)
if (!res.ok && res.status !== 202) console.log(await res.text())

export {}
