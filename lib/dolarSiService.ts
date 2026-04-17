const DOLAR_API_BASE = process.env.DOLAR_API_URL ?? "https://dolarapi.com/v1";
const FETCH_TIMEOUT_MS = 8_000;

interface DolarApiItem {
  moneda: string;
  casa: string;
  compra: number | null;
  venta: number | null;
}

type PriceNode = { compra: number | null; venta: number | null };

export interface AppData {
  dollars: Record<string, PriceNode>;
  currencies: Record<string, PriceNode>;
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchDolarSi(): Promise<AppData> {
  const [dollarsRaw, currenciesRaw] = await Promise.all([
    fetchJson<DolarApiItem[]>(`${DOLAR_API_BASE}/dolares`),
    fetchJson<DolarApiItem[]>(`${DOLAR_API_BASE}/cotizaciones`),
  ]);

  const dollars = Object.fromEntries(
    dollarsRaw.map(({ casa, compra, venta }) => [casa, { compra, venta }]),
  );
  const currencies = Object.fromEntries(
    currenciesRaw.map(({ moneda, compra, venta }) => [
      moneda,
      { compra, venta },
    ]),
  );

  return { dollars, currencies };
}
