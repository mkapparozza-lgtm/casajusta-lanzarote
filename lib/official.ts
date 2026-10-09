// GENERADO desde el Excel oficial SERPAVI (no editar a mano). Para actualizarlo: descargar la base de datos de
// https://www.mivau.gob.es/vivienda/alquila-bien-es-tu-derecho/serpavi, hoja "Municipios", códigos INE 35004,
// 35010, 35018, 35024, 35028, 35029, 35034, columnas ALQM2_LV_M_VC, ALQTBID12_M_VC, SLVM2_M_VC y BI_ALVHEPCO_TVC.
// Fuente: Ministerio de Vivienda y Agenda Urbana, Sistema Estatal de Referencia del Precio del Alquiler de
// Vivienda (SERPAVI), "bd_SERPAVI_2011-2024 - DEFINITIVO WEB_v2.xlsx" (marzo 2026), hoja "Municipios".
// Qué mide: alquileres de vivienda HABITUAL declarados a Hacienda (IRPF, modelo 100) en el año, vivienda
// colectiva (pisos). Incluye TODOS los contratos vigentes, también los antiguos: es un "stock", más bajo que
// los precios que se piden hoy en anuncios. No usarlo como veredicto del evaluador.

import type { MunicipioId } from './domain'

export type OfficialRent = {
  /** Mediana del alquiler mensual por m² (€/m²/mes), pisos. */
  eurM2: number
  /** Mediana del alquiler mensual de la vivienda entera (€/mes). */
  rent: number
  /** Mediana de superficie (m²). */
  m2: number
  /** Número de viviendas alquiladas declaradas. */
  contracts: number
  /** Mediana €/m² en 2019, para la variación. */
  eurM2_2019: number
}

export const OFFICIAL_YEAR = 2024
export const OFFICIAL_SOURCE_URL = 'https://serpavi.mivau.gob.es/'

export const OFFICIAL: Record<MunicipioId, OfficialRent> = {
  arrecife: { eurM2: 7.1, rent: 500, m2: 75, contracts: 3944, eurM2_2019: 5.93 },
  haria: { eurM2: 7.68, rent: 550, m2: 68, contracts: 37, eurM2_2019: 5.73 },
  sanbartolome: { eurM2: 8.57, rent: 507, m2: 63, contracts: 528, eurM2_2019: 7.63 },
  teguise: { eurM2: 9.22, rent: 611, m2: 68, contracts: 170, eurM2_2019: 8.13 },
  tias: { eurM2: 9.7, rent: 595, m2: 61, contracts: 880, eurM2_2019: 8.33 },
  tinajo: { eurM2: 8.33, rent: 512, m2: 61, contracts: 116, eurM2_2019: 6.48 },
  yaiza: { eurM2: 9.37, rent: 600, m2: 66, contracts: 194, eurM2_2019: 7.91 },
}

/** Provincia de Las Palmas, mismo indicador (referencia). */
export const OFFICIAL_PROVINCE = { eurM2: 7.6, rent: 550, m2: 76, contracts: 48341, eurM2_2019: 6.28 }
