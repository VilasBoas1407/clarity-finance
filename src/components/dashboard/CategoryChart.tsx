import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

type CategoryData = {
  name: string;
  value: number;
  color: string;
};

interface CategoryChartProps {
  className?: string;
  data: CategoryData[];
}

export function CategoryChart({ className, data }: CategoryChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-card border border-border shadow-card",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Gastos por Categoria</h3>
        <p className="text-sm text-muted-foreground">Distribuicao mensal</p>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px hsl(220, 20%, 10%, 0.1)",
              }}
              formatter={(value: number) => [
                `R$ ${value.toLocaleString("pt-BR")}`,
                "Valor",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            <span className="text-xs font-medium text-foreground ml-auto">
              {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
