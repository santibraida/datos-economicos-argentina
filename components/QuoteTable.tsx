interface Row {
  name: string;
  buy: string;
  sell: string;
  currency: string;
}

interface Props {
  title: string;
  rows: Row[];
}

export function QuoteTable({ title, rows }: Readonly<Props>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-3 text-left">Entidad</th>
            <th className="px-5 py-3 text-right">Compra</th>
            <th className="px-5 py-3 text-right">Venta</th>
            <th className="px-5 py-3 text-right">Moneda</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.name} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-medium text-gray-700">
                {row.name}
              </td>
              <td className="px-5 py-3 text-right text-emerald-600">
                ${row.buy}
              </td>
              <td className="px-5 py-3 text-right text-red-500">${row.sell}</td>
              <td className="px-5 py-3 text-right text-gray-400">
                {row.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
