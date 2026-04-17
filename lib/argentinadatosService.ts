import { fetchJson } from "./httpClient";

const ARGENTINADATOS_BASE =
  process.env.ARGENTINADATOS_URL ?? "https://api.argentinadatos.com/v1";

// ─── Country risk ─────────────────────────────────────────────────────────────

export interface CountryRiskEntry {
  valor: number;
  fecha: string;
}

export async function fetchCountryRisk(): Promise<CountryRiskEntry[]> {
  return fetchJson<CountryRiskEntry[]>(
    `${ARGENTINADATOS_BASE}/finanzas/indices/riesgo-pais`,
  );
}

// ─── Dollar / other currency history ─────────────────────────────────────────

export interface DollarHistoryEntry {
  casa: string;
  compra: number | null;
  venta: number | null;
  fecha: string;
}

export async function fetchDollarHistory(
  tipo: string,
): Promise<DollarHistoryEntry[]> {
  return fetchJson<DollarHistoryEntry[]>(
    `${ARGENTINADATOS_BASE}/cotizaciones/dolares/${tipo}`,
  );
}

export interface CotizacionEntry {
  moneda: string;
  compra: number | null;
  venta: number | null;
  fecha: string;
}

export async function fetchCotizacionHistory(): Promise<CotizacionEntry[]> {
  return fetchJson<CotizacionEntry[]>(`${ARGENTINADATOS_BASE}/cotizaciones`);
}

// ─── Macroeconomic indices ────────────────────────────────────────────────────

export interface IndiceEntry {
  fecha: string;
  valor: number;
}

export async function fetchInflacion(): Promise<IndiceEntry[]> {
  return fetchJson<IndiceEntry[]>(
    `${ARGENTINADATOS_BASE}/finanzas/indices/inflacion`,
  );
}

export async function fetchUVA(): Promise<IndiceEntry[]> {
  return fetchJson<IndiceEntry[]>(
    `${ARGENTINADATOS_BASE}/finanzas/indices/uva`,
  );
}

// ─── Tasas ────────────────────────────────────────────────────────────────────

export interface PlazoFijoEntry {
  entidad: string;
  logo: string;
  tnaClientes: number;
  tnaNoClientes: number;
}

export async function fetchPlazoFijo(): Promise<PlazoFijoEntry[]> {
  return fetchJson<PlazoFijoEntry[]>(
    `${ARGENTINADATOS_BASE}/finanzas/tasas/plazoFijo`,
  );
}
