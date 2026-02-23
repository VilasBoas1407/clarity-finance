import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  type: "income" | "expense";
}

const expenses: Expense[] = [
  { id: "1", description: "Supermercado Extra", category: "Alimentação", amount: -245.80, date: "29/01/2025", paymentMethod: "Débito", type: "expense" },
  { id: "2", description: "Salário", category: "Renda", amount: 8500.00, date: "28/01/2025", paymentMethod: "Transferência", type: "income" },
  { id: "3", description: "Netflix", category: "Assinaturas", amount: -55.90, date: "27/01/2025", paymentMethod: "Cartão", type: "expense" },
  { id: "4", description: "Uber", category: "Transporte", amount: -32.50, date: "26/01/2025", paymentMethod: "Cartão", type: "expense" },
  { id: "5", description: "iFood", category: "Alimentação", amount: -78.90, date: "25/01/2025", paymentMethod: "Cartão", type: "expense" },
  { id: "6", description: "Freelance", category: "Renda Extra", amount: 1200.00, date: "24/01/2025", paymentMethod: "PIX", type: "income" },
  { id: "7", description: "Farmácia", category: "Saúde", amount: -89.50, date: "23/01/2025", paymentMethod: "Débito", type: "expense" },
  { id: "8", description: "Combustível", category: "Transporte", amount: -250.00, date: "22/01/2025", paymentMethod: "Débito", type: "expense" },
];

const Expenses = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Gastos
            </h1>
            <p className="text-muted-foreground">
              Registre e acompanhe todas as suas transações
            </p>
          </div>
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Novo Lançamento
          </Button>
        </div>

        <AddExpenseModal open={modalOpen} onOpenChange={setModalOpen} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transação..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="food">Alimentação</SelectItem>
              <SelectItem value="transport">Transporte</SelectItem>
              <SelectItem value="health">Saúde</SelectItem>
              <SelectItem value="subscriptions">Assinaturas</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="card">Cartão</SelectItem>
              <SelectItem value="debit">Débito</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive-soft text-destructive">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Saídas</p>
                <p className="text-xl font-semibold text-foreground">
                  R$ {Math.abs(expenses.filter(e => e.type === "expense").reduce((acc, e) => acc + e.amount, 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-soft text-success">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Entradas</p>
                <p className="text-xl font-semibold text-foreground">
                  R$ {expenses.filter(e => e.type === "income").reduce((acc, e) => acc + e.amount, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground">Saldo do Período</p>
            <p className="text-xl font-semibold text-success">
              R$ {expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground font-medium">Descrição</TableHead>
                <TableHead className="text-muted-foreground font-medium">Categoria</TableHead>
                <TableHead className="text-muted-foreground font-medium">Valor</TableHead>
                <TableHead className="text-muted-foreground font-medium">Data</TableHead>
                <TableHead className="text-muted-foreground font-medium">Pagamento</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg",
                          expense.type === "income"
                            ? "bg-success-soft text-success"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {expense.type === "income" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      {expense.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{expense.category}</TableCell>
                  <TableCell className={cn(
                    "font-medium",
                    expense.type === "income" ? "text-success" : "text-foreground"
                  )}>
                    {expense.type === "income" ? "+" : ""}
                    R$ {Math.abs(expense.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {expense.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="w-4 h-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Expenses;
