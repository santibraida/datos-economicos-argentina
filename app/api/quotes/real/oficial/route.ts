import { REAL_MAP } from "@/lib/quotes";
import { handleQuote } from "@/lib/routeHelpers";

export async function GET() {
  return handleQuote("real/oficial", REAL_MAP.oficial);
}
