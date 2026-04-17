// Facade for all external data providers.
// Import from here instead of the individual service files so that
// swapping a provider only requires changes in this file.

export type { AppData } from "./dolarSiService";
export { fetchDolarSi } from "./dolarSiService";

export type {
  CountryRiskEntry,
  DollarHistoryEntry,
  CotizacionEntry,
  IndiceEntry,
  PlazoFijoEntry,
} from "./argentinadatosService";
export {
  fetchCountryRisk,
  fetchDollarHistory,
  fetchCotizacionHistory,
  fetchInflacion,
  fetchUVA,
  fetchPlazoFijo,
} from "./argentinadatosService";

export type {
  BCRAVariable,
  BCRADataPoint,
  BCRAIndicatorType,
} from "./bcraService";
export {
  fetchBCRALatestAll,
  fetchBCRAVariable,
  BCRA_VARIABLE_IDS,
} from "./bcraService";
