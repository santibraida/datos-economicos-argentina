import { NextResponse } from "next/server";
import { fetchDollarHistory } from "@/lib/argentinadatosService";
import {
  buildDailyHistory,
  buildMonthlyHistory,
  getDateTime,
} from "@/lib/utils";

const VALID_TYPES = new Set([
  "oficial",
  "blue",
  "bolsa",
  "contadoconliqui",
  "mayorista",
  "cripto",
  "tarjeta",
]);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  if (!VALID_TYPES.has(type)) {
    return NextResponse.json(
      {
        error: `Unknown type: "${type}". Options: ${[...VALID_TYPES].join(", ")}`,
      },
      { status: 404 },
    );
  }

  const url = new URL(req.url);
  const granularity = url.searchParams.get("granularity") ?? "monthly";

  try {
    const raw = await fetchDollarHistory(type);
    // Convert to {fecha, valor} shape expected by history builders
    const items = raw
      .filter((d) => d.venta != null)
      .map((d) => ({ fecha: d.fecha, valor: d.venta as number }));

    const points =
      granularity === "daily"
        ? buildDailyHistory(items, 365)
        : buildMonthlyHistory(items, 60);

    return NextResponse.json({
      date: getDateTime(),
      type,
      granularity,
      points,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
