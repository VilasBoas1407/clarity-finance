import { AppLayout } from "@/components/layout";
import {
  KPICard,
  ExpenseChart,
  CategoryChart,
  RecentTransactions,
} from "@/components/dashboard";
import { Wallet, Repeat, CreditCard, PiggyBank } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const Dashboard = () => {
  const {
    loading,
    kpis,
    monthlyExpenses,
    categoryExpenses,
    recentTransactions,
  } = useDashboard();

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Visao geral das suas financas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Gasto no Mes"
            value={formatCurrency(kpis.totalSpent)}
            change={{ value: kpis.totalSpentChange, label: "vs mes anterior" }}
            trend={kpis.totalSpentChange >= 0 ? "up" : "down"}
            icon={<Wallet className="w-5 h-5" />}
          />
          <KPICard
            title="Gastos Recorrentes"
            value={formatCurrency(kpis.recurringSpent)}
            change={{ value: kpis.recurringSpentChange, label: "vs mes anterior" }}
            trend={kpis.recurringSpentChange >= 0 ? "up" : "down"}
            icon={<Repeat className="w-5 h-5" />}
          />
          <KPICard
            title="Gastos no Cartao"
            value={formatCurrency(kpis.cardSpent)}
            change={{ value: kpis.cardSpentChange, label: "vs mes anterior" }}
            trend={kpis.cardSpentChange >= 0 ? "up" : "down"}
            icon={<CreditCard className="w-5 h-5" />}
          />
          <KPICard
            title="Saldo Livre Estimado"
            value={formatCurrency(kpis.freeBalance)}
            change={{ value: kpis.freeBalanceChange, label: "vs mes anterior" }}
            trend={kpis.freeBalanceChange >= 0 ? "down" : "up"}
            icon={<PiggyBank className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ExpenseChart className="lg:col-span-2" data={monthlyExpenses} />
          <CategoryChart data={categoryExpenses} />
        </div>

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
