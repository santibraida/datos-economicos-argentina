"use client";

import { useState } from "react";
import Link from "next/link";
import { QuoteCard } from "@/components/QuoteCard";
import { HistoricoTab } from "@/components/HistoricoTab";
import { DOLLAR_MAP } from "@/lib/quotes";
import type { SimpleQuote } from "@/lib/types";
import type { PlazoFijoEntry } from "@/lib/argentinadatosService";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab =
  | "dolar"
  | "divisas"
  | "tasas"
  | "monetario"
  | "precios"
  | "historico";

export interface LatestValue {
  valor: number;
  fecha: string;
}

interface Props {
  // Tab: Dólar
  dollarData: Record<string, SimpleQuote>;
  // Tab: Divisas
  euroQuote: SimpleQuote | null;
  realQuote: SimpleQuote | null;
  clpQuote: SimpleQuote | null;
  uyuQuote: SimpleQuote | null;
  // Tab: Monetario
  reservas: LatestValue | null;
  tcMinorista: LatestValue | null;
  tcMayorista: LatestValue | null;
  baseMon: LatestValue | null;
  circulante: LatestValue | null;
  prestamosPrivado: LatestValue | null;
  depositosPlazo: LatestValue | null;
  // Tab: Tasas
  badlar: LatestValue | null;
  tamar: LatestValue | null;
  tm20: LatestValue | null;
  tasaDepositos30d: LatestValue | null;
  tasaPrestamosPersonales: LatestValue | null;
  plazoFijo: PlazoFijoEntry[] | null;
  // Tab: Precios e Índices
  inflacion: LatestValue | null;
  ipcInteranual: LatestValue | null;
  expectativaInflacion: LatestValue | null;
  cer: LatestValue | null;
  uvaAlternativo: LatestValue | null;
  icl: LatestValue | null;
  countryRisk: LatestValue | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DOLLAR_LABELS: Record<string, string> = {
  oficial: "Oficial",
  blue: "Blue",
  bolsa: "Bolsa (MEP)",
  contadoconliqui: "Contado c/Liqui",
  mayorista: "Mayorista",
  cripto: "Cripto",
  tarjeta: "Tarjeta",
};

const TABS: { key: Tab; label: string }[] = [
  { key: "dolar", label: "Dólar" },
  { key: "divisas", label: "Divisas" },
  { key: "tasas", label: "Tasas" },
  { key: "monetario", label: "Monetario" },
  { key: "precios", label: "Precios e Índices" },
  { key: "historico", label: "Histórico" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, decimals = 2): string {
  if (n == null) return "—";
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IndicatorCard({
  label,
  value,
  unit,
  fecha,
}: {
  label: string;
  value: string;
  unit?: string;
  fecha?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 leading-tight">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold text-gray-900 break-words">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-gray-500">{unit}</span>
        )}
      </p>
      {fecha && <p className="mt-1 text-xs text-gray-400">{fecha}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
      {children}
    </h3>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function DolarTab({ dollarData }: { dollarData: Record<string, SimpleQuote> }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Object.keys(DOLLAR_MAP).map((key) => (
        <QuoteCard
          key={key}
          title={DOLLAR_LABELS[key] ?? key}
          data={dollarData[key] ?? null}
          type="quote"
        />
      ))}
    </div>
  );
}

function DivisasTab({
  euroQuote,
  realQuote,
  clpQuote,
  uyuQuote,
}: Pick<Props, "euroQuote" | "realQuote" | "clpQuote" | "uyuQuote">) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <QuoteCard title="Euro" data={euroQuote} type="quote" />
      <QuoteCard title="Real brasileño" data={realQuote} type="quote" />
      <QuoteCard title="Peso chileno" data={clpQuote} type="quote" />
      <QuoteCard title="Peso uruguayo" data={uyuQuote} type="quote" />
    </div>
  );
}

