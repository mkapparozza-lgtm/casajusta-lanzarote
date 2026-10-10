import type { Article } from '../types'
import { SCAM_GUIDE_SLUG } from '../../scam'

export const anuncioFalso: Article = {
  slug: SCAM_GUIDE_SLUG,
  date: '2026-10-10',
  cta: {
    path: '/comprobar-anuncio',
    label: {
      es: 'Comprueba un anuncio ahora',
      it: 'Controlla un annuncio adesso',
      en: 'Check a listing now',
    },
  },
  sources: [
    {
      name: 'El Español',
      title: 'Cuidado si buscas piso por Internet: sigue estos consejos de la Policía para que no te estafen',
      url: 'https://www.elespanol.com/sociedad/20240303/policia-alerta-estafas-alquiler-pisos-trucos-evitar-fraudes/837166283_0.html',
      date: '2024-03-03',
    },
    {
      name: 'Que.es',
      title: 'Policía Nacional detecta pisos turísticos falsos en portales de alquiler: cómo comprobar la licencia antes de pagar',
      url: 'https://www.que.es/2026/08/12/policia-nacional-estafas-alquiler-online/',
      date: '2026-08-12',
    },
    {
      name: 'La Moncloa',
      title: 'Teléfono 017: el servicio nacional de ayuda en ciberseguridad',
      url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/transformacion-digital-y-funcion-publica/Paginas/2026/140726-telefono-017-ayuda-ciberseguridad.aspx',
      date: '2026-07-14',
    },
    {
      name: 'La Voz de Lanzarote',
      title: 'Estafa en redes sociales en Lanzarote: se hacen pasar por propietarios de villas para alquilarlas',
      url: 'https://www.lavozdelanzarote.com/actualidad/mas-noticias/estafa-en-redes-sociales-en-lanzarote-se-hacen-pasar-por-propietarios-villas-alquilarlas_246074_102.html',
      date: '2026-09-17',
    },
  ],
  i18n: {
    es: {
      title: 'Anuncios falsos de alquiler en Lanzarote: cómo detectarlos y qué hacer si ya pagaste',
      description:
        'La emergencia habitacional es terreno abonado para estafas en redes sociales. Las señales que da la Policía, cómo comprobar las fotos y qué hacer si has pagado.',
      body: [
        {
          t: 'p',
          text: 'Con tanta gente buscando casa, los grupos de Facebook y otras redes se llenan de anuncios de pisos y habitaciones. Muchos son reales; otros son estafas que se aprovechan de la desesperación. En septiembre de 2026, La Voz de Lanzarote contó cómo un perfil falso en TikTok, con miles de seguidores, anunciaba unas 30 villas de Canarias haciéndose pasar por sus dueños, con fotos copiadas de otras webs y un contrato genérico sacado de internet.',
        },
        { t: 'h2', text: 'Las señales de alarma' },
        {
          t: 'ul',
          items: [
            'Te piden dinero (señal, reserva o fianza) antes de ver la vivienda. Es la señal más repetida en los avisos de la Policía.',
            'El anunciante está «fuera» —en el extranjero, de viaje, enfermo— y no puede enseñarla.',
            'Prisa: «hay muchos interesados», «si no pagas hoy se lo doy a otro».',
            'Un precio muy por debajo de lo normal en la zona. La Policía Nacional lo resume así: desconfía de los chollos.',
            'Pagos difíciles de recuperar: Bizum o transferencia a un particular sin contrato, giros, criptomonedas o tarjetas regalo.',
            'Fotos que aparecen en otros anuncios, en otra ciudad o en webs de alquiler vacacional.',
            'Te piden copia del DNI o nóminas antes de visitar: además del dinero, pueden robarte la identidad.',
          ],
        },
        { t: 'h2', text: 'Cómo comprobarlo en cinco minutos' },
        {
          t: 'ul',
          items: [
            'Busca las fotos con Google Lens (en el móvil, mantén pulsada la imagen y elige «Buscar con Google»). Si salen en otros anuncios, es falso.',
            'Pide una videollamada en directo desde dentro de la vivienda, abriendo puertas y mirando por la ventana.',
            'Pide el nombre completo y el DNI del propietario, y comprueba que coincide con quien firma. Puedes pedir una nota simple del Registro de la Propiedad.',
            'No pagues nada hasta haber visto la casa en persona y firmado un contrato.',
            'Usa el comprobador de CasaJusta: respondes unas preguntas y te dice el nivel de riesgo, sin guardar nada.',
          ],
        },
        { t: 'h2', text: 'Si ya has pagado' },
        {
          t: 'ul',
          items: [
            'Llama a tu banco de inmediato: cuanto antes, más posibilidades de frenar o devolver el pago.',
            'Guarda capturas del anuncio, del perfil, de las conversaciones y los justificantes de pago.',
            'Denuncia en la Policía Nacional o la Guardia Civil, aunque la cantidad sea pequeña: ayuda a relacionar casos.',
            'Llama al 017, la línea de ayuda en ciberseguridad de INCIBE: es gratuita y confidencial. Te orientan, pero no recogen denuncias.',
            'Denuncia el anuncio y el perfil en la red social donde lo viste.',
          ],
        },
        { t: 'h2', text: 'Una habitación a 500 € no siempre es una estafa' },
        {
          t: 'p',
          text: 'Por desgracia, 500 € por una habitación está en la media de Lanzarote: el informe de Drago Canarias de mayo de 2025 la situaba en 509 €. Es un precio abusivo para muchos sueldos, pero no es un delito. Si te pasa, añádelo al observatorio: así sabremos cuánto se paga de verdad en cada municipio.',
        },
        {
          t: 'note',
          text: 'Si has visto anuncios sospechosos, avisa a otras personas en el mapa de denuncias, con la categoría «Anuncio falso o engañoso». No publicamos enlaces ni nombres de perfiles: solo el municipio y lo que pasó.',
        },
      ],
    },
    it: {
      title: 'Annunci di affitto falsi a Lanzarote: come riconoscerli e cosa fare se hai già pagato',
      description:
        "L'emergenza abitativa è terreno fertile per le truffe sui social. I segnali indicati dalla Polizia, come controllare le foto e cosa fare se hai pagato.",
      body: [
        {
          t: 'p',
          text: "Con così tante persone che cercano casa, i gruppi Facebook e gli altri social si riempiono di annunci di appartamenti e stanze. Molti sono veri; altri sono truffe che approfittano della disperazione. A settembre 2026 La Voz de Lanzarote ha raccontato come un profilo falso su TikTok, con migliaia di follower, pubblicizzava circa 30 ville delle Canarie fingendosi il proprietario, con foto copiate da altri siti e un contratto generico preso da internet.",
        },
        { t: 'h2', text: 'I segnali di allarme' },
        {
          t: 'ul',
          items: [
            'Ti chiedono soldi (caparra, prenotazione o cauzione) prima di vedere la casa. È il segnale più ripetuto negli avvisi della Polizia.',
            "L'inserzionista è «via» — all'estero, in viaggio, malato — e non può mostrarla.",
            'Fretta: «ci sono tanti interessati», «se non paghi oggi la do a un altro».',
            'Un prezzo molto sotto la norma della zona. La Policía Nacional lo riassume così: diffida degli affari troppo belli.',
            'Pagamenti difficili da recuperare: Bizum o bonifico a un privato senza contratto, money transfer, criptovalute o carte regalo.',
            'Foto che compaiono in altri annunci, in un\'altra città o su siti di affitti per vacanze.',
            "Ti chiedono copia del documento o buste paga prima della visita: oltre ai soldi, possono rubarti l'identità.",
          ],
        },
        { t: 'h2', text: 'Come controllare in cinque minuti' },
        {
          t: 'ul',
          items: [
            "Cerca le foto con Google Lens (sul telefono, tieni premuta l'immagine e scegli «Cerca con Google»). Se compaiono in altri annunci, è falso.",
            "Chiedi una videochiamata in diretta dall'interno della casa, aprendo le porte e guardando dalla finestra.",
            'Chiedi nome completo e documento del proprietario e verifica che corrisponda a chi firma. Puoi chiedere una "nota simple" al Registro della Proprietà.',
            'Non pagare nulla prima di aver visto la casa di persona e firmato un contratto.',
            'Usa il controllo annunci di CasaJusta: rispondi ad alcune domande e ti dice il livello di rischio, senza salvare nulla.',
          ],
        },
        { t: 'h2', text: 'Se hai già pagato' },
        {
          t: 'ul',
          items: [
            'Chiama subito la tua banca: prima lo fai, più possibilità hai di bloccare o recuperare il pagamento.',
            "Salva screenshot dell'annuncio, del profilo, delle conversazioni e delle ricevute.",
            'Denuncia alla Policía Nacional o alla Guardia Civil, anche se la cifra è piccola: aiuta a collegare i casi.',
            "Chiama il 017, la linea di aiuto sulla sicurezza informatica di INCIBE: è gratuita e riservata. Ti orientano, ma non raccolgono denunce.",
            "Segnala l'annuncio e il profilo al social network dove l'hai visto.",
          ],
        },
        { t: 'h2', text: 'Una stanza a 500 € non è sempre una truffa' },
        {
          t: 'p',
          text: "Purtroppo 500 € per una stanza è nella media di Lanzarote: il rapporto di Drago Canarias di maggio 2025 la indicava a 509 €. È un prezzo abusivo per molti stipendi, ma non è un reato. Se ti succede, aggiungilo all'osservatorio: così sapremo quanto si paga davvero in ogni comune.",
        },
        {
          t: 'note',
          text: 'Se hai visto annunci sospetti, avvisa gli altri sulla mappa delle segnalazioni, con la categoria «Annuncio falso o ingannevole». Non pubblichiamo link né nomi di profili: solo il comune e cosa è successo.',
        },
      ],
    },
    en: {
      title: 'Fake rental listings in Lanzarote: how to spot them and what to do if you already paid',
      description:
        'The housing emergency is fertile ground for social-media scams. The warning signs the police give, how to check the photos and what to do if you paid.',
      body: [
        {
          t: 'p',
          text: 'With so many people looking for a home, Facebook groups and other social networks fill up with listings for flats and rooms. Many are real; others are scams that exploit desperation. In September 2026, La Voz de Lanzarote reported how a fake TikTok profile with thousands of followers advertised about 30 villas in the Canary Islands, posing as their owners, with photos copied from other websites and a generic contract taken from the internet.',
        },
        { t: 'h2', text: 'The warning signs' },
        {
          t: 'ul',
          items: [
            'They ask for money (deposit or booking fee) before you see the home. It is the most repeated sign in police warnings.',
            'The advertiser is "away" — abroad, travelling, ill — and cannot show it.',
            'Rush: "lots of people are interested", "if you don\'t pay today I\'ll give it to someone else".',
            'A price far below normal for the area. The National Police put it simply: be wary of bargains.',
            'Payments that are hard to recover: Bizum or transfer to an individual without a contract, money transfers, crypto or gift cards.',
            'Photos that appear in other listings, in another city or on holiday-rental websites.',
            'They ask for a copy of your ID or payslips before a visit: as well as your money, they can steal your identity.',
          ],
        },
        { t: 'h2', text: 'How to check in five minutes' },
        {
          t: 'ul',
          items: [
            'Search the photos with Google Lens (on your phone, long-press the image and choose "Search with Google"). If they appear in other listings, it is fake.',
            'Ask for a live video call from inside the home, opening doors and looking out of the window.',
            "Ask for the owner's full name and ID and check they match the person signing. You can request a 'nota simple' from the Land Registry.",
            'Do not pay anything until you have seen the home in person and signed a contract.',
            "Use CasaJusta's listing checker: answer a few questions and it tells you the level of risk, without storing anything.",
          ],
        },
        { t: 'h2', text: 'If you have already paid' },
        {
          t: 'ul',
          items: [
            'Call your bank immediately: the sooner you do, the better the chance of stopping or reversing the payment.',
            'Keep screenshots of the listing, the profile, the conversations and the payment receipts.',
            'Report it to the National Police or the Guardia Civil, even if the amount is small: it helps link cases.',
            "Call 017, INCIBE's cybersecurity helpline: it is free and confidential. They give guidance but do not take reports.",
            'Report the listing and the profile on the social network where you saw it.',
          ],
        },
        { t: 'h2', text: 'A €500 room is not always a scam' },
        {
          t: 'p',
          text: 'Sadly, €500 for a room is the Lanzarote average: the Drago Canarias report of May 2025 put it at €509. It is an abusive price for many salaries, but it is not a crime. If it happens to you, add it to the observatory so we know what people really pay in each municipality.',
        },
        {
          t: 'note',
          text: 'If you have seen suspicious listings, warn others on the reports map using the "Fake or misleading listing" category. We do not publish links or profile names: only the municipality and what happened.',
        },
      ],
    },
  },
}
