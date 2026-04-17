import type { AppData } from "@/lib/dolarSiService";
import { fetchDolarSi } from "@/lib/dolarSiService";
import {
  fetchCountryRisk,
  fetchInflacion,
  fetchPlazoFijo,
} from "@/lib/argentinadatosService";
import {
  fetchBCRALatestAll,
  BCRA_VARIABLE_IDS,
  type BCRAVariable,
} from "@/lib/bcraService";
import {
  DOLLAR_MAP,
  EURO_MAP,
  REAL_MAP,
  PESO_CHILENO_MAP,
  PESO_URUGUAYO_MAP,
} from "@/lib/quotes";
import type { QuoteConfig } from "@/lib/quotes";
import { formatNumber, getDateTime } from "@/lib/utils";
import type { SimpleQuote } from "@/lib/types";
import { DashboardTabs, type LatestValue } from "@/components/DashboardTabs";

function safeQuote(data: AppData, config: QuoteConfig): SimpleQuote {
  try {
    return {
      date: getDateTime(),
      buy: formatNumber(config.getBuy(data)),
      sell: formatNumber(config.getSell(data)),
      currency: config.currency,
    };
  } catch {
    return {
      date: getDateTime(),
      buy: "N/A",
      sell: "N/A",
      currency: config.currency,
    };
  }
}

function buildQuoteMap(
  data: AppData,
  map: Record<string, QuoteConfig>,
): Record<string, SimpleQuote> {
  return Object.fromEntries(
    Object.entries(map).map(([k, cfg]) => [k, safeQuote(data, cfg)]),
  );
}

function toLatest(v: BCRAVariable | undefined): LatestValue | null {
  if (!v) return null;
  const valor = v.ultValorInformado;
  if (valor == null) return null;
  return { valor, fecha: v.ultFechaInformada };
}

export default async function DashboardPage() {
  const [rawData, riskData, inflacionData, allBcraData, plazoFijoData] =
    await Promise.all([
      fetchDolarSi().catch(() => null),
      fetchCountryRisk().catch(() => null),
      fetchInflacion().catch(() => null),
      fetchBCRALatestAll().catch(() => null),
      fetchPlazoFijo().catch(() => null),
    ]);

  const b = (key: keyof typeof BCRA_VARIABLE_IDS) =>
    toLatest(allBcraData?.get(BCRA_VARIABLE_IDS[key]));

  const dollarData = rawData ? buildQuoteMap(rawData, DOLLAR_MAP) : {};
  const euroQuote = rawData ? safeQuote(rawData, EURO_MAP.oficial) : null;
  const realQuote = rawData ? safeQuote(rawData, REAL_MAP.oficial) : null;
  const clpQuote = rawData
    ? safeQuote(rawData, PESO_CHILENO_MAP.oficial)
    : null;
  const uyuQuote = rawData
    ? safeQuote(rawData, PESO_URUGUAYO_MAP.oficial)
    : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dólar Argentina</h1>
        <p className="mt-1 text-sm text-gray-500">
          Cotizaciones en tiempo real · Fuentes: dolarapi.com · argentinadatos.com · bcra.gob.ar
        </p>
        {!rawData && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            No se pudo conectar con la fuente de datos. Intentá de nuevo en unos
            momentos.
          </div>
        )}
      </header>

      <DashboardTabs
        dollarData={dollarData}
        euroQuote={euroQuote}
        realQuote={realQuote}
        clpQuote={clpQuote}
        uyuQuote={uyuQuote}
        reservas={b("reservas")}
        tcMinorista={b("tcMinorista")}
        tcMayorista={b("tcMayorista")}
        baseMon={b("baseMon")}
        circulante={b("circulante")}
        prestamosPrivado={b("prestamosPrivado")}
        depositosPlazo={b("depositosPlazo")}
        badlar={b("badlar")}
        tamar={b("tamar")}
        tm20={b("tm20")}
        tasaDepositos30d={b("tasaDepositos30d")}
        tasaPrestamosPersonales={b("tasaPrestamosPersonales")}
        plazoFijo={plazoFijoData}
        inflacion={inflacionData?.at(-1) ?? null}
        ipcInteranual={b("ipcInteranual")}
        expectativaInflacion={b("expectativaInflacion")}
        cer={b("cer")}
        uvaAlternativo={b("uvaAlternativo")}
        icl={b("icl")}
        countryRisk={riskData?.at(-1) ?? null}
      />

      <footer className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
        API Dólar Argentina · dolarapi.com · argentinadatos.com · bcra.gob.ar
      </footer>
    </main>
  );
}
