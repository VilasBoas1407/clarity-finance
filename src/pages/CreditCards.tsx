import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Calendar,
  CreditCard as CardIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreditCards } from "@/hooks/use-credit-cards";
import { AddCreditCardModal } from "@/components/cards/AddCreditCardModal";
import { CreditCard } from "@/types/credit-card";
import { toast } from "sonner";

const brandLabelMap: Record<CreditCard["brand"], string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  elo: "Elo",
  amex: "Amex",
  hipercard: "Hipercard",
};

const formatDay = (day: number) => String(day).padStart(2, "0");

const CreditCards = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const { cards, fetchCards, addCard, updateCard, deleteCard, loading } =
    useCreditCards();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const totalLimit = useMemo(
    () => cards.reduce((total, card) => total + card.limit, 0),
    [cards],
  );

  const totalUsed = useMemo(
    () => cards.reduce((total, card) => total + card.used, 0),
    [cards],
  );

  const totalAvailable = useMemo(
    () => totalLimit - totalUsed,
    [totalLimit, totalUsed],
  );

  const highUsageCount = useMemo(
    () => cards.filter((card) => (card.used / card.limit) * 100 >= 80).length,
    [cards],
  );

  const handleCreateCard = async (
    payload: Omit<CreditCard, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await addCard(payload);
      toast.success("Cartão adicionado");
    } catch {
      toast.error("Não foi possível adicionar o cartão");
      throw new Error("failed_to_add_card");
    }
  };

  const handleUpdateCard = async (
    payload: Omit<CreditCard, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingCard) return;

    try {
      await updateCard(editingCard.id, payload);
      toast.success("Cartão atualizado");
      setEditingCard(null);
    } catch {
      toast.error("Não foi possível atualizar o cartão");
      throw new Error("failed_to_update_card");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      toast.success("Cartão excluído");
    } catch {
      toast.error("Não foi possível excluir o cartão");
    }
  };

  const openCreateModal = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const openEditModal = (card: CreditCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Cartões de Crédito
            </h1>
            <p className="text-muted-foreground">
              Cadastre e gerencie seus cartões
            </p>
          </div>
          <Button className="gap-2" onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            Adicionar Cartão
          </Button>
        </div>

        <AddCreditCardModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) {
              setEditingCard(null);
            }
          }}
          onSave={editingCard ? handleUpdateCard : handleCreateCard}
          initialCard={editingCard}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Total Limite</p>
            <p className="text-2xl font-semibold text-foreground">
              R${" "}
              {totalLimit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">
              Total Utilizado
            </p>
            <p className="text-2xl font-semibold text-foreground">
              R${" "}
              {totalUsed.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Disponivel</p>
            <p className="text-2xl font-semibold text-success">
              R${" "}
              {totalAvailable.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-card">
            <p className="text-sm text-muted-foreground mb-1">
              Uso Alto (80%+)
            </p>
            <p className="text-2xl font-semibold text-warning">
              {highUsageCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
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
                      <h3 className="font-semibold text-foreground">
                        {card.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        **** {card.lastDigits} - {brandLabelMap[card.brand]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isHighUsage && (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => openEditModal(card)}
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Utilizado</span>
                    <span className="font-medium text-foreground">
                      R$ {card.used.toLocaleString("pt-BR")} / R${" "}
                      {card.limit.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress
                    value={usedPercentage}
                    className={cn("h-2", isHighUsage && "[&>div]:bg-warning")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Disponivel: R${" "}
                    {(card.limit - card.used).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div className="text-xs">
                      <p className="text-muted-foreground">Fecha</p>
                      <p className="font-medium text-foreground">
                        Dia {formatDay(card.closeDay)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div className="text-xs">
                      <p className="text-muted-foreground">Vence</p>
                      <p className="font-medium text-foreground">
                        Dia {formatDay(card.dueDay)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && cards.length === 0 && (
            <div className="col-span-full rounded-xl bg-card border border-border shadow-card p-8 text-center text-muted-foreground">
              Nenhum cartão encontrado. Clique em "Adicionar Cartão" para criar
              o primeiro.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CreditCards;
