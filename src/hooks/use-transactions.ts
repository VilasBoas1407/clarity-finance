import { useAuth } from "@/context/auth-context";
import { Transaction } from "@/types/transaction";
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
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type CreateTransactionInput = Omit<
  Transaction,
  "id" | "userId" | "createdAt" | "updatedAt" | "yearMonth"
>;

type UpdateTransactionInput = Partial<
  Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">
>;

const getYearMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user, firebaseUser } = useAuth();

  const getCurrentUserId = useCallback(() => {
    const userId = user?.uid ?? firebaseUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return userId;
  }, [firebaseUser?.uid, user?.uid]);

  const fetchTransactionsByMonth = useCallback(
    async (yearMonth: string) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const transactionsRef = collection(db, "users", userId, "transactions");
        const transactionsQuery = query(
          transactionsRef,
          where("yearMonth", "==", yearMonth),
          orderBy("date", "desc"),
        );
        const snapshot = await getDocs(transactionsQuery);

        const items = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            ...data,
            date: data.date?.toDate?.() ?? new Date(),
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
          } as Transaction;
        });

        setTransactions(items);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  const addTransaction = useCallback(
    async (payload: CreateTransactionInput) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const transactionRef = collection(db, "users", userId, "transactions");
        const yearMonth = getYearMonth(payload.date);

        const newTransaction = {
          ...payload,
          yearMonth,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const createdDoc = await addDoc(transactionRef, newTransaction);
        return createdDoc.id;
      } catch (err) {
        console.error("Error adding transaction:", err);
        setError("Failed to add transaction.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  const updateTransaction = useCallback(
    async (transactionId: string, payload: UpdateTransactionInput) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const transactionDocRef = doc(
          db,
          "users",
          userId,
          "transactions",
          transactionId,
        );

        const nextPayload: Record<string, unknown> = {
          ...payload,
          updatedAt: serverTimestamp(),
        };

        if (payload.date) {
          nextPayload.yearMonth = getYearMonth(payload.date);
        }

        await updateDoc(transactionDocRef, nextPayload);

        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === transactionId
              ? {
                  ...transaction,
                  ...payload,
                  yearMonth: payload.date
                    ? getYearMonth(payload.date)
                    : transaction.yearMonth,
                  updatedAt: new Date(),
                }
              : transaction,
          ),
        );
      } catch (err) {
        console.error("Error updating transaction:", err);
        setError("Failed to update transaction.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserId],
  );

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      setLoading(true);
      setError(null);

      try {
        const userId = getCurrentUserId();
        const transactionDocRef = doc(
          db,
          "users",
          userId,
          "transactions",
          transactionId,
        );

        await deleteDoc(transactionDocRef);
        setTransactions((prev) =>
          prev.filter((transaction) => transaction.id !== transactionId),
        );
      } catch (err) {
        console.error("Error deleting transaction:", err);
        setError("Failed to delete transaction.");
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
    transactions,
    fetchTransactionsByMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
