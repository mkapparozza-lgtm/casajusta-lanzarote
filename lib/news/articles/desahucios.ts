import type { Article } from '../types'

// ATENCIÓN: la parte de vulnerabilidad depende del RDL 29/2026 (en vigor 8-10-2026, pendiente de convalidación).
// La moratoria anterior (RDL 2/2026) fue derogada el 26-2-2026. Revisar y actualizar `updated` tras la convalidación.
export const desahucios: Article = {
  slug: 'desahucio-que-hacer-lanzarote',
  date: '2026-10-10',
  sources: [
    {
      name: 'Ilex Tax & Legal',
      title: 'Nuevas reglas para el alquiler de vivienda: lo que cambia con los Reales Decretos-leyes 28/2026 y 29/2026',
      url: 'https://ilextaxlegal.com/2026/10/09/nuevas-reglas-para-el-alquiler-de-vivienda-lo-que-cambia-con-los-reales-decretos-leyes-28-2026-y-29-2026/',
      date: '2026-10-09',
    },
    {
      name: 'idealista/news',
      title: 'El Congreso rechaza otra vez el decreto antidesahucios y deja la moratoria sin efectos jurídicos',
      url: 'https://www.idealista.com/news/inmobiliario/vivienda/2026/02/26/886231-el-congreso-rechaza-otra-vez-el-decreto-antidesahucios-y-deja-la-moratoria-sin',
      date: '2026-02-26',
    },
    {
      name: 'BOE',
      title: 'Ley 1/2000, de Enjuiciamiento Civil (texto consolidado)',
      url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323',
      date: 'consolidado',
    },
    {
      name: 'BOE',
      title: 'Ley 12/2023, de 24 de mayo, por el derecho a la vivienda',
      url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203',
      date: '2023-05-25',
    },
  ],
  i18n: {
    es: {
      title: 'Me quieren desahuciar: qué hacer, paso a paso, en Lanzarote',
      description:
        'Si te llega una demanda de desahucio, los plazos son muy cortos. Qué hacer en los primeros días, a quién pedir ayuda gratis y qué protección hay hoy.',
      body: [
        {
          t: 'p',
          text: 'Recibir una demanda o un requerimiento de desahucio da miedo, y el miedo hace que mucha gente no haga nada. Es justo lo que hay que evitar: los plazos son de días. Esta guía resume qué hacer, con la situación legal a 10 de octubre de 2026.',
        },
        { t: 'h2', text: 'En los primeros días' },
        {
          t: 'ul',
          items: [
            'No ignores ninguna notificación del juzgado. Lee la fecha en que la recibiste: el plazo para responder suele ser de 10 días hábiles.',
            'Pide asistencia jurídica gratuita ese mismo día en el Servicio de Orientación Jurídica del Colegio de Abogados de Lanzarote o en el juzgado. Si la pides dentro del plazo, este puede quedar en suspenso hasta que te asignen abogado.',
            'Ve a los servicios sociales de tu ayuntamiento y explica tu situación: su informe es clave si eres un hogar vulnerable.',
            'Reúne el contrato, los justificantes de pago y cualquier mensaje con el propietario.',
          ],
        },
        { t: 'h2', text: 'Si el desahucio es por impago' },
        {
          t: 'p',
          text: 'En el plazo que te da el juzgado puedes pagar, dejar la vivienda u oponerte explicando tus motivos. En algunos casos, pagar toda la deuda en ese plazo detiene el desahucio (se llama enervación), pero solo se puede hacer una vez y no siempre es posible: pregúntaselo a tu abogado.',
        },
        { t: 'h2', text: 'Si eres un hogar vulnerable' },
        {
          t: 'p',
          text: 'Desde la Ley 12/2023, el juzgado debe tener en cuenta la vulnerabilidad e informar a los servicios sociales, y puede suspender el procedimiento un tiempo para buscar una solución. La moratoria general para hogares vulnerables, que se fue prorrogando desde 2020, quedó sin efecto en febrero de 2026, cuando el Congreso no convalidó el Real Decreto-ley 2/2026.',
        },
        {
          t: 'p',
          text: 'El Real Decreto-ley 29/2026, en vigor desde el 8 de octubre de 2026, establece una nueva protección hasta finales de 2030: en desahucios por impago de hogares vulnerables, la administración tiene dos meses para ofrecer una alternativa de vivienda o pagar la deuda, y mientras tanto el procedimiento se suspende; en otros desahucios (fin de contrato, precario), el juez puede suspender el lanzamiento hasta tres años si no hay alternativa habitacional. Se aplica también a procedimientos ya abiertos en los que no se haya producido el lanzamiento.',
        },
        {
          t: 'note',
          text: 'Importante: el RDL 29/2026 debe ser convalidado por el Congreso en 30 días. Si no se convalida, esta protección decae. Actualizaremos esta guía con el resultado.',
        },
        { t: 'h2', text: 'No estás sola ni solo' },
        {
          t: 'p',
          text: 'En Lanzarote hay colectivos que acompañan a las familias amenazadas de desahucio, como la Asamblea Ciudadana por el Derecho a la Vivienda que se reúne en Arrecife. En «Qué puedes hacer», en la portada, tienes contactos de asociaciones que asesoran gratis.',
        },
        {
          t: 'note',
          text: 'Guía informativa, no es asesoramiento legal. Cada caso es distinto: habla cuanto antes con un abogado o abogada, aunque sea de oficio.',
        },
      ],
    },
    it: {
      title: 'Vogliono sfrattarmi: cosa fare, passo per passo, a Lanzarote',
      description:
        "Se ti arriva una causa di sfratto, i tempi sono molto brevi. Cosa fare nei primi giorni, a chi chiedere aiuto gratis e che protezione c'è oggi.",
      body: [
        {
          t: 'p',
          text: "Ricevere una causa o un'intimazione di sfratto fa paura, e la paura porta molte persone a non fare nulla. È proprio quello da evitare: i termini sono di pochi giorni. Questa guida riassume cosa fare, con la situazione legale al 10 ottobre 2026.",
        },
        { t: 'h2', text: 'Nei primi giorni' },
        {
          t: 'ul',
          items: [
            'Non ignorare nessuna notifica del tribunale. Guarda la data in cui l\'hai ricevuta: il termine per rispondere di solito è di 10 giorni lavorativi.',
            "Chiedi il gratuito patrocinio (asistencia jurídica gratuita) lo stesso giorno al Servicio de Orientación Jurídica dell'Ordine degli Avvocati di Lanzarote o in tribunale. Se lo chiedi entro il termine, questo può restare sospeso finché non ti assegnano un avvocato.",
            'Vai ai servizi sociali del tuo comune e spiega la tua situazione: la loro relazione è fondamentale se sei una famiglia vulnerabile.',
            'Raccogli il contratto, le ricevute dei pagamenti e i messaggi con il proprietario.',
          ],
        },
        { t: 'h2', text: 'Se lo sfratto è per morosità' },
        {
          t: 'p',
          text: "Nel termine indicato dal tribunale puoi pagare, lasciare la casa oppure opporti spiegando le tue ragioni. In alcuni casi pagare tutto il debito entro il termine ferma lo sfratto (si chiama enervación), ma si può fare una sola volta e non sempre è possibile: chiedilo al tuo avvocato.",
        },
        { t: 'h2', text: 'Se sei una famiglia vulnerabile' },
        {
          t: 'p',
          text: "Dalla Legge 12/2023 il tribunale deve tenere conto della vulnerabilità e informare i servizi sociali, e può sospendere il procedimento per un periodo per cercare una soluzione. La moratoria generale per le famiglie vulnerabili, prorogata dal 2020, è decaduta a febbraio 2026, quando il Congresso non ha convalidato il Real Decreto-ley 2/2026.",
        },
        {
          t: 'p',
          text: "Il Real Decreto-ley 29/2026, in vigore dall'8 ottobre 2026, introduce una nuova protezione fino a fine 2030: negli sfratti per morosità di famiglie vulnerabili l'amministrazione ha due mesi per offrire un'alternativa abitativa o pagare il debito, e nel frattempo il procedimento è sospeso; negli altri sfratti (fine contratto, occupazione senza titolo) il giudice può sospendere lo sgombero fino a tre anni se non c'è un'alternativa abitativa. Vale anche per i procedimenti già aperti in cui lo sgombero non è ancora avvenuto.",
        },
        {
          t: 'note',
          text: 'Importante: il RDL 29/2026 deve essere convalidato dal Congresso entro 30 giorni. Se non viene convalidato, questa protezione decade. Aggiorneremo questa guida con il risultato.',
        },
        { t: 'h2', text: 'Non sei solo né sola' },
        {
          t: 'p',
          text: "A Lanzarote ci sono collettivi che accompagnano le famiglie minacciate di sfratto, come l'Assemblea cittadina per il diritto alla casa che si riunisce ad Arrecife. In «Cosa puoi fare», nella home, trovi i contatti di associazioni che offrono consulenza gratuita.",
        },
        {
          t: 'note',
          text: "Guida informativa, non è consulenza legale. Ogni caso è diverso: parla il prima possibile con un avvocato, anche d'ufficio.",
        },
      ],
    },
    en: {
      title: 'I am being evicted: what to do, step by step, in Lanzarote',
      description:
        'If you receive an eviction claim, deadlines are very short. What to do in the first days, where to get free help and what protection exists today.',
      body: [
        {
          t: 'p',
          text: 'Receiving an eviction claim or notice is frightening, and fear makes many people do nothing. That is exactly what to avoid: the deadlines are a matter of days. This guide summarises what to do, with the legal situation as of 10 October 2026.',
        },
        { t: 'h2', text: 'In the first days' },
        {
          t: 'ul',
          items: [
            'Do not ignore any court notice. Check the date you received it: the deadline to respond is usually 10 working days.',
            'Request free legal aid (asistencia jurídica gratuita) that same day at the legal guidance service of the Lanzarote Bar Association or at the court. If you request it within the deadline, the deadline may be put on hold until a lawyer is assigned.',
            'Go to your town council\'s social services and explain your situation: their report is key if your household is vulnerable.',
            'Gather your contract, proof of payments and any messages with the landlord.',
          ],
        },
        { t: 'h2', text: 'If the eviction is for unpaid rent' },
        {
          t: 'p',
          text: 'Within the deadline set by the court you can pay, leave the home, or oppose it explaining your reasons. In some cases, paying the whole debt within that deadline stops the eviction (this is called enervación), but it can only be done once and is not always possible: ask your lawyer.',
        },
        { t: 'h2', text: 'If your household is vulnerable' },
        {
          t: 'p',
          text: 'Since Law 12/2023, courts must take vulnerability into account and inform social services, and they can suspend proceedings for a time to look for a solution. The general moratorium for vulnerable households, extended repeatedly since 2020, lapsed in February 2026 when Congress did not validate Royal Decree-law 2/2026.',
        },
        {
          t: 'p',
          text: 'Royal Decree-law 29/2026, in force since 8 October 2026, sets out new protection until the end of 2030: in evictions of vulnerable households for unpaid rent, the authorities have two months to offer alternative housing or pay the debt, and the proceedings are suspended meanwhile; in other evictions (end of contract, occupation without title), the judge can suspend the eviction for up to three years if there is no housing alternative. It also applies to proceedings already open where the eviction has not yet taken place.',
        },
        {
          t: 'note',
          text: 'Important: RDL 29/2026 must be validated by Congress within 30 days. If it is not, this protection lapses. We will update this guide with the outcome.',
        },
        { t: 'h2', text: 'You are not alone' },
        {
          t: 'p',
          text: 'In Lanzarote there are groups that support families facing eviction, such as the Citizen Assembly for the Right to Housing that meets in Arrecife. Under "What you can do" on the home page you will find associations that give free advice.',
        },
        {
          t: 'note',
          text: 'Information guide, not legal advice. Every case is different: talk to a lawyer as soon as possible, even a legal-aid one.',
        },
      ],
    },
  },
}
