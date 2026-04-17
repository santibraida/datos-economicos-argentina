"use client";

import { useState, useEffect } from "react";
import { HistoryChart } from "@/components/HistoryChart";
import type { HistoryPoint } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type DollarType =
  | "blue"
  | "oficial"
  | "bolsa"
  | "contadoconliqui"
  | "mayorista";

type Range = "1S" | "1M" | "3M" | "6M" | "YTD" | "1A" | "5A" | "10A" | "MAX";

// ─── Constants ────────────────────────────────────────────────────────────────

const RANGES: { key: Range; label: string }[] = [
  { key: "1S",  label: "1S" },
  { key: "1M",  label: "1M" },
  { key: "3M",  label: "3M" },
  { key: "6M",  label: "6M" },
  { key: "YTD", label: "YTD" },
  { key: "1A",  label: "1A" },
  { key: "5A",  label: "5A" },
  { key: "10A", label: "10A" },
  { key: "MAX", label: "MÁX" },
];

/** For ranges > 1 year fetch monthly to get more history; otherwise daily. */
function granularityFor(range: Range): "daily" | "monthly" {
  return (range === "5A" || range === "10A" || range === "MAX") ? "monthly" : "daily";
}

/**
 * Slice points to the selected range.
 * Works with both "YYYY-MM-DD" (daily) and "YYYY-MM" (monthly) date strings.
 */
function filterByRange(points: HistoryPoint[], range: Range): HistoryPoint[] {
  if (range === "MAX" || points.length === 0) return points;
  const now = new Date();
  let from: Date;
  if      (range === "1S")  { from = new Date(now); from.setDate(now.getDate() - 7); }
  else if (range === "1M")  { from = new Date(now); from.setMonth(now.getMonth() - 1); }
  else if (range === "3M")  { from = new Date(now); from.setMonth(now.getMonth() - 3); }
  else if (range === "6M")  { from = new Date(now); from.setMonth(now.getMonth() - 6); }
  else if (range === "YTD") { from = new Date(now.getFullYear(), 0, 1); }
  else if (range === "1A")  { from = new Date(now); from.setFullYear(now.getFullYear() - 1); }
  else if (range === "5A")  { from = new Date(now); from.setFullYear(now.getFullYear() - 5); }
  else                      { from = new Date(now); from.setFullYear(now.getFullYear() - 10); }
  const isMonthly = (points[0]?.date.length ?? 10) === 7;
  const fromStr = from.toISOString().slice(0, isMonthly ? 7 : 10);
  return points.filter((p) => p.date >= fromStr);
}

const DOLLAR_OPTS: { key: DollarType; label: string }[] = [
  { key: "blue", label: "Blue" },
  { key: "oficial", label: "Oficial" },
  { key: "bolsa", label: "Bolsa (MEP)" },
  { key: "contadoconliqui", label: "CCL" },
  { key: "mayorista", label: "Mayorista" },
];

const ARS = (v: number) =>
  "$" +
  v.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const PCT = (v: number) =>
  v.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + "%";

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useHistory<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  return { data, loading };
}

// ─── Chart card ──────────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  loading,
  points,
  color,
  label,
  formatValue,
}: Readonly<{
  title: string;
  subtitle?: string;
  loading: boolean;
  points: HistoryPoint[];
  color: string;
  label: string;
  formatValue?: (v: number) => string;
}>) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      {loading ? (
        <div className="flex h-56 items-center justify-center text-sm text-gray-400">
          Cargando…
        </div>
      ) : (
        <HistoryChart
          data={points}
          color={color}
          label={label}
          formatValue={formatValue}
        />
      )}
    </div>
  );
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function DolarHistory({ range }: Readonly<{ range: Range }>) {
  const [dollarType, setDollarType] = useState<DollarType>("blue");
  const granularity = granularityFor(range);

  const { data, loading } = useHistory<{ points: HistoryPoint[] }>(
    `/api/history/dollar/${dollarType}?granularity=${granularity}`,
  );

  const points = filterByRange(data?.points ?? [], range);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-800">Dólar</h3>
          <p className="text-xs text-gray-400">Precio de venta</p>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          {DOLLAR_OPTS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setDollarType(key)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                dollarType === key
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex h-56 items-center justify-center text-sm text-gray-400">
          Cargando…
        </div>
      ) : (
        <HistoryChart data={points} color="#2563eb" label="Venta" formatValue={ARS} />
      )}
    </div>
  );
}

function UVAHistory({ range }: Readonly<{ range: Range }>) {
  const { data, loading } = useHistory<{ points: HistoryPoint[] }>(
    `/api/history/uva?granularity=${granularityFor(range)}`,
  );
  const points = filterByRange(data?.points ?? [], range);
  return (
    <ChartCard
      title="UVA"
      subtitle="Unidad de Valor Adquisitivo"
      loading={loading}
      points={points}
      color="#7c3aed"
      label="UVA (ARS)"
      formatValue={ARS}
    />
  );
}

function CERHistory({ range }: Readonly<{ range: Range }>) {
  const { data, loading } = useHistory<{ points: HistoryPoint[] }>(
    `/api/history/cer?granularity=${granularityFor(range)}`,
  );
  const points = filterByRange(data?.points ?? [], range);
  return (
    <ChartCard
      title="CER"
      subtitle="Coeficiente de Estabilización de Referencia"
      loading={loading}
      points={points}
      color="#d97706"
      label="CER"
      formatValue={(v) =>
        v.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })
      }
    />
  );
}

function IPCHistory({ range }: Readonly<{ range: Range }>) {
  const { data, loading } = useHistory<{ points: HistoryPoint[] }>("/api/history/ipc");
  const points = filterByRange(data?.points ?? [], range);
  return (
    <ChartCard
      title="Inflación mensual (IPC)"
      subtitle="Variación % mensual · Fuente: argentinadatos"
      loading={loading}
      points={points}
      color="#dc2626"
      label="IPC %"
      formatValue={PCT}
    />
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HistoricoTab() {
  const [range, setRange] = useState<Range>("1A");

  return (
    <div className="space-y-6">
      {/* Global range selector */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Rango</p>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-3 py-1.5 font-medium transition-colors ${
                range === key
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <DolarHistory range={range} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UVAHistory range={range} />
        <CERHistory range={range} />
      </div>
      <IPCHistory range={range} />
    </div>
  );
}
