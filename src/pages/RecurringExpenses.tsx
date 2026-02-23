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
import {
  Plus,
  MoreHorizontal,
  Pause,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { AddRecurringModal } from "@/components/recurring/AddRecurringModel";
import { useRecurringExpenses } from "@/hooks/use-recurring-expenses";
import { toast } from "sonner";

const frequencyLabelMap: Record<string, string> = {
  daily: "Diaria",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  monthly: "Mensal",
  yearly: "Anual",
  mensal: "Mensal",
  semanal: "Semanal",
  quinzenal: "Quinzenal",
  trimestral: "Trimestral",
  anual: "Anual",
};

const RecurringExpenses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    recurringExpenses,
    fetchRecurringExpenses,
    addRecurringExpense,
    deleteRecurringExpense,
    toggleRecurringExpenseStatus,
    loading,
  } = useRecurringExpenses();

  useEffect(() => {
    fetchRecurringExpenses();
  }, [fetchRecurringExpenses]);

  const totalMonthly = useMemo(
    () =>
      recurringExpenses
        .filter((expense) => expense.status === "active")
        .reduce((total, expense) => total + expense.amount, 0),
    [recurringExpenses],
  );

  const activeCount = useMemo(
    () => recurringExpenses.filter((expense) => expense.status === "active").length,
    [recurringExpenses],
  );

  const dueSoonCount = useMemo(
    () =>
      recurringExpenses.filter((expense) => {
        const daysUntilDue = Math.ceil(
          (expense.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        return daysUntilDue <= 7;
      }).length,
    [recurringExpenses],
  );

  const handleToggleStatus = async (expenseId: string, status: "active" | "paused") => {
    try {
      await toggleRecurringExpenseStatus(expenseId, status);
      toast.success(status === "active" ? "Gasto pausado" : "Gasto ativado");
    } catch {
      toast.error("Nao foi possivel atualizar o status");
    }
  };

  const handleDelete = async (expenseId: string) => {
    try {
      await deleteRecurringExpense(expenseId);
      toast.success("Gasto recorrente excluido");
    } catch {
      toast.error("Nao foi possivel excluir o gasto");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Gastos Recorrentes
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas assinaturas e despesas fixas
            </p>
          </div>
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Adicionar Recorrente
          </Button>
        </div>

        <AddRecurringModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onCreateRecurringExpense={addRecurringExpense}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Total Mensal</p>
            <p className="text-2xl font-semibold text-foreground">
              R${" "}
              {totalMonthly.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Ativos</p>
            <p className="text-2xl font-semibold text-foreground">{activeCount}</p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Vencendo em Breve</p>
            <p className="text-2xl font-semibold text-warning">{dueSoonCount}</p>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground font-medium">Nome</TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Categoria
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">Valor</TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Frequencia
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Proximo Venc.
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringExpenses.map((expense) => {
                const daysUntilDue = Math.ceil(
                  (expense.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                );

                return (
                  <TableRow key={expense.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {expense.name}
                        {daysUntilDue <= 7 && expense.status === "active" && (
                          <AlertCircle className="w-4 h-4 text-warning" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{expense.category}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      R${" "}
                      {expense.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {frequencyLabelMap[expense.frequency] ?? expense.frequency}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-foreground",
                          daysUntilDue <= 3 && "text-warning font-medium",
                        )}
                      >
                        {expense.nextDueDate.toLocaleDateString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={expense.status === "active" ? "default" : "secondary"}
                        className={cn(
                          expense.status === "active"
                            ? "bg-success-soft text-success border-0"
                            : "bg-muted text-muted-foreground border-0",
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
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => handleToggleStatus(expense.id, expense.status)}
                          >
                            <Pause className="w-4 h-4" />
                            {expense.status === "active" ? "Pausar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!loading && recurringExpenses.length === 0 && (
                <TableRow className="border-border">
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum gasto recorrente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default RecurringExpenses;
