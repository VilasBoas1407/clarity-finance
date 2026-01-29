import { cn } from "@/lib/utils";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

const recentTransactions: Transaction[] = [
  {
    id: "1",
    description: "Supermercado Extra",
    category: "Alimentação",
    amount: -245.80,
    date: "Hoje",
    type: "expense",
  },
  {
    id: "2",
    description: "Salário",
    category: "Renda",
    amount: 8500.00,
    date: "Ontem",
    type: "income",
  },
  {
    id: "3",
    description: "Netflix",
    category: "Assinaturas",
    amount: -55.90,
    date: "23 Jan",
    type: "expense",
  },
  {
    id: "4",
    description: "Uber",
    category: "Transporte",
    amount: -32.50,
    date: "23 Jan",
    type: "expense",
  },
  {
    id: "5",
    description: "iFood",
    category: "Alimentação",
    amount: -78.90,
    date: "22 Jan",
    type: "expense",
  },
];

interface RecentTransactionsProps {
  className?: string;
}

export function RecentTransactions({ className }: RecentTransactionsProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-card border border-border shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Transações Recentes
          </h3>
          <p className="text-sm text-muted-foreground">Últimos lançamentos</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver todas
        </Button>
      </div>
      <div className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg",
                  transaction.type === "income"
                    ? "bg-success-soft text-success"
                    : "bg-destructive-soft text-destructive"
                )}
              >
                {transaction.type === "income" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                transaction.type === "income" ? "text-success" : "text-foreground"
              )}
            >
              {transaction.type === "income" ? "+" : ""}
              R$ {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
