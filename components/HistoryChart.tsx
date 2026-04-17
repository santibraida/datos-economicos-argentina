"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { HistoryPoint } from "@/lib/utils";

interface Props {
  data: HistoryPoint[];
  color?: string;
  label?: string;
  formatValue?: (v: number) => string;
}

function fmtDate(date: string): string {
  // "YYYY-MM" or "YYYY-MM-DD" → e.g. "Mar 25"
  const [y, m] = date.split("-");
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${months[Number(m) - 1]} ${(y ?? "").slice(2)}`;
}

export function HistoryChart({
  data,
  color = "#2563eb",
  label = "Valor",
  formatValue = (v) => v.toLocaleString("es-AR", { maximumFractionDigits: 2 }),
}: Readonly<Props>) {
  if (!data.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-gray-400">
        Sin datos
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient
            id={`grad-${color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={color} stopOpacity={0.18} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={fmtDate}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => formatValue(v)}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <Tooltip
          formatter={(v) => [formatValue(Number(v)), label]}
          labelFormatter={(label) => fmtDate(String(label ?? ""))}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.replace("#", "")})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
