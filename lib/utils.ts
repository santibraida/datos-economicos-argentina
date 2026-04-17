export function buildMonthlyEvolution(
  items: { venta: number | null; fecha: string }[],
  limit = 24,
): { year: number; month: number; value: string }[] {
  // Group by "YYYY-MM", keep last entry per month
  const byMonth = new Map<string, number>();
  for (const item of items) {
    if (item.venta == null) continue;
    const key = item.fecha.slice(0, 7); // "YYYY-MM"
    byMonth.set(key, item.venta);
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-limit)
    .map(([key, venta]) => {
      const [y, m] = key.split("-");
      return { year: Number(y), month: Number(m), value: venta.toFixed(2) };
    });
}

export interface HistoryPoint {
  date: string; // "YYYY-MM-DD"
  value: number;
}

/**
 * Collapses a daily array into monthly data points (last value per month).
 * Input may come from argentinadatos ({fecha, valor}) or BCRA ({fecha, valor}).
 */
export function buildMonthlyHistory(
  items: { fecha: string; valor: number }[],
  limit = 60,
): HistoryPoint[] {
  const byMonth = new Map<string, number>();
  for (const { fecha, valor } of items) {
    const key = fecha.slice(0, 7);
    byMonth.set(key, valor);
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-limit)
    .map(([key, valor]) => ({ date: key, value: valor }));
}

/**
 * Returns a plain daily array, newest-first input → sorted oldest-first output.
 * `items` may be in any order; result is always ascending by date.
 */
export function buildDailyHistory(
  items: { fecha: string; valor: number }[],
  limit = 365,
): HistoryPoint[] {
  return [...items]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-limit)
    .map(({ fecha, valor }) => ({ date: fecha, value: valor }));
}

export function getDateTime(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

export function formatNumber(
  value: string | undefined | null,
  decimalPlaces = 2,
): string {
  if (!value) return "No cotiza";
  const converted = Number.parseFloat(value);
  return Number.isNaN(converted)
    ? "No cotiza"
    : converted.toLocaleString("es-AR", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
}

export function getEvolution(
  annualEvolution: Record<string, { _text: string }>,
): { year: string; month: string; value: string }[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const keys = Object.keys(annualEvolution);

  return keys
    .map((key, i) => {
      const monthNum = i + 1;
      return {
        year: (monthNum < currentMonth
          ? now.getFullYear()
          : now.getFullYear() - 1
        ).toString(),
        month: monthNum.toString(),
        value: formatNumber(annualEvolution[key]._text),
      };
    })
    .sort((a, b) => Number(a.year) - Number(b.year));
}
