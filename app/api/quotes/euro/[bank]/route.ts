import { NextResponse } from "next/server";
import { EURO_MAP } from "@/lib/quotes";
import { handleQuote } from "@/lib/routeHelpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bank: string }> },
) {
  const { bank } = await params;
  const config = EURO_MAP[bank];
  if (!config) {
    return NextResponse.json(
      {
        error: `Unknown bank: "${bank}". Options: ${Object.keys(EURO_MAP).join(", ")}`,
      },
      { status: 404 },
    );
  }
  return handleQuote(`euro/${bank}`, config);
}
