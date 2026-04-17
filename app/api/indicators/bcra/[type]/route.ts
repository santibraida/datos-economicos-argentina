import { NextResponse } from "next/server";
import {
  fetchBCRAVariable,
  BCRA_VARIABLE_IDS,
  fetchInflacion,
  fetchUVA,
  type BCRAIndicatorType,
} from "@/lib/providers";
import { getDateTime } from "@/lib/utils";

const BCRA_UNITS: Record<BCRAIndicatorType, string> = {
  reservas: "MM USD",
  tcMinorista: "ARS/USD",
  tcMayorista: "ARS/USD",
  badlar: "%",
  tm20: "%",
  tasaDepositos30d: "%",
  tasaPrestamosPersonales: "%",
  baseMon: "MM ARS",
  circulante: "MM ARS",
  depositosPlazo: "MM ARS",
  prestamosPrivado: "MM ARS",
  ipcInteranual: "%",
  expectativaInflacion: "%",
  cer: "índice",
  uvaAlternativo: "ARS",
  icl: "índice",
  tamar: "%",
};

const VALID_TYPES = new Set<string>([
  ...Object.keys(BCRA_VARIABLE_IDS),
  "inflacion",
  "uva",
]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;

  if (!VALID_TYPES.has(type)) {
    return NextResponse.json(
      {
        error: `Unknown indicator: "${type}". Options: ${[...VALID_TYPES].join(", ")}`,
      },
      { status: 404 },
    );
  }

  try {
    // ── argentinadatos indicators ────────────────────────────────────────────
    if (type === "inflacion") {
      const data = await fetchInflacion();
      const latest = data[data.length - 1];
      return NextResponse.json({
        date: getDateTime(),
        type,
        value: latest.valor.toFixed(1),
        unit: "%",
        lastUpdate: latest.fecha,
      });
    }

    if (type === "uva") {
      const data = await fetchUVA();
      const latest = data[data.length - 1];
      return NextResponse.json({
        date: getDateTime(),
        type,
        value: latest.valor.toFixed(2),
        unit: "ARS",
        lastUpdate: latest.fecha,
      });
    }

    // ── BCRA v4 indicators ───────────────────────────────────────────────────
    const idVariable = BCRA_VARIABLE_IDS[type as BCRAIndicatorType];
    const data = await fetchBCRAVariable(idVariable);
    if (!data.length) {
      return NextResponse.json({ error: "No data available" }, { status: 503 });
    }
    const latest = data[0]; // v4 returns newest first
    return NextResponse.json({
      date: getDateTime(),
      type,
      value: latest.valor.toString(),
      unit: BCRA_UNITS[type as BCRAIndicatorType],
      lastUpdate: latest.fecha,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch indicator" },
      { status: 500 },
    );
  }
}
