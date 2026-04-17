import { fetchJson } from "./httpClient";

const BCRA_BASE = process.env.BCRA_API_URL ?? "https://api.bcra.gob.ar";

// ─── Variable metadata (list endpoint) ───────────────────────────────────────

export interface BCRAVariable {
  idVariable: number;
  descripcion: string;
  /** ISO date of last reported value */
  ultFechaInformada: string;
  /** Latest reported value (null when unreported) */
  ultValorInformado: number | null;
}

interface BCRAListResponse {
  status: number;
  results: BCRAVariable[];
}

/**
 * Single HTTP request → Map of idVariable → BCRAVariable with latest values.
 * The first page (limit=1000) covers all IDs we need (all ≤ 44).
 */
export async function fetchBCRALatestAll(): Promise<Map<number, BCRAVariable>> {
  const data = await fetchJson<BCRAListResponse>(
    `${BCRA_BASE}/estadisticas/v4.0/Monetarias`,
  );
  return new Map(data.results.map((v) => [v.idVariable, v]));
}

// ─── Time series for a single variable ───────────────────────────────────────

export interface BCRADataPoint {
  fecha: string;
  valor: number;
}

interface BCRASeriesItem {
  idVariable: number;
  detalle: BCRADataPoint[];
}

interface BCRASeriesResponse {
  status: number;
  results: BCRASeriesItem[];
}

/** Returns time-series data for a variable, newest entry first. */
export async function fetchBCRAVariable(
  idVariable: number,
): Promise<BCRADataPoint[]> {
  const data = await fetchJson<BCRASeriesResponse>(
    `${BCRA_BASE}/estadisticas/v4.0/Monetarias/${idVariable}`,
  );
  return data.results[0]?.detalle ?? [];
}

// ─── Known variable IDs ───────────────────────────────────────────────────────

export const BCRA_VARIABLE_IDS = {
  reservas: 1, // Reservas internacionales (MM USD)
  tcMinorista: 4, // TC minorista promedio vendedor (ARS/USD)
  tcMayorista: 5, // TC mayorista referencia (ARS/USD)
  badlar: 7, // BADLAR bancos privados (% TNA)
  tm20: 8, // TM20 bancos privados (% TNA)
  tasaDepositos30d: 12, // Tasa depósitos 30 días (% TNA)
  tasaPrestamosPersonales: 14, // Tasa préstamos personales (% TNA)
  baseMon: 15, // Base monetaria (MM ARS)
  circulante: 16, // Circulación monetaria (MM ARS)
  depositosPlazo: 24, // Depósitos a plazo (MM ARS)
  prestamosPrivado: 26, // Préstamos sector privado (MM ARS)
  ipcInteranual: 28, // IPC interanual (%)
  expectativaInflacion: 29, // Expectativa inflación 12m — REM (%)
  cer: 30, // CER (base 2.2.2002=1)
  uvaAlternativo: 31, // UVA (ARS, base 31.3.2016=14.05)
  icl: 40, // ICL — Índice Contratos de Locación
  tamar: 44, // TAMAR bancos privados (% TNA)
} as const;

export type BCRAIndicatorType = keyof typeof BCRA_VARIABLE_IDS;
