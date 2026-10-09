import type { Article } from '../types'

// Cifras tomadas de lib/official.ts (SERPAVI 2024 vs 2019, pisos). Si se actualiza SERPAVI, revisar este texto.
export const hacienda2024: Article = {
  slug: 'alquiler-lanzarote-hacienda-subida-por-municipio',
  date: '2026-10-10',
  sources: [
    {
      name: 'Ministerio de Vivienda y Agenda Urbana',
      title: 'Sistema Estatal de Referencia del Precio del Alquiler de Vivienda (SERPAVI), base de datos 2011-2024',
      url: 'https://serpavi.mivau.gob.es/',
      date: '2026-03-09',
    },
  ],
  i18n: {
    es: {
      title: 'El alquiler en Lanzarote sube hasta un 34% desde 2019, según Hacienda',
      description:
        'Datos oficiales de 2024 municipio por municipio: Tías, Yaiza y Teguise, los más caros; Haría y Tinajo, los que más suben. Lo que dicen y lo que no.',
      body: [
        {
          t: 'p',
          text: 'El Ministerio de Vivienda publica cada año el alquiler que los propietarios declaran a Hacienda. Los datos de 2024, publicados en marzo de 2026, permiten comparar los siete municipios de Lanzarote con 2019. Hablamos de pisos alquilados como vivienda habitual.',
        },
        { t: 'h2', text: 'Dónde es más caro' },
        {
          t: 'ul',
          items: [
            'Tías: 9,70 €/m² al mes (595 € de alquiler mediano).',
            'Yaiza: 9,37 €/m² (600 €).',
            'Teguise: 9,22 €/m² (611 €).',
            'San Bartolomé: 8,57 €/m² (507 €).',
            'Tinajo: 8,33 €/m² (512 €).',
            'Haría: 7,68 €/m² (550 €).',
            'Arrecife: 7,10 €/m² (500 €).',
          ],
        },
        { t: 'h2', text: 'Dónde más ha subido desde 2019' },
        {
          t: 'p',
          text: 'Haría (+34%) y Tinajo (+29%) son los municipios donde más ha subido el precio por metro cuadrado, seguidos de Arrecife (+20%), Yaiza (+18%), Tías (+16%), Teguise (+13%) y San Bartolomé (+12%). En el conjunto de la provincia de Las Palmas la subida es del 21%. En Haría la muestra es pequeña (37 pisos declarados), así que su cifra es menos estable.',
        },
        { t: 'h2', text: 'Por qué estas cifras parecen bajas' },
        {
          t: 'p',
          text: 'Son contratos vigentes, también los firmados hace años, que suelen tener rentas más bajas. Por eso quedan muy por debajo de lo que se pide hoy en los anuncios: en la provincia, 7,60 €/m² según Hacienda frente a 15,56 €/m² de media en idealista (abril de 2026). La diferencia es, en sí misma, una señal: quien busca casa hoy paga mucho más que quien ya la tiene.',
        },
        {
          t: 'p',
          text: 'Para saber cuánto se paga hoy hacen falta casos recientes. Por eso el observatorio de CasaJusta recoge contratos y anuncios de forma anónima, y publica la mediana de cada municipio cuando llega a 5 casos.',
        },
        {
          t: 'note',
          text: 'Mira la tabla completa en «Lo que dice Hacienda, municipio por municipio» en la portada, y añade tu caso si vives de alquiler en Lanzarote.',
        },
      ],
    },
    it: {
      title: "L'affitto a Lanzarote sale fino al 34% dal 2019, secondo il fisco",
      description:
        'Dati ufficiali 2024 comune per comune: Tías, Yaiza e Teguise i più cari; Haría e Tinajo quelli che salgono di più. Cosa dicono e cosa no.',
      body: [
        {
          t: 'p',
          text: "Il Ministero spagnolo della Casa pubblica ogni anno gli affitti che i proprietari dichiarano al fisco. I dati del 2024, pubblicati a marzo 2026, permettono di confrontare i sette comuni di Lanzarote con il 2019. Parliamo di appartamenti affittati come abitazione abituale.",
        },
        { t: 'h2', text: 'Dove costa di più' },
        {
          t: 'ul',
          items: [
            'Tías: 9,70 €/m² al mese (595 € di affitto mediano).',
            'Yaiza: 9,37 €/m² (600 €).',
            'Teguise: 9,22 €/m² (611 €).',
            'San Bartolomé: 8,57 €/m² (507 €).',
            'Tinajo: 8,33 €/m² (512 €).',
            'Haría: 7,68 €/m² (550 €).',
            'Arrecife: 7,10 €/m² (500 €).',
          ],
        },
        { t: 'h2', text: 'Dove è salito di più dal 2019' },
        {
          t: 'p',
          text: "Haría (+34%) e Tinajo (+29%) sono i comuni dove il prezzo al metro quadro è salito di più, seguiti da Arrecife (+20%), Yaiza (+18%), Tías (+16%), Teguise (+13%) e San Bartolomé (+12%). Nell'insieme della provincia di Las Palmas l'aumento è del 21%. A Haría il campione è piccolo (37 appartamenti dichiarati), quindi il dato è meno stabile.",
        },
        { t: 'h2', text: 'Perché questi numeri sembrano bassi' },
        {
          t: 'p',
          text: "Sono contratti in corso, compresi quelli firmati anni fa, che di solito hanno affitti più bassi. Per questo restano molto sotto quanto si chiede oggi negli annunci: in provincia 7,60 €/m² secondo il fisco contro 15,56 €/m² di media su idealista (aprile 2026). La differenza è già un segnale: chi cerca casa oggi paga molto di più di chi ce l'ha già.",
        },
        {
          t: 'p',
          text: "Per sapere quanto si paga oggi servono casi recenti. Per questo l'osservatorio di CasaJusta raccoglie contratti e annunci in forma anonima e pubblica la mediana di ogni comune quando arriva a 5 casi.",
        },
        {
          t: 'note',
          text: "Guarda la tabella completa in «Cosa dice il fisco, comune per comune» nella home, e aggiungi il tuo caso se vivi in affitto a Lanzarote.",
        },
      ],
    },
    en: {
      title: 'Rent in Lanzarote up as much as 34% since 2019, tax data shows',
      description:
        'Official 2024 data by municipality: Tías, Yaiza and Teguise are the priciest; Haría and Tinajo rose the most. What the data says and what it does not.',
      body: [
        {
          t: 'p',
          text: "Spain's Housing Ministry publishes every year the rents that landlords declare to the tax agency. The 2024 data, released in March 2026, lets us compare Lanzarote's seven municipalities with 2019. These are flats rented as a primary home.",
        },
        { t: 'h2', text: 'Where it is most expensive' },
        {
          t: 'ul',
          items: [
            'Tías: €9.70/m² per month (median rent €595).',
            'Yaiza: €9.37/m² (€600).',
            'Teguise: €9.22/m² (€611).',
            'San Bartolomé: €8.57/m² (€507).',
            'Tinajo: €8.33/m² (€512).',
            'Haría: €7.68/m² (€550).',
            'Arrecife: €7.10/m² (€500).',
          ],
        },
        { t: 'h2', text: 'Where it rose most since 2019' },
        {
          t: 'p',
          text: 'Haría (+34%) and Tinajo (+29%) saw the biggest rise in price per square metre, followed by Arrecife (+20%), Yaiza (+18%), Tías (+16%), Teguise (+13%) and San Bartolomé (+12%). Across the province of Las Palmas the rise is 21%. Haría has a small sample (37 flats declared), so its figure is less stable.',
        },
        { t: 'h2', text: 'Why these figures look low' },
        {
          t: 'p',
          text: 'They cover contracts in force, including ones signed years ago, which usually have lower rents. That is why they sit far below what listings ask today: in the province, €7.60/m² per the tax data versus a €15.56/m² average on idealista (April 2026). The gap is itself a signal: people looking for a home today pay much more than those who already have one.',
        },
        {
          t: 'p',
          text: "Knowing what people pay today needs recent cases. That is why CasaJusta's observatory collects contracts and listings anonymously and publishes each municipality's median once it reaches 5 cases.",
        },
        {
          t: 'note',
          text: 'See the full table under "What the tax data says, municipality by municipality" on the home page, and add your case if you rent in Lanzarote.',
        },
      ],
    },
  },
}
