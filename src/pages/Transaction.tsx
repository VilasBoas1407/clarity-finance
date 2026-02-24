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
import { AddTransactionModal } from "@/components/transaction/AddTransactionModal";
import { useTransactions } from "@/hooks/use-transactions";
import { toast } from "sonner";
import { Transaction as TransactionType } from "@/types/transaction";
import { ImportCsvModal } from "@/components/transaction/AddImportCsvModal";

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

const Transaction = () => {
  const [modalTransactionOpen, setmodalTransactionOpen] = useState(false);
  const [modalImportCsvOpen, setModalImportCsvOpen] = useState(false);
  const [search, setSearch] = useState("");
  const monthOptions = useMemo(() => buildLast12Months(), []);
  const [selectedYearMonth, setSelectedYearMonth] = useState(
    monthOptions[0]?.value ?? "",
  );

  const {
    transactions,
    fetchTransactionsByMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

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

  const totalOut = useMemo(
    () =>
      Math.abs(
        filteredTransactions
          .filter((transaction) => transaction.type === "expense")
          .reduce((total, transaction) => total + transaction.amount, 0),
      ),
    [filteredTransactions],
  );

  const totalIn = useMemo(
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

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      toast.success("Transação excluída");
      await fetchTransactionsByMonth(selectedYearMonth);
    } catch {
      toast.error("Não foi possível excluir a transação");
    }
  };

  const handleEditTransaction = async (transaction: TransactionType) => {
    const nextDescription = window.prompt("Descrição", transaction.description);
    if (nextDescription === null) return;

    const nextAmountInput = window.prompt(
      "Valor",
      Math.abs(transaction.amount).toString(),
    );
    if (nextAmountInput === null) return;

    const parsedAmount = Number(nextAmountInput.replace(",", "."));
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Valor invalido");
      return;
    }

    try {
      await updateTransaction(transaction.id, {
        description: nextDescription.trim() || transaction.description,
        amount:
          transaction.type === "expense"
            ? -Math.abs(parsedAmount)
            : Math.abs(parsedAmount),
      });
      toast.success("Transacao atualizada");
      await fetchTransactionsByMonth(selectedYearMonth);
    } catch {
      toast.error("Nao foi possivel atualizar a transacao");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Transações
            </h1>
            <p className="text-muted-foreground">
              Registre e acompanhe todas as suas transações
            </p>
          </div>
          <div className="flex items-center justify-between space-y-4 sm:space-y-0 sm:space-x-2">
            <Button
              className="gap-2"
              onClick={() => setmodalTransactionOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Novo Lançamento
            </Button>
            <Button
              className="gap-2"
              onClick={() => setModalImportCsvOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Importa CSV
            </Button>
          </div>
        </div>

        <AddTransactionModal
          open={modalTransactionOpen}
          onOpenChange={setmodalTransactionOpen}
          onCreateTransaction={handleCreateTransaction}
        />

        <ImportCsvModal
          open={modalImportCsvOpen}
          onOpenChange={setModalImportCsvOpen}
          onImportCsv={async (file) => {}}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transção..."
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
                <p className="text-sm text-muted-foreground">Total Saídas</p>
                <p className="text-xl font-semibold text-foreground">
                  R${" "}
                  {totalOut.toLocaleString("pt-BR", {
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
                  {totalIn.toLocaleString("pt-BR", {
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
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                        >
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
                    Nenhuma transacao encontrada para este mes.
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

export default Transaction;
