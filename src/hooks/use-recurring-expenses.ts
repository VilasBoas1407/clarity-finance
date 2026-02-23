import { useAuth } from "@/context/auth-context";
import { RecurringExpense } from "@/types/recurring-expense";
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
import { db } from "../lib/firebase";

type CreateRecurringExpenseInput = Omit<
  RecurringExpense,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export function useRecurringExpenses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);
  const { user, firebaseUser } = useAuth();

  const getCurrentUserId = useCallback(() => {
    const userId = user?.uid ?? firebaseUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return userId;
  }, [firebaseUser?.uid, user?.uid]);

  const fetchRecurringExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = getCurrentUserId();
      const recurringExpensesRef = collection(
        db,
        "users",
        userId,
        "recurringExpenses",
      );
      const recurringExpensesQuery = query(
        recurringExpensesRef,
        orderBy("nextDueDate", "asc"),
      );
      const snapshot = await getDocs(recurringExpensesQuery);
      const items = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          nextDueDate: data.nextDueDate?.toDate?.() ?? new Date(),
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
        } as RecurringExpense;
      });
      setRecurringExpenses(items);
    } catch (err) {
      console.error("Error fetching recurring expenses:", err);
      setError("Failed to load recurring expenses.");
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserId]);

  const addRecurringExpense = useCallback(
    async (payload: CreateRecurringExpenseInput) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const recurringExpensesRef = collection(
          db,
          "users",
          userId,
          "recurringExpenses",
        );

        const newExpense = {
          ...payload,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const createdDoc = await addDoc(recurringExpensesRef, newExpense);

        const localExpense: RecurringExpense = {
          id: createdDoc.id,
          ...payload,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setRecurringExpenses((prev) => [...prev, localExpense]);
        return createdDoc.id;
      } catch (err) {
        console.error("Error adding recurring expense:", err);
        setError("Failed to add recurring expense.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  const deleteRecurringExpense = useCallback(
    async (expenseId: string) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const recurringExpenseRef = doc(
          db,
          "users",
          userId,
          "recurringExpenses",
          expenseId,
        );

        await deleteDoc(recurringExpenseRef);
        setRecurringExpenses((prev) => prev.filter((item) => item.id !== expenseId));
      } catch (err) {
        console.error("Error deleting recurring expense:", err);
        setError("Failed to delete recurring expense.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  const toggleRecurringExpenseStatus = useCallback(
    async (expenseId: string, currentStatus: "active" | "paused") => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const recurringExpenseRef = doc(
          db,
          "users",
          userId,
          "recurringExpenses",
          expenseId,
        );
        const nextStatus = currentStatus === "active" ? "paused" : "active";

        await updateDoc(recurringExpenseRef, {
          status: nextStatus,
          updatedAt: serverTimestamp(),
        });

        setRecurringExpenses((prev) =>
          prev.map((item) =>
            item.id === expenseId
              ? { ...item, status: nextStatus, updatedAt: new Date() }
              : item,
          ),
        );
      } catch (err) {
        console.error("Error toggling recurring expense status:", err);
        setError("Failed to update recurring expense status.");
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
    recurringExpenses,
    setRecurringExpenses,
    fetchRecurringExpenses,
    addRecurringExpense,
    deleteRecurringExpense,
    toggleRecurringExpenseStatus,
  };
}
