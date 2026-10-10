import type { Article } from '../types'

// Texto prudente: el detalle de la Ley 7/2026 procede de guías especializadas; el BOC no se pudo consultar
// directamente al redactar (oct-2026). Si se verifica el texto oficial, actualizar `updated` y la nota final.
export const contratosTemporada: Article = {
  slug: 'contratos-de-temporada-canarias-ley-7-2026',
  date: '2026-10-10',
  updated: '2026-10-10',
  sources: [
    {
      name: 'Apivirtual',
      title: 'Real Decreto-ley 29/2026 de vivienda: qué cambia para inquilinos, propietarios y agentes inmobiliarios',
      url: 'https://www.apivirtual.com/real-decreto-ley-29-2026-vivienda-que-cambia/',
      date: '2026-10',
    },
    {
      name: 'AlquilerViviendaVacacional.com',
      title: 'Contrato de temporada en Canarias: qué exige la Ley 7/2026',
      url: 'https://alquilerviviendavacacional.com/contrato-de-temporada-canarias-ley-7-2026/',
      date: '2026-08',
    },
    {
      name: 'AlquilerViviendaVacacional.com',
      title: 'Canarias: 100 preguntas sobre la Ley 6/2025 tras la Ley 7/2026',
      url: 'https://alquilerviviendavacacional.com/canarias-100-preguntas-y-respuestas-sobre-la-ley-6-2025-de-10-de-diciembre-de-ordenacion-sostenible-del-uso-turistico-de-viviendas/',
      date: '2026-08',
    },
    {
      name: 'BOE',
      title: 'Ley 6/2025, de 10 de diciembre, de Ordenación Sostenible del Uso Turístico de Viviendas',
      url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26358',
      date: '2025-12-12',
    },
  ],
  i18n: {
    es: {
      title: 'Contratos de temporada en Canarias: qué cambia con la Ley 7/2026',
      description:
        'Desde el 15 de agosto de 2026 el contrato de temporada debe explicar por escrito por qué es temporal. Qué significa si vives todo el año en esa casa.',
      body: [
        {
          t: 'p',
          text: 'Uno de los abusos más señalados en Lanzarote es firmar un «contrato de temporada» para una casa en la que se vive todo el año. Así el propietario evita las garantías del alquiler de vivienda habitual, como la duración mínima de los contratos. En Canarias, la Ley 7/2026 (en vigor desde el 15 de agosto de 2026) ha añadido reglas nuevas a la Ley 6/2025 para frenar esta práctica.',
        },
        { t: 'h2', text: 'Qué exige ahora' },
        {
          t: 'ul',
          items: [
            'Antes de firmar, el propietario debe pedir al inquilino, por escrito y con fecha, el motivo por el que necesita un alojamiento temporal: trabajo, estudios, salud…',
            'Ese motivo, y su relación con la duración del contrato, debe constar expresamente en el contrato.',
            'Las estancias de 31 días o menos se presumen alquiler turístico, con las obligaciones que eso conlleva.',
          ],
        },
        { t: 'h2', text: 'Qué pasa si no se cumple' },
        {
          t: 'p',
          text: 'Según las guías especializadas consultadas, no pedir el motivo antes de firmar es una infracción leve (hasta 1.500 euros), y firmar sin que conste en el contrato es una infracción grave (de 1.501 a 30.000 euros). Además, el contrato podría considerarse alquiler turístico.',
        },
        { t: 'h2', text: 'Además, una norma estatal desde el 8 de octubre de 2026' },
        {
          t: 'p',
          text: 'El Real Decreto-ley 29/2026 exige en toda España una causa real y acreditable para el contrato de temporada, cuya prueba corresponde al propietario, y una duración de más de 31 días y, como regla general, no más de 12 meses. Si no hay causa justificada, el contrato se considera de vivienda habitual desde el principio; también si supera los 12 meses sin justificación o si se encadenan más de dos contratos entre las mismas partes para la misma vivienda. El decreto está pendiente de convalidación por el Congreso: si no se convalida, decae.',
        },
        { t: 'h2', text: 'Si vives todo el año con un contrato de temporada' },
        {
          t: 'ul',
          items: [
            'Guarda una copia del contrato y de los pagos.',
            'Comprueba si figura el motivo de la temporalidad y si tiene sentido con tu situación real.',
            'No firmes renovaciones «de temporada» sin asesorarte antes.',
            'Pide ayuda gratuita a una asociación o sindicato de inquilinas: tienes enlaces en «Qué puedes hacer».',
            'Añade tu caso al observatorio marcando «Contrato de temporada para mi vivienda habitual»: así sabremos cuánto se repite en cada municipio.',
          ],
        },
        {
          t: 'note',
          text: 'Esta guía es informativa y no es asesoramiento legal. Resume lo publicado por fuentes especializadas; antes de actuar en un caso concreto, consulta el texto oficial de la Ley 7/2026 (Boletín Oficial de Canarias núm. 163, 14 de agosto de 2026) o a un profesional.',
        },
      ],
    },
    it: {
      title: 'Contratti di temporada alle Canarie: cosa cambia con la Legge 7/2026',
      description:
        "Dal 15 agosto 2026 il contratto di temporada deve spiegare per iscritto perché è temporaneo. Cosa significa se vivi tutto l'anno in quella casa.",
      body: [
        {
          t: 'p',
          text: "Uno degli abusi più segnalati a Lanzarote è firmare un «contratto di temporada» (stagionale) per una casa in cui si vive tutto l'anno. Così il proprietario evita le garanzie dell'affitto di abitazione abituale, come la durata minima dei contratti. Alle Canarie la Legge 7/2026 (in vigore dal 15 agosto 2026) ha aggiunto nuove regole alla Legge 6/2025 per frenare questa pratica.",
        },
        { t: 'h2', text: 'Cosa richiede ora' },
        {
          t: 'ul',
          items: [
            "Prima di firmare, il proprietario deve chiedere all'inquilino, per iscritto e con data, il motivo per cui ha bisogno di un alloggio temporaneo: lavoro, studio, salute…",
            'Quel motivo, e il suo legame con la durata del contratto, deve essere scritto espressamente nel contratto.',
            'I soggiorni di 31 giorni o meno si presumono affitto turistico, con i relativi obblighi.',
          ],
        },
        { t: 'h2', text: 'Cosa succede se non si rispetta' },
        {
          t: 'p',
          text: "Secondo le guide specializzate consultate, non chiedere il motivo prima di firmare è un'infrazione lieve (fino a 1.500 euro), e firmare senza che sia scritto nel contratto è un'infrazione grave (da 1.501 a 30.000 euro). Inoltre il contratto potrebbe essere considerato affitto turistico.",
        },
        { t: 'h2', text: "In più, una norma statale dall'8 ottobre 2026" },
        {
          t: 'p',
          text: "Il Real Decreto-ley 29/2026 richiede in tutta la Spagna una causa reale e dimostrabile per il contratto di temporada, che spetta al proprietario provare, e una durata di più di 31 giorni e, di regola, non più di 12 mesi. Se non c'è una causa giustificata, il contratto si considera di abitazione abituale fin dall'inizio; lo stesso se supera i 12 mesi senza giustificazione o se si concatenano più di due contratti tra le stesse parti per la stessa casa. Il decreto è in attesa di convalida da parte del Congresso: se non viene convalidato, decade.",
        },
        { t: 'h2', text: "Se vivi tutto l'anno con un contratto di temporada" },
        {
          t: 'ul',
          items: [
            'Conserva una copia del contratto e dei pagamenti.',
            'Controlla se è indicato il motivo della temporaneità e se corrisponde alla tua situazione reale.',
            'Non firmare rinnovi «di temporada» senza prima chiedere consiglio.',
            'Chiedi aiuto gratuito a un\'associazione o sindacato degli inquilini: trovi i contatti in «Cosa puoi fare».',
            "Aggiungi il tuo caso all'osservatorio segnando «Contratto stagionale per la mia abitazione principale»: così sapremo quanto è diffuso in ogni comune.",
          ],
        },
        {
          t: 'note',
          text: "Questa guida è informativa e non è consulenza legale. Riassume quanto pubblicato da fonti specializzate; prima di agire su un caso concreto, consulta il testo ufficiale della Legge 7/2026 (Bollettino Ufficiale delle Canarie n. 163, 14 agosto 2026) o un professionista.",
        },
      ],
    },
    en: {
      title: 'Seasonal rental contracts in the Canary Islands: what Law 7/2026 changes',
      description:
        'Since 15 August 2026 a seasonal contract must state in writing why it is temporary. What that means if you live in the home all year round.',
      body: [
        {
          t: 'p',
          text: 'One of the most reported abuses in Lanzarote is signing a "seasonal contract" for a home people live in all year. That lets the landlord avoid the protections of a primary-home lease, such as the minimum contract length. In the Canary Islands, Law 7/2026 (in force since 15 August 2026) added new rules to Law 6/2025 to curb this practice.',
        },
        { t: 'h2', text: 'What is now required' },
        {
          t: 'ul',
          items: [
            'Before signing, the landlord must ask the tenant, in writing and dated, why they need temporary accommodation: work, studies, health…',
            'That reason, and how it relates to the length of the contract, must be stated expressly in the contract.',
            'Stays of 31 days or less are presumed to be tourist rentals, with the obligations that entails.',
          ],
        },
        { t: 'h2', text: 'What happens if the rules are not followed' },
        {
          t: 'p',
          text: 'According to the specialist guides consulted, not asking for the reason before signing is a minor offence (up to €1,500), and signing without it stated in the contract is a serious offence (€1,501 to €30,000). The contract could also be treated as a tourist rental.',
        },
        { t: 'h2', text: 'Plus a national rule since 8 October 2026' },
        {
          t: 'p',
          text: 'Royal Decree-law 29/2026 requires, across Spain, a real and provable reason for a seasonal contract, which the landlord must prove, and a length of more than 31 days and, as a rule, no more than 12 months. Without a justified reason the contract counts as a primary-home lease from the start; the same applies if it exceeds 12 months without justification or if more than two contracts are chained between the same parties for the same home. The decree is pending validation by Congress: if it is not validated, it lapses.',
        },
        { t: 'h2', text: 'If you live there all year on a seasonal contract' },
        {
          t: 'ul',
          items: [
            'Keep a copy of the contract and of your payments.',
            'Check whether the reason for the temporary stay is stated and whether it matches your real situation.',
            'Do not sign "seasonal" renewals without getting advice first.',
            "Ask a tenants' association or union for free help: you will find links under \"What you can do\".",
            'Add your case to the observatory and tick "Seasonal contract for my primary home", so we know how common it is in each municipality.',
          ],
        },
        {
          t: 'note',
          text: 'This guide is for information only and is not legal advice. It summarises what specialist sources have published; before acting on a specific case, check the official text of Law 7/2026 (Official Gazette of the Canary Islands no. 163, 14 August 2026) or ask a professional.',
        },
      ],
    },
  },
}
