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
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { useTransactions } from "@/hooks/use-transactions";

const buildLast12Months = () => {
  const months: { value: string; label: string }[] = [];
  const today = new Date();

  for (let offset = 0; offset < 12; offset += 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    months.push({ value: yearMonth, label });
  }

  return months;
};

const paymentMethodLabelMap: Record<string, string> = {
  cartao: "Cartao",
  debito: "Debito",
  pix: "PIX",
  dinheiro: "Dinheiro",
  transferencia: "Transferencia",
};

const Expenses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const monthOptions = useMemo(() => buildLast12Months(), []);
  const [selectedYearMonth, setSelectedYearMonth] = useState(
    monthOptions[0]?.value ?? "",
  );

  const { transactions, fetchTransactionsByMonth, addTransaction } =
    useTransactions();

  useEffect(() => {
    if (!selectedYearMonth) return;
    fetchTransactionsByMonth(selectedYearMonth);
  }, [fetchTransactionsByMonth, selectedYearMonth]);

  const filteredTransactions = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return transactions;

    return transactions.filter((transaction) => {
      return (
        transaction.description.toLowerCase().includes(searchTerm) ||
        transaction.category.toLowerCase().includes(searchTerm)
      );
    });
  }, [transactions, search]);

  const totalTransactionsOut = useMemo(
    () =>
      Math.abs(
        filteredTransactions
          .filter((transaction) => transaction.type === "expense")
          .reduce((total, transaction) => total + transaction.amount, 0),
      ),
    [filteredTransactions],
  );

  const totalIncome = useMemo(
    () =>
      filteredTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0),
    [filteredTransactions],
  );

  const balance = useMemo(
    () =>
      filteredTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
      ),
    [filteredTransactions],
  );

  const handleCreateTransaction = async (
    payload: Parameters<typeof addTransaction>[0],
  ) => {
    const createdId = await addTransaction(payload);
    await fetchTransactionsByMonth(selectedYearMonth);
    return createdId;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
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
            Novo Lancamento
          </Button>
        </div>

        <AddExpenseModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onCreateTransaction={handleCreateTransaction}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transacao..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={selectedYearMonth}
            onValueChange={setSelectedYearMonth}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive-soft text-destructive">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Saidas</p>
                <p className="text-xl font-semibold text-foreground">
                  R${" "}
                  {totalTransactionsOut.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
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
                  R${" "}
                  {totalIncome.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground">Saldo do Periodo</p>
            <p
              className={cn(
                "text-xl font-semibold",
                balance >= 0 ? "text-success" : "text-destructive",
              )}
            >
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground font-medium">
                  Descricao
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Categoria
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Valor
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Data
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Pagamento
                </TableHead>
                <TableHead className="text-muted-foreground font-medium w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg",
                          transaction.type === "income"
                            ? "bg-success-soft text-success"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      {transaction.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transaction.category}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-medium",
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
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transaction.date.toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {paymentMethodLabelMap[transaction.paymentMethod] ??
                        transaction.paymentMethod}
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

              {filteredTransactions.length === 0 && (
                <TableRow className="border-border">
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    Nenhum lancamento encontrado para este mes.
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

export default Expenses;
