import { NextResponse } from "next/server";
import { fetchDollarHistory } from "@/lib/providers";
import { VALID_DOLLAR_TYPES } from "@/lib/quotes";
import { buildMonthlyEvolution, getDateTime } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  if (!VALID_DOLLAR_TYPES.has(type)) {
    return NextResponse.json(
      {
        error: `Unknown type: "${type}". Options: ${[...VALID_DOLLAR_TYPES].join(", ")}`,
      },
      { status: 404 },
    );
  }
  try {
    const data = await fetchDollarHistory(type);
    const months = buildMonthlyEvolution(data);
    return NextResponse.json({ date: getDateTime(), type, months });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch evolution" },
      { status: 500 },
    );
  }
}