function TasasTab({
  badlar,
  tamar,
  tm20,
  tasaDepositos30d,
  tasaPrestamosPersonales,
  plazoFijo,
}: Pick<
  Props,
  | "badlar"
  | "tamar"
  | "tm20"
  | "tasaDepositos30d"
  | "tasaPrestamosPersonales"
  | "plazoFijo"
>) {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Tasas de referencia BCRA</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {badlar && (
            <IndicatorCard
              label="BADLAR bancos privados"
              value={fmt(badlar.valor, 3)}
              unit="% TNA"
              fecha={badlar.fecha}
            />
          )}
          {tamar && (
            <IndicatorCard
              label="TAMAR bancos privados"
              value={fmt(tamar.valor, 3)}
              unit="% TNA"
              fecha={tamar.fecha}
            />
          )}
          {tm20 && (
            <IndicatorCard
              label="TM20 bancos privados"
              value={fmt(tm20.valor, 3)}
              unit="% TNA"
              fecha={tm20.fecha}
            />
          )}
          {tasaDepositos30d && (
            <IndicatorCard
              label="Depósitos 30 días"
              value={fmt(tasaDepositos30d.valor, 2)}
              unit="% TNA"
              fecha={tasaDepositos30d.fecha}
            />
          )}
          {tasaPrestamosPersonales && (
            <IndicatorCard
              label="Préstamos personales"
              value={fmt(tasaPrestamosPersonales.valor, 2)}
              unit="% TNA"
              fecha={tasaPrestamosPersonales.fecha}
            />
          )}
        </div>
      </div>

      {plazoFijo && plazoFijo.length > 0 && (
        <div>
          <SectionTitle>Tasas de plazo fijo por banco</SectionTitle>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Banco</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    TNA Clientes
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    TNA No Clientes
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...plazoFijo]
                  .sort((a, b) => b.tnaClientes - a.tnaClientes)
                  .map((bank) => (
                    <tr
                      key={bank.entidad}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {bank.entidad}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                        {fmt(bank.tnaClientes, 2)}%
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {fmt(bank.tnaNoClientes, 2)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MonetarioTab({
  reservas,
  tcMinorista,
  tcMayorista,
  baseMon,
  circulante,
  prestamosPrivado,
  depositosPlazo,
}: Pick<
  Props,
  | "reservas"
  | "tcMinorista"
  | "tcMayorista"
  | "baseMon"
  | "circulante"
  | "prestamosPrivado"
  | "depositosPlazo"
>) {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Tipo de cambio</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tcMinorista && (
            <IndicatorCard
              label="TC Minorista (venta)"
              value={`$${fmt(tcMinorista.valor, 2)}`}
              unit="ARS/USD"
              fecha={tcMinorista.fecha}
            />
          )}
          {tcMayorista && (
            <IndicatorCard
              label="TC Mayorista referencia"
              value={`$${fmt(tcMayorista.valor, 4)}`}
              unit="ARS/USD"
              fecha={tcMayorista.fecha}
            />
          )}
        </div>
      </div>

      <div>
        <SectionTitle>Masa monetaria</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {reservas && (
            <IndicatorCard
              label="Reservas internacionales"
              value={`USD ${fmt(reservas.valor, 0)}`}
              unit="M"
              fecha={reservas.fecha}
            />
          )}
          {baseMon && (
            <IndicatorCard
              label="Base monetaria"
              value={`$${fmt(baseMon.valor, 0)}`}
              unit="M ARS"
              fecha={baseMon.fecha}
            />
          )}
          {circulante && (
            <IndicatorCard
              label="Circulación monetaria"
              value={`$${fmt(circulante.valor, 0)}`}
              unit="M ARS"
              fecha={circulante.fecha}
            />
          )}
          {prestamosPrivado && (
            <IndicatorCard
              label="Préstamos sector privado"
              value={`$${fmt(prestamosPrivado.valor, 0)}`}
              unit="M ARS"
              fecha={prestamosPrivado.fecha}
            />
          )}
          {depositosPlazo && (
            <IndicatorCard
              label="Depósitos a plazo"
              value={`$${fmt(depositosPlazo.valor, 0)}`}
              unit="M ARS"
              fecha={depositosPlazo.fecha}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PreciosTab({
  inflacion,
  ipcInteranual,
  expectativaInflacion,
  cer,
  uvaAlternativo,
  icl,
  countryRisk,
}: Pick<
  Props,
  | "inflacion"
  | "ipcInteranual"
  | "expectativaInflacion"
  | "cer"
  | "uvaAlternativo"
  | "icl"
  | "countryRisk"
>) {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Inflación</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {inflacion && (
            <IndicatorCard
              label="IPC mensual"
              value={`${fmt(inflacion.valor, 1)}%`}
              fecha={inflacion.fecha}
            />
          )}
          {ipcInteranual && (
            <IndicatorCard
              label="IPC interanual"
              value={`${fmt(ipcInteranual.valor, 1)}%`}
              fecha={ipcInteranual.fecha}
            />
          )}
          {expectativaInflacion && (
            <IndicatorCard
              label="Expectativa 12 meses (REM)"
              value={`${fmt(expectativaInflacion.valor, 1)}%`}
              fecha={expectativaInflacion.fecha}
            />
          )}
        </div>
      </div>

      <div>
        <SectionTitle>Índices</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cer && (
            <IndicatorCard
              label="CER"
              value={fmt(cer.valor, 4)}
              unit="base 2.2.02=1"
              fecha={cer.fecha}
            />
          )}
          {uvaAlternativo && (
            <IndicatorCard
              label="UVA"
              value={`$${fmt(uvaAlternativo.valor, 2)}`}
              fecha={uvaAlternativo.fecha}
            />
          )}
          {icl && (
            <IndicatorCard
              label="ICL (Locación)"
              value={fmt(icl.valor, 2)}
              unit="base 30.6.20=1"
              fecha={icl.fecha}
            />
          )}
          {countryRisk && (
            <IndicatorCard
              label="Riesgo País"
              value={fmt(countryRisk.valor, 0)}
              unit="pb"
              fecha={countryRisk.fecha}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const TAB_API_LINKS: Record<Tab, { href: string; label: string } | null> = {
  dolar:     { href: "/api/quotes/dollar",           label: "/api/quotes/dollar" },
  divisas:   { href: "/api/quotes",                  label: "/api/quotes" },
  tasas:     { href: "/api/indicators/bcra/badlar",   label: "/api/indicators/bcra/:tipo" },
  monetario: { href: "/api/indicators/bcra/reservas", label: "/api/indicators/bcra/:tipo" },
  precios:   { href: "/api/indicators/inflacion",     label: "/api/indicators/inflacion" },
  historico: { href: "/api/history/dollar/blue",      label: "/api/history/:serie" },
};

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardTabs(props: Props) {
  const [active, setActive] = useState<Tab>("dolar");

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max border-b border-gray-200">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                active === key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {active === "dolar" && <DolarTab dollarData={props.dollarData} />}
      {active === "divisas" && (
        <DivisasTab
          euroQuote={props.euroQuote}
          realQuote={props.realQuote}
          clpQuote={props.clpQuote}
          uyuQuote={props.uyuQuote}
        />
      )}
      {active === "tasas" && (
        <TasasTab
          badlar={props.badlar}
          tamar={props.tamar}
          tm20={props.tm20}
          tasaDepositos30d={props.tasaDepositos30d}
          tasaPrestamosPersonales={props.tasaPrestamosPersonales}
          plazoFijo={props.plazoFijo}
        />
      )}
      {active === "monetario" && (
        <MonetarioTab
          reservas={props.reservas}
          tcMinorista={props.tcMinorista}
          tcMayorista={props.tcMayorista}
          baseMon={props.baseMon}
          circulante={props.circulante}
          prestamosPrivado={props.prestamosPrivado}
          depositosPlazo={props.depositosPlazo}
        />
      )}
      {active === "precios" && (
        <PreciosTab
          inflacion={props.inflacion}
          ipcInteranual={props.ipcInteranual}
          expectativaInflacion={props.expectativaInflacion}
          cer={props.cer}
          uvaAlternativo={props.uvaAlternativo}
          icl={props.icl}
          countryRisk={props.countryRisk}
        />
      )}
      {active === "historico" && <HistoricoTab />}

      {TAB_API_LINKS[active] && (
        <p className="mt-6 text-right text-xs text-gray-400">
          Ver API:{" "}
          <Link
            href={TAB_API_LINKS[active]!.href}
            className="underline hover:text-gray-600"
            target="_blank"
          >
            {TAB_API_LINKS[active]!.label}
          </Link>
        </p>
      )}
    </div>
  );
}
