import type { Article } from '../types'

// ATENCIÓN: depende del RDL 29/2026 (en vigor 8-10-2026, pendiente de convalidación en 30 días) y del RDL 28/2026
// (entra en vigor el 15-11-2026). Revisar y actualizar `updated` cuando se convaliden o decaigan.
export const subidaRenovar: Article = {
  slug: 'subida-alquiler-al-renovar-cuanto-pueden-subir',
  date: '2026-10-10',
  sources: [
    {
      name: 'Ilex Tax & Legal',
      title: 'Nuevas reglas para el alquiler de vivienda: lo que cambia con los Reales Decretos-leyes 28/2026 y 29/2026',
      url: 'https://ilextaxlegal.com/2026/10/09/nuevas-reglas-para-el-alquiler-de-vivienda-lo-que-cambia-con-los-reales-decretos-leyes-28-2026-y-29-2026/',
      date: '2026-10-09',
    },
    {
      name: 'Apivirtual',
      title: 'Real Decreto-ley 29/2026 de vivienda: qué cambia para inquilinos, propietarios y agentes inmobiliarios',
      url: 'https://www.apivirtual.com/real-decreto-ley-29-2026-vivienda-que-cambia/',
      date: '2026-10',
    },
    {
      name: 'BOE',
      title: 'Ley 29/1994, de Arrendamientos Urbanos (texto consolidado)',
      url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003',
      date: 'consolidado',
    },
    {
      name: 'INE',
      title: 'Índice de Referencia para la Actualización Anual de los Contratos de Arrendamiento de Vivienda (IRAV)',
      url: 'https://www.ine.es/',
      date: 'mensual',
    },
  ],
  i18n: {
    es: {
      title: 'Me suben el alquiler al renovar: cuánto pueden subirlo y qué hacer',
      description:
        'Límites a la subida anual, el tope del 2% hasta 2027 y la prórroga de dos años del RDL 29/2026. Situación a 10 de octubre de 2026, explicada paso a paso.',
      body: [
        {
          t: 'p',
          text: '«Subida abusiva al renovar» es uno de los abusos que más se repiten en el observatorio. Pero no todas las subidas son iguales: depende de cuándo firmaste, de en qué momento del contrato estás y de lo que diga tu contrato. Esta guía resume las reglas a 10 de octubre de 2026.',
        },
        { t: 'h2', text: '1. Mientras dura tu contrato: solo la actualización anual' },
        {
          t: 'ul',
          items: [
            'Durante los primeros cinco años (siete si el propietario es una empresa), el contrato se prorroga obligatoriamente si tú quieres, y el precio solo puede cambiar con la actualización anual.',
            'Si tu contrato no tiene una cláusula de actualización, no te la pueden aplicar.',
            'Si firmaste a partir del 26 de mayo de 2023, la actualización nunca puede superar el IRAV, el índice que publica cada mes el INE.',
            'Si firmaste antes, se aplica lo que diga el contrato (normalmente el IPC).',
          ],
        },
        { t: 'h2', text: '2. Lo nuevo: tope del 2% hasta finales de 2027' },
        {
          t: 'p',
          text: 'El Real Decreto-ley 29/2026, en vigor desde el 8 de octubre de 2026, establece que en las actualizaciones que toquen entre esa fecha y el 31 de diciembre de 2027, si no hay un nuevo acuerdo entre las partes, la subida no puede pasar del 2%. Y si tu alquiler ya supera el máximo del sistema estatal de índices de referencia, no se puede subir.',
        },
        { t: 'h2', text: '3. Al terminar el contrato: la prórroga extraordinaria' },
        {
          t: 'p',
          text: 'Cuando acaba la prórroga obligatoria, el propietario puede proponer un precio nuevo. Pero el mismo decreto permite al inquilino pedir hasta dos años más, por anualidades, con las condiciones del contrato actual, si la prórroga termina antes del 31 de diciembre de 2028 y estás al corriente de pago desde hace ocho meses. El propietario puede negarse, por ejemplo, si necesita la vivienda para él o su familia.',
        },
        {
          t: 'p',
          text: 'Además, el Real Decreto-ley 28/2026, que entra en vigor el 15 de noviembre de 2026, prevé una prórroga automática de cinco años (siete si el propietario es una empresa) al llegar al final del contrato y amplía de cuatro a seis meses el preaviso del propietario.',
        },
        {
          t: 'note',
          text: 'Importante: los dos decretos deben ser convalidados por el Congreso en 30 días. Si no se convalidan, decaen (como pasó con los RDL 26 y 27/2026 el 2 de octubre). Actualizaremos esta guía con el resultado.',
        },
        { t: 'h2', text: 'Qué hacer si te comunican una subida' },
        {
          t: 'ul',
          items: [
            'Mira la fecha de tu contrato y si tiene cláusula de actualización.',
            'Pide por escrito cómo se ha calculado la subida y con qué índice.',
            'Si supera el límite que te corresponde, responde por escrito que solo aceptas la actualización legal.',
            'No firmes un contrato nuevo bajo presión sin asesorarte: puedes perder la prórroga a la que tienes derecho.',
            'Pide ayuda gratuita a una asociación de inquilinas (enlaces en «Qué puedes hacer») y añade tu caso al observatorio con el precio anterior y el nuevo.',
          ],
        },
        {
          t: 'note',
          text: 'Guía informativa, no es asesoramiento legal. Antes de actuar en un caso concreto, consulta el texto del BOE o a un profesional.',
        },
      ],
    },
    it: {
      title: "Mi aumentano l'affitto al rinnovo: quanto possono alzarlo e cosa fare",
      description:
        "Limiti all'aumento annuale, il tetto del 2% fino al 2027 e la proroga di due anni del RDL 29/2026. Situazione al 10 ottobre 2026, spiegata passo per passo.",
      body: [
        {
          t: 'p',
          text: "«Aumento abusivo al rinnovo» è uno degli abusi più segnalati nell'osservatorio. Ma non tutti gli aumenti sono uguali: dipende da quando hai firmato, da che punto del contratto ti trovi e da cosa dice il contratto. Questa guida riassume le regole al 10 ottobre 2026.",
        },
        { t: 'h2', text: "1. Durante il contratto: solo l'aggiornamento annuale" },
        {
          t: 'ul',
          items: [
            "Nei primi cinque anni (sette se il proprietario è un'azienda) il contratto si proroga obbligatoriamente se lo vuoi tu, e il prezzo può cambiare solo con l'aggiornamento annuale.",
            "Se il contratto non ha una clausola di aggiornamento, non possono applicartelo.",
            "Se hai firmato dal 26 maggio 2023 in poi, l'aggiornamento non può mai superare l'IRAV, l'indice che l'INE pubblica ogni mese.",
            'Se hai firmato prima, vale quello che dice il contratto (di solito l\'IPC).',
          ],
        },
        { t: 'h2', text: '2. La novità: tetto del 2% fino a fine 2027' },
        {
          t: 'p',
          text: "Il Real Decreto-ley 29/2026, in vigore dall'8 ottobre 2026, stabilisce che negli aggiornamenti che cadono tra quella data e il 31 dicembre 2027, se non c'è un nuovo accordo tra le parti, l'aumento non può superare il 2%. E se il tuo affitto supera già il massimo del sistema statale di indici di riferimento, non può essere aumentato.",
        },
        { t: 'h2', text: '3. Alla fine del contratto: la proroga straordinaria' },
        {
          t: 'p',
          text: "Quando finisce la proroga obbligatoria, il proprietario può proporre un nuovo prezzo. Ma lo stesso decreto permette all'inquilino di chiedere fino a due anni in più, un anno alla volta, alle condizioni del contratto attuale, se la proroga termina prima del 31 dicembre 2028 e sei in regola con i pagamenti da otto mesi. Il proprietario può rifiutare, per esempio, se ha bisogno della casa per sé o per la famiglia.",
        },
        {
          t: 'p',
          text: "Inoltre il Real Decreto-ley 28/2026, che entra in vigore il 15 novembre 2026, prevede una proroga automatica di cinque anni (sette se il proprietario è un'azienda) alla scadenza del contratto e porta da quattro a sei mesi il preavviso del proprietario.",
        },
        {
          t: 'note',
          text: 'Importante: i due decreti devono essere convalidati dal Congresso entro 30 giorni. Se non vengono convalidati decadono (come è successo ai RDL 26 e 27/2026 il 2 ottobre). Aggiorneremo questa guida con il risultato.',
        },
        { t: 'h2', text: 'Cosa fare se ti comunicano un aumento' },
        {
          t: 'ul',
          items: [
            'Controlla la data del contratto e se ha una clausola di aggiornamento.',
            "Chiedi per iscritto come è stato calcolato l'aumento e con quale indice.",
            "Se supera il limite che ti spetta, rispondi per iscritto che accetti solo l'aggiornamento previsto dalla legge.",
            'Non firmare un nuovo contratto sotto pressione senza consiglio: potresti perdere la proroga a cui hai diritto.',
            "Chiedi aiuto gratuito a un sindacato degli inquilini (contatti in «Cosa puoi fare») e aggiungi il tuo caso all'osservatorio con il prezzo precedente e quello nuovo.",
          ],
        },
        {
          t: 'note',
          text: 'Guida informativa, non è consulenza legale. Prima di agire su un caso concreto, consulta il testo del BOE o un professionista.',
        },
      ],
    },
    en: {
      title: 'My rent is going up at renewal: how much can they raise it and what to do',
      description:
        'Limits on the annual increase, the 2% cap until 2027 and the two-year extension in RDL 29/2026. The situation as of 10 October 2026, step by step.',
      body: [
        {
          t: 'p',
          text: '"Abusive increase on renewal" is one of the most reported abuses in the observatory. But not every increase is the same: it depends on when you signed, where you are in the contract and what the contract says. This guide summarises the rules as of 10 October 2026.',
        },
        { t: 'h2', text: '1. While your contract runs: only the annual update' },
        {
          t: 'ul',
          items: [
            'For the first five years (seven if the landlord is a company), the contract is extended compulsorily if you want it, and the price can only change through the annual update.',
            'If your contract has no update clause, it cannot be applied.',
            'If you signed on or after 26 May 2023, the update can never exceed the IRAV, the index published monthly by Spain\'s statistics office (INE).',
            'If you signed earlier, whatever the contract says applies (usually CPI).',
          ],
        },
        { t: 'h2', text: '2. What is new: a 2% cap until the end of 2027' },
        {
          t: 'p',
          text: 'Royal Decree-law 29/2026, in force since 8 October 2026, says that for updates falling between that date and 31 December 2027, unless the parties agree otherwise, the increase cannot exceed 2%. And if your rent is already above the maximum of the state reference-index system, it cannot be raised.',
        },
        { t: 'h2', text: '3. When the contract ends: the extraordinary extension' },
        {
          t: 'p',
          text: 'When the compulsory extension ends, the landlord can propose a new price. But the same decree lets tenants request up to two more years, one year at a time, on the current terms, if the extension ends before 31 December 2028 and they have been up to date with rent for eight months. The landlord can refuse, for example, if they need the home for themselves or their family.',
        },
        {
          t: 'p',
          text: 'In addition, Royal Decree-law 28/2026, which comes into force on 15 November 2026, provides for an automatic five-year extension (seven if the landlord is a company) when the contract ends, and raises the landlord\'s notice period from four to six months.',
        },
        {
          t: 'note',
          text: 'Important: both decrees must be validated by Congress within 30 days. If they are not, they lapse (as RDL 26 and 27/2026 did on 2 October). We will update this guide with the outcome.',
        },
        { t: 'h2', text: 'What to do if you are told about an increase' },
        {
          t: 'ul',
          items: [
            'Check the date of your contract and whether it has an update clause.',
            'Ask in writing how the increase was calculated and with which index.',
            'If it exceeds your limit, reply in writing that you only accept the legal update.',
            'Do not sign a new contract under pressure without advice: you could lose the extension you are entitled to.',
            "Ask a tenants' union for free help (links under \"What you can do\") and add your case to the observatory with the old and new price.",
          ],
        },
        {
          t: 'note',
          text: 'Information guide, not legal advice. Before acting on a specific case, check the text in the BOE or ask a professional.',
        },
      ],
    },
  },
}
