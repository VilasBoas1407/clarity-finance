import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Transaction } from "@/types/transaction";
import { CATEGORIES, PAYMENT_METHODS } from "@/shared/constants";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTransaction: (
    payload: Omit<
      Transaction,
      "id" | "userId" | "createdAt" | "updatedAt" | "yearMonth"
    >,
  ) => Promise<string>;
}

export function AddExpenseModal({
  open,
  onOpenChange,
  onCreateTransaction,
}: AddExpenseModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !description.trim() ||
      !category ||
      !amount ||
      !paymentMethod ||
      !date
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const numericAmount = Number(amount);
      await onCreateTransaction({
        description: description.trim(),
        category,
        amount:
          type === "expense"
            ? -Math.abs(numericAmount)
            : Math.abs(numericAmount),
        date,
        paymentMethod,
        type,
      });
      toast.success(`Lançamento "${description}" adicionado`);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error("Não foi possível adicionar o lançamento");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setCategory("");
    setAmount("");
    setType("expense");
    setPaymentMethod("");
    setDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lancamento</DialogTitle>
          <DialogDescription>
            Registre uma nova receita ou despesa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as "expense" | "income")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Freelance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
