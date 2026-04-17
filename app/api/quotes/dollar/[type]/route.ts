import { NextResponse } from "next/server";
import { DOLLAR_MAP } from "@/lib/quotes";
import { handleQuote } from "@/lib/routeHelpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const config = DOLLAR_MAP[type];
  if (!config) {
    return NextResponse.json(
      {
        error: `Unknown dollar type: "${type}". Options: ${Object.keys(DOLLAR_MAP).join(", ")}`,
      },
      { status: 404 },
    );
  }
  return handleQuote(`dollar/${type}`, config);
}
