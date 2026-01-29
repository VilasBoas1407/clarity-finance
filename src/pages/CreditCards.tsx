import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, CreditCard as CardIcon, AlertTriangle, Calendar, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreditCardData {
  id: string;
  name: string;
  lastDigits: string;
  limit: number;
  used: number;
  closeDate: string;
  dueDate: string;
  brand: "visa" | "mastercard" | "elo";
}

interface CardTransaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  installment?: string;
  date: string;
}

const creditCards: CreditCardData[] = [
  {
    id: "1",
    name: "Nubank",
    lastDigits: "4521",
    limit: 8000,
    used: 2150,
    closeDate: "15/02",
    dueDate: "22/02",
    brand: "mastercard",
  },
  {
    id: "2",
    name: "Itaú Platinum",
    lastDigits: "8832",
    limit: 15000,
    used: 4320,
    closeDate: "10/02",
    dueDate: "17/02",
    brand: "visa",
  },
  {
    id: "3",
    name: "Santander Free",
    lastDigits: "1234",
    limit: 5000,
    used: 4200,
    closeDate: "05/02",
    dueDate: "12/02",
    brand: "mastercard",
  },
];

const transactions: CardTransaction[] = [
  { id: "1", description: "Amazon", category: "Compras", amount: 289.90, installment: "3/10", date: "28/01" },
  { id: "2", description: "iFood", category: "Alimentação", amount: 67.80, date: "27/01" },
  { id: "3", description: "Uber", category: "Transporte", amount: 45.20, date: "27/01" },
  { id: "4", description: "Magazine Luiza", category: "Compras", amount: 1299.00, installment: "5/12", date: "25/01" },
  { id: "5", description: "Farmácia", category: "Saúde", amount: 89.50, date: "24/01" },
];

const CreditCards = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Cartões de Crédito
            </h1>
            <p className="text-muted-foreground">
              Controle seus limites e faturas
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Cartão
          </Button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditCards.map((card) => {
            const usedPercentage = (card.used / card.limit) * 100;
            const isHighUsage = usedPercentage >= 80;

            return (
              <div
                key={card.id}
                className="p-5 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-soft text-primary">
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">•••• {card.lastDigits}</p>
                    </div>
                  </div>
                  {isHighUsage && (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  )}
                </div>

                {/* Limit progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Utilizado</span>
                    <span className="font-medium text-foreground">
                      R$ {card.used.toLocaleString("pt-BR")} / R$ {card.limit.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress
                    value={usedPercentage}
                    className={cn(
                      "h-2",
                      isHighUsage && "[&>div]:bg-warning"
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Disponível: R$ {(card.limit - card.used).toLocaleString("pt-BR")}
                  </p>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div className="text-xs">
                      <p className="text-muted-foreground">Fecha</p>
                      <p className="font-medium text-foreground">{card.closeDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div className="text-xs">
                      <p className="text-muted-foreground">Vence</p>
                      <p className="font-medium text-foreground">{card.dueDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transactions */}
        <div className="rounded-xl bg-card border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Transações do Cartão
              </h3>
              <p className="text-sm text-muted-foreground">Fatura atual</p>
            </div>
            <Button variant="outline" size="sm">
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
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                    <CardIcon className="w-4 h-4 text-muted-foreground" />
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
                <div className="flex items-center gap-3">
                  {transaction.installment && (
                    <Badge variant="secondary" className="text-xs">
                      {transaction.installment}
                    </Badge>
                  )}
                  <span className="text-sm font-semibold text-foreground">
                    R$ {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreditCards;
