import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Download, TrendingUp, TrendingDown, Lightbulb, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Jul", gastos: 3200, receitas: 8500 },
  { month: "Ago", gastos: 2800, receitas: 8500 },
  { month: "Set", gastos: 3500, receitas: 8500 },
  { month: "Out", gastos: 3100, receitas: 9200 },
  { month: "Nov", gastos: 3800, receitas: 9200 },
  { month: "Dez", gastos: 4200, receitas: 9200 },
];

const categoryData = [
  { category: "Moradia", value: 1800 },
  { category: "Alimentação", value: 850 },
  { category: "Transporte", value: 450 },
  { category: "Lazer", value: 380 },
  { category: "Assinaturas", value: 320 },
  { category: "Outros", value: 200 },
];

interface Insight {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  description: string;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "warning",
    title: "Gastos com cartão aumentaram 18%",
    description: "Comparado ao mês anterior, seus gastos no cartão de crédito cresceram significativamente.",
  },
  {
    id: "2",
    type: "info",
    title: "Assinaturas representam 32%",
    description: "Seus gastos recorrentes representam quase um terço do seu orçamento mensal.",
  },
  {
    id: "3",
    type: "success",
    title: "Economia em alimentação",
    description: "Você gastou 15% menos com alimentação este mês. Continue assim!",
  },
];

const Reports = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Relatórios & Insights
            </h1>
            <p className="text-muted-foreground">
              Análise detalhada das suas finanças
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
                <SelectItem value="6months">Últimos 6 meses</SelectItem>
                <SelectItem value="12months">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
              <Badge className="ml-1 bg-primary/20 text-primary border-0 text-[10px]">
                Pro
              </Badge>
            </Button>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className="font-semibold text-foreground">Insights Automáticos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-xl border",
                  insight.type === "warning" && "bg-warning-soft border-warning/20",
                  insight.type === "info" && "bg-primary-soft border-primary/20",
                  insight.type === "success" && "bg-success-soft border-success/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                      insight.type === "warning" && "bg-warning/20 text-warning",
                      insight.type === "info" && "bg-primary/20 text-primary",
                      insight.type === "success" && "bg-success/20 text-success"
                    )}
                  >
                    {insight.type === "warning" && <TrendingUp className="w-4 h-4" />}
                    {insight.type === "info" && <Lightbulb className="w-4 h-4" />}
                    {insight.type === "success" && <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly comparison */}
          <div className="p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-foreground">
                Receitas vs Despesas
              </h3>
              <p className="text-sm text-muted-foreground">Comparativo mensal</p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
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
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                  />
                  <Bar dataKey="receitas" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" fill="hsl(172, 66%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Receitas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Despesas</span>
              </div>
            </div>
          </div>

          {/* By category */}
          <div className="p-6 rounded-xl bg-card border border-border shadow-card">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-foreground">
                Gastos por Categoria
              </h3>
              <p className="text-sm text-muted-foreground">Ranking do período</p>
            </div>
            <div className="space-y-4">
              {categoryData.map((item, index) => {
                const maxValue = Math.max(...categoryData.map((d) => d.value));
                const percentage = (item.value / maxValue) * 100;

                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {item.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        R$ {item.value.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium CTA */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Desbloqueie Relatórios Avançados</h3>
                <p className="text-sm text-muted-foreground">
                  Exporte dados, veja tendências detalhadas e receba insights personalizados.
                </p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-glow">
              Fazer Upgrade
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
