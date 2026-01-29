import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { name: "Moradia", value: 1800, color: "hsl(172, 66%, 45%)" },
  { name: "Alimentação", value: 850, color: "hsl(220, 70%, 55%)" },
  { name: "Transporte", value: 450, color: "hsl(280, 65%, 55%)" },
  { name: "Lazer", value: 380, color: "hsl(38, 92%, 50%)" },
  { name: "Assinaturas", value: 320, color: "hsl(0, 72%, 51%)" },
  { name: "Outros", value: 200, color: "hsl(152, 60%, 42%)" },
];

interface CategoryChartProps {
  className?: string;
}

export function CategoryChart({ className }: CategoryChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-card border border-border shadow-card",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Gastos por Categoria
        </h3>
        <p className="text-sm text-muted-foreground">Distribuição mensal</p>
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
              formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground truncate">
              {item.name}
            </span>
            <span className="text-xs font-medium text-foreground ml-auto">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
