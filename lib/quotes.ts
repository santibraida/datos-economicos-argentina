/* eslint-disable @typescript-eslint/no-explicit-any */
// Central registry: maps route keys → data extraction from dolarapi.com response.

import type { AppData } from "@/lib/providers";

export interface QuoteConfig {
  currency: "USD" | "EUR" | "BRL" | "ARS" | "CLP" | "UYU";
  getBuy: (d: AppData) => string;
  getSell: (d: AppData) => string;
}

// Kept for routeHelpers.ts compatibility (handleIndicator is still exported there)
export interface IndicatorConfig {
  currency: "USD" | "ARS";
  getValue: (d: any) => string;
  decimals?: number;
}

// ─────────────────────────────────────────────
// Dollar  (source: /v1/dolares)
// ─────────────────────────────────────────────
export const DOLLAR_MAP: Record<string, QuoteConfig> = {
  oficial: {
    currency: "USD",
    getBuy: (d) => String(d.dollars["oficial"]?.compra ?? ""),
    getSell: (d) => String(d.dollars["oficial"]?.venta ?? ""),
  },
  blue: {
    currency: "USD",
    getBuy: (d) => String(d.dollars["blue"]?.compra ?? ""),
    getSell: (d) => String(d.dollars["blue"]?.venta ?? ""),
  },
  bolsa: {
    currency: "USD",
    getBuy: (d) => String(d.dollars["bolsa"]?.compra ?? ""),
    getSell: (d) => String(d.dollars["bolsa"]?.venta ?? ""),
  },
  contadoconliqui: {
    currency: "USD",
    getBuy: (d) => String(d.dollars["contadoconliqui"]?.compra ?? ""),
    getSell: (d) => String(d.dollars["contadoconliqui"]?.venta ?? ""),
  },
  mayorista: {
    currency: "USD",
    getBuy: (d) => String(d.dollars["mayorista"]?.compra ?? ""),
    getSell: (d) => String(d.dollars["mayorista"]?.venta ?? ""),
  },
  cripto: {
    currency: "USD",
    getBuy: (d) => String(d.dollars["cripto"]?.compra ?? ""),
    getSell: (d) => String(d.dollars["cripto"]?.venta ?? ""),
  },
  tarjeta: {
    currency: "USD",
    getBuy: (d) => String(d.dollars["tarjeta"]?.compra ?? ""),
    getSell: (d) => String(d.dollars["tarjeta"]?.venta ?? ""),
  },
};

export const VALID_DOLLAR_TYPES = new Set(Object.keys(DOLLAR_MAP));

// ─────────────────────────────────────────────
// Euro  (source: /v1/cotizaciones — official rate only)
// ─────────────────────────────────────────────
export const EURO_MAP: Record<string, QuoteConfig> = {
  oficial: {
    currency: "EUR",
    getBuy: (d) => String(d.currencies["EUR"]?.compra ?? ""),
    getSell: (d) => String(d.currencies["EUR"]?.venta ?? ""),
  },
};

// ─────────────────────────────────────────────
// Brazilian Real  (source: /v1/cotizaciones — official rate only)
// ─────────────────────────────────────────────
export const REAL_MAP: Record<string, QuoteConfig> = {
  oficial: {
    currency: "BRL",
    getBuy: (d) => String(d.currencies["BRL"]?.compra ?? ""),
    getSell: (d) => String(d.currencies["BRL"]?.venta ?? ""),
  },
};

// ─────────────────────────────────────────────
// Chilean Peso  (source: /v1/cotizaciones)
// ─────────────────────────────────────────────
export const PESO_CHILENO_MAP: Record<string, QuoteConfig> = {
  oficial: {
    currency: "CLP",
    getBuy: (d) => String(d.currencies["CLP"]?.compra ?? ""),
    getSell: (d) => String(d.currencies["CLP"]?.venta ?? ""),
  },
};

// ─────────────────────────────────────────────
// Uruguayan Peso  (source: /v1/cotizaciones)
// ─────────────────────────────────────────────
export const PESO_URUGUAYO_MAP: Record<string, QuoteConfig> = {
  oficial: {
    currency: "UYU",
    getBuy: (d) => String(d.currencies["UYU"]?.compra ?? ""),
    getSell: (d) => String(d.currencies["UYU"]?.venta ?? ""),
  },
};
