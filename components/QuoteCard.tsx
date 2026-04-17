import type { SimpleQuote, IndicatorResponse } from "@/lib/types";

interface Props {
  title: string;
  subtitle?: string;
  data: SimpleQuote | IndicatorResponse | null;
  type: "quote" | "indicator";
}

function Badge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
      {label}
    </span>
  );
}

function renderBody(data: Props["data"], type: Props["type"]) {
  if (!data) {
    return <p className="text-sm text-gray-400">Sin datos</p>;
  }
  if (type === "quote") {
    const q = data as SimpleQuote;
    return (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Compra</p>
          <p className="text-lg font-bold text-emerald-600">${q.buy}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Venta</p>
          <p className="text-lg font-bold text-red-500">${q.sell}</p>
        </div>
      </div>
    );
  }
  const ind = data as IndicatorResponse;
  return (
    <div>
      <p className="text-xs text-gray-500">Valor</p>
      <p className="text-xl font-bold text-gray-800">{ind.value}</p>
    </div>
  );
}

export function QuoteCard({ title, subtitle, data, type }: Readonly<Props>) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {data && <Badge label={data.currency} />}
      </div>

      {renderBody(data, type)}

      {data && (
        <p className="mt-3 text-right text-xs text-gray-400">{data.date}</p>
      )}
    </div>
  );
}
