import { AppLayout } from "@/components/layout";
import {
  KPICard,
  ExpenseChart,
  CategoryChart,
  RecentTransactions,
} from "@/components/dashboard";
import { Wallet, Repeat, CreditCard, PiggyBank } from "lucide-react";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Gasto no Mês"
            value="R$ 3.650,00"
            change={{ value: 12, label: "vs mês anterior" }}
            trend="up"
            icon={<Wallet className="w-5 h-5" />}
          />
          <KPICard
            title="Gastos Recorrentes"
            value="R$ 1.280,00"
            change={{ value: 3, label: "vs mês anterior" }}
            trend="up"
            icon={<Repeat className="w-5 h-5" />}
          />
          <KPICard
            title="Gastos no Cartão"
            value="R$ 2.150,00"
            change={{ value: 8, label: "vs mês anterior" }}
            trend="down"
            icon={<CreditCard className="w-5 h-5" />}
          />
          <KPICard
            title="Saldo Livre Estimado"
            value="R$ 4.850,00"
            change={{ value: 5, label: "vs mês anterior" }}
            trend="down"
            icon={<PiggyBank className="w-5 h-5" />}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ExpenseChart className="lg:col-span-2" />
          <CategoryChart />
        </div>

        {/* Recent transactions */}
        <RecentTransactions />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
