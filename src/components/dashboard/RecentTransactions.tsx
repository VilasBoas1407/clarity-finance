import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";

interface RecentTransactionsProps {
  className?: string;
  transactions: Transaction[];
}

const formatRelativeDate = (date: Date) => {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const inputStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (todayStart.getTime() - inputStart.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

export function RecentTransactions({
  className,
  transactions,
}: RecentTransactionsProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-card border border-border shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Transações Recentes
          </h3>
          <p className="text-sm text-muted-foreground">Ultimos lançamentos</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver todas
        </Button>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction) => (
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
                    : "bg-destructive-soft text-destructive",
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
                  {transaction.category} -{" "}
                  {formatRelativeDate(transaction.date)}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                transaction.type === "income"
                  ? "text-success"
                  : "text-foreground",
              )}
            >
              {transaction.type === "income" ? "+" : ""}
              R${" "}
              {Math.abs(transaction.amount).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">
            Sem transações recentes.
          </p>
        )}
      </div>
    </div>
  );
}
