import { EURO_MAP } from "@/lib/quotes";
import { handleQuote } from "@/lib/routeHelpers";

export async function GET() {
  return handleQuote("euro/oficial", EURO_MAP.oficial);
}
