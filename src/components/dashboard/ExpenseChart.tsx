import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { month: "Jul", gastos: 3200 },
  { month: "Ago", gastos: 2800 },
  { month: "Set", gastos: 3500 },
  { month: "Out", gastos: 3100 },
  { month: "Nov", gastos: 3800 },
  { month: "Dez", gastos: 4200 },
  { month: "Jan", gastos: 3650 },
];

interface ExpenseChartProps {
  className?: string;
}

export function ExpenseChart({ className }: ExpenseChartProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-card border border-border shadow-card",
        className
      )}
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">
          Evolução de Gastos
        </h3>
        <p className="text-sm text-muted-foreground">Últimos 7 meses</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(172, 66%, 40%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(172, 66%, 40%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px hsl(220, 20%, 10%, 0.1)",
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Gastos"]}
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="hsl(172, 66%, 40%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGastos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
