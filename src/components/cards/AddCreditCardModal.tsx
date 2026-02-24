import { useEffect, useMemo, useState } from "react";
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
import { CreditCard, CreditCardBrand } from "@/types/credit-card";
import { toast } from "sonner";

type CardPayload = Omit<CreditCard, "id" | "userId" | "createdAt" | "updatedAt">;

interface AddCreditCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CardPayload) => Promise<void>;
  initialCard?: CreditCard | null;
}

const brandOptions: { value: CreditCardBrand; label: string }[] = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "elo", label: "Elo" },
  { value: "amex", label: "Amex" },
  { value: "hipercard", label: "Hipercard" },
];

const buildInitialForm = (card?: CreditCard | null) => ({
  name: card?.name ?? "",
  brand: card?.brand ?? ("visa" as CreditCardBrand),
  lastDigits: card?.lastDigits ?? "",
  limit: card ? String(card.limit) : "",
  used: card ? String(card.used) : "0",
  closeDay: card ? String(card.closeDay) : "",
  dueDay: card ? String(card.dueDay) : "",
});

export function AddCreditCardModal({
  open,
  onOpenChange,
  onSave,
  initialCard,
}: AddCreditCardModalProps) {
  const isEditing = useMemo(() => Boolean(initialCard), [initialCard]);
  const [form, setForm] = useState(buildInitialForm(initialCard));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(buildInitialForm(initialCard));
  }, [initialCard, open]);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAndClose = () => {
    setForm(buildInitialForm(null));
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedLimit = Number(form.limit.replace(",", "."));
    const parsedUsed = Number(form.used.replace(",", "."));
    const parsedCloseDay = Number(form.closeDay);
    const parsedDueDay = Number(form.dueDay);

    if (
      !form.name.trim() ||
      !form.lastDigits.trim() ||
      form.lastDigits.trim().length !== 4
    ) {
      toast.error("Informe nome e 4 ultimos digitos");
      return;
    }

    if (
      Number.isNaN(parsedLimit) ||
      parsedLimit <= 0 ||
      Number.isNaN(parsedUsed) ||
      parsedUsed < 0
    ) {
      toast.error("Valores de limite e usado sao invalidos");
      return;
    }

    if (
      Number.isNaN(parsedCloseDay) ||
      parsedCloseDay < 1 ||
      parsedCloseDay > 31 ||
      Number.isNaN(parsedDueDay) ||
      parsedDueDay < 1 ||
      parsedDueDay > 31
    ) {
      toast.error("Dias de fechamento e vencimento devem ser entre 1 e 31");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: form.name.trim(),
        brand: form.brand,
        lastDigits: form.lastDigits.trim(),
        limit: parsedLimit,
        used: parsedUsed,
        closeDay: parsedCloseDay,
        dueDay: parsedDueDay,
      });
      resetAndClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar cartao" : "Adicionar cartao"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do cartao."
              : "Cadastre um novo cartao para acompanhar limite e uso."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="card-name">Nome</Label>
            <Input
              id="card-name"
              placeholder="Ex: Nubank, Itau..."
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bandeira</Label>
              <Select
                value={form.brand}
                onValueChange={(value) =>
                  setField("brand", value as CreditCardBrand)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-last-digits">4 ultimos digitos</Label>
              <Input
                id="card-last-digits"
                type="text"
                inputMode="numeric"
                placeholder="1234"
                value={form.lastDigits}
                maxLength={4}
                onChange={(e) =>
                  setField("lastDigits", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-limit">Limite (R$)</Label>
              <Input
                id="card-limit"
                type="number"
                min="0"
                step="0.01"
                value={form.limit}
                onChange={(e) => setField("limit", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-used">Utilizado (R$)</Label>
              <Input
                id="card-used"
                type="number"
                min="0"
                step="0.01"
                value={form.used}
                onChange={(e) => setField("used", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-close-day">Dia fechamento</Label>
              <Input
                id="card-close-day"
                type="number"
                min="1"
                max="31"
                value={form.closeDay}
                onChange={(e) => setField("closeDay", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-due-day">Dia vencimento</Label>
              <Input
                id="card-due-day"
                type="number"
                min="1"
                max="31"
                value={form.dueDay}
                onChange={(e) => setField("dueDay", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={resetAndClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Salvando..."
                : isEditing
                  ? "Salvar alteracoes"
                  : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
