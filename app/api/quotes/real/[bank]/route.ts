import { NextResponse } from "next/server";
import { REAL_MAP } from "@/lib/quotes";
import { handleQuote } from "@/lib/routeHelpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bank: string }> },
) {
  const { bank } = await params;
  const config = REAL_MAP[bank];
  if (!config) {
    return NextResponse.json(
      {
        error: `Unknown bank: "${bank}". Options: ${Object.keys(REAL_MAP).join(", ")}`,
      },
      { status: 404 },
    );
  }
  return handleQuote(`real/${bank}`, config);
}
