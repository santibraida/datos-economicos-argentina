export interface SimpleQuote {
  date: string;
  buy: string;
  sell: string;
  currency: string;
}

export interface IndicatorResponse {
  date: string;
  value: string;
  currency: string;
}

export interface EvolutionMonth {
  year: string;
  month: string;
  value: string;
}

export interface EvolutionResponse {
  date: string;
  months: EvolutionMonth[];
}

export interface HistoryItem {
  id: number;
  type: string;
  buy: string | null;
  sell: string | null;
  value: string | null;
  currency: string;
  createdAt: string;
}

export interface HistoryResponse {
  type: string;
  page: number;
  limit: number;
  total: number;
  items: HistoryItem[];
}

// Raw shape returned by dolarsi XML → JSON
export type DolarSiData = Record<string, unknown>;
