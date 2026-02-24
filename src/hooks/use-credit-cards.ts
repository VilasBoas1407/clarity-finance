import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { CreditCard } from "@/types/credit-card";
import { useCallback, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

type CreateCreditCardInput = Omit<
  CreditCard,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

type UpdateCreditCardInput = Partial<
  Omit<CreditCard, "id" | "userId" | "createdAt" | "updatedAt">
>;

export function useCreditCards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const { user, firebaseUser } = useAuth();

  const getCurrentUserId = useCallback(() => {
    const userId = user?.uid ?? firebaseUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return userId;
  }, [firebaseUser?.uid, user?.uid]);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = getCurrentUserId();
      const cardsRef = collection(db, "users", userId, "creditCards");
      const cardsQuery = query(cardsRef, orderBy("name", "asc"));
      const snapshot = await getDocs(cardsQuery);

      const items = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
        } as CreditCard;
      });

      setCards(items);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError("Failed to load cards.");
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserId]);

  const addCard = useCallback(
    async (payload: CreateCreditCardInput) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const cardsRef = collection(db, "users", userId, "creditCards");

        const newCard = {
          ...payload,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const createdDoc = await addDoc(cardsRef, newCard);

        setCards((prev) => [
          ...prev,
          {
            id: createdDoc.id,
            ...payload,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

        return createdDoc.id;
      } catch (err) {
        console.error("Error adding card:", err);
        setError("Failed to add card.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  const updateCard = useCallback(
    async (cardId: string, payload: UpdateCreditCardInput) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const cardRef = doc(db, "users", userId, "creditCards", cardId);

        await updateDoc(cardRef, {
          ...payload,
          updatedAt: serverTimestamp(),
        });

        setCards((prev) =>
          prev.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  ...payload,
                  updatedAt: new Date(),
                }
              : card,
          ),
        );
      } catch (err) {
        console.error("Error updating card:", err);
        setError("Failed to update card.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  const deleteCard = useCallback(
    async (cardId: string) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const cardRef = doc(db, "users", userId, "creditCards", cardId);
        await deleteDoc(cardRef);
        setCards((prev) => prev.filter((card) => card.id !== cardId));
      } catch (err) {
        console.error("Error deleting card:", err);
        setError("Failed to delete card.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  return {
    loading,
    error,
    cards,
    fetchCards,
    addCard,
    updateCard,
    deleteCard,
  };
}
