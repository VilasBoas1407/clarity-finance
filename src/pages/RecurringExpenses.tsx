import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pause, Pencil, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecurringExpense {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: string;
  nextDue: string;
  status: "active" | "paused";
  daysUntilDue: number;
}

const recurringExpenses: RecurringExpense[] = [
  {
    id: "1",
    name: "Netflix",
    category: "Streaming",
    amount: 55.90,
    frequency: "Mensal",
    nextDue: "05/02/2025",
    status: "active",
    daysUntilDue: 7,
  },
  {
    id: "2",
    name: "Spotify",
    category: "Streaming",
    amount: 34.90,
    frequency: "Mensal",
    nextDue: "10/02/2025",
    status: "active",
    daysUntilDue: 12,
  },
  {
    id: "3",
    name: "Aluguel",
    category: "Moradia",
    amount: 1800.00,
    frequency: "Mensal",
    nextDue: "01/02/2025",
    status: "active",
    daysUntilDue: 3,
  },
  {
    id: "4",
    name: "Academia",
    category: "Saúde",
    amount: 149.90,
    frequency: "Mensal",
    nextDue: "15/02/2025",
    status: "active",
    daysUntilDue: 17,
  },
  {
    id: "5",
    name: "Internet",
    category: "Serviços",
    amount: 139.90,
    frequency: "Mensal",
    nextDue: "20/02/2025",
    status: "active",
    daysUntilDue: 22,
  },
  {
    id: "6",
    name: "Seguro Auto",
    category: "Transporte",
    amount: 280.00,
    frequency: "Mensal",
    nextDue: "25/02/2025",
    status: "paused",
    daysUntilDue: 27,
  },
];

const totalMonthly = recurringExpenses
  .filter((e) => e.status === "active")
  .reduce((acc, e) => acc + e.amount, 0);

const RecurringExpenses = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Gastos Recorrentes
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas assinaturas e despesas fixas
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Recorrente
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Total Mensal</p>
            <p className="text-2xl font-semibold text-foreground">
              R$ {totalMonthly.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Ativos</p>
            <p className="text-2xl font-semibold text-foreground">
              {recurringExpenses.filter((e) => e.status === "active").length}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Vencendo em Breve</p>
            <p className="text-2xl font-semibold text-warning">
              {recurringExpenses.filter((e) => e.daysUntilDue <= 7).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground font-medium">Nome</TableHead>
                <TableHead className="text-muted-foreground font-medium">Categoria</TableHead>
                <TableHead className="text-muted-foreground font-medium">Valor</TableHead>
                <TableHead className="text-muted-foreground font-medium">Frequência</TableHead>
                <TableHead className="text-muted-foreground font-medium">Próximo Venc.</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringExpenses.map((expense) => (
                <TableRow key={expense.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {expense.name}
                      {expense.daysUntilDue <= 7 && expense.status === "active" && (
                        <AlertCircle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{expense.category}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    R$ {expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{expense.frequency}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-foreground",
                        expense.daysUntilDue <= 3 && "text-warning font-medium"
                      )}
                    >
                      {expense.nextDue}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={expense.status === "active" ? "default" : "secondary"}
                      className={cn(
                        expense.status === "active"
                          ? "bg-success-soft text-success border-0"
                          : "bg-muted text-muted-foreground border-0"
                      )}
                    >
                      {expense.status === "active" ? "Ativo" : "Pausado"}
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
                        <DropdownMenuItem className="gap-2">
                          <Pause className="w-4 h-4" />
                          {expense.status === "active" ? "Pausar" : "Ativar"}
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

export default RecurringExpenses;
