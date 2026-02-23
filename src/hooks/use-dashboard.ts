import { useAuth } from "@/context/auth-context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Transaction } from "@/types/transaction";
import { RecurringExpense } from "@/types/recurring-expense";

type DashboardKpi = {
  totalSpent: number;
  recurringSpent: number;
  cardSpent: number;
  freeBalance: number;
  totalSpentChange: number;
  recurringSpentChange: number;
  cardSpentChange: number;
  freeBalanceChange: number;
};

type MonthlyPoint = {
  month: string;
  gastos: number;
};

type CategoryPoint = {
  name: string;
  value: number;
  color: string;
};

const CATEGORY_COLORS = [
  "hsl(172, 66%, 45%)",
  "hsl(220, 70%, 55%)",
  "hsl(280, 65%, 55%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(152, 60%, 42%)",
];

const toYearMonth = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getLastMonths = (count: number) => {
  const months: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(toYearMonth(d));
  }
  return months;
};

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);
  const { user, firebaseUser } = useAuth();

  const userId = user?.uid ?? firebaseUser?.uid ?? null;

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const transactionsRef = collection(db, "users", userId, "transactions");
      const recurringRef = collection(db, "users", userId, "recurringExpenses");

      const [transactionsSnapshot, recurringSnapshot] = await Promise.all([
        getDocs(query(transactionsRef, orderBy("date", "desc"))),
        getDocs(recurringRef),
      ]);

      const parsedTransactions = transactionsSnapshot.docs.map(
        (docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            ...data,
            date: data.date?.toDate?.() ?? new Date(),
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
          } as Transaction;
        },
      );

      const parsedRecurring = recurringSnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          nextDueDate: data.nextDueDate?.toDate?.() ?? new Date(),
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
        } as RecurringExpense;
      });

      setTransactions(parsedTransactions);
      setRecurringExpenses(parsedRecurring);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Nao foi possivel carregar o dashboard.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const kpis = useMemo<DashboardKpi>(() => {
    const now = new Date();
    const currentYM = toYearMonth(now);
    const previousYM = toYearMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );

    const currentTransactions = transactions.filter(
      (t) => t.yearMonth === currentYM,
    );
    const previousTransactions = transactions.filter(
      (t) => t.yearMonth === previousYM,
    );

    const currentSpent = Math.abs(
      currentTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0),
    );
    const previousSpent = Math.abs(
      previousTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0),
    );

    const currentCardSpent = Math.abs(
      currentTransactions
        .filter((t) => t.type === "expense" && t.paymentMethod === "cartao")
        .reduce((acc, t) => acc + t.amount, 0),
    );
    const previousCardSpent = Math.abs(
      previousTransactions
        .filter((t) => t.type === "expense" && t.paymentMethod === "cartao")
        .reduce((acc, t) => acc + t.amount, 0),
    );

    const currentRecurring = recurringExpenses
      .filter((r) => r.status === "active")
      .reduce((acc, r) => acc + r.amount, 0);
    const previousRecurring = currentRecurring;

    const currentIncome = currentTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const freeBalance = currentIncome - currentSpent - currentRecurring;

    const previousIncome = previousTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const previousFreeBalance = previousIncome - previousSpent;

    return {
      totalSpent: currentSpent,
      recurringSpent: currentRecurring,
      cardSpent: currentCardSpent,
      freeBalance,
      totalSpentChange: calculateChange(currentSpent, previousSpent),
      recurringSpentChange: calculateChange(
        currentRecurring,
        previousRecurring,
      ),
      cardSpentChange: calculateChange(currentCardSpent, previousCardSpent),
      freeBalanceChange: calculateChange(freeBalance, previousFreeBalance),
    };
  }, [recurringExpenses, transactions]);

  const monthlyExpenses = useMemo<MonthlyPoint[]>(() => {
    const months = getLastMonths(7);
    return months.map((yearMonth) => {
      const value = Math.abs(
        transactions
          .filter((t) => t.yearMonth === yearMonth && t.type === "expense")
          .reduce((acc, t) => acc + t.amount, 0),
      );
      const [year, month] = yearMonth.split("-");
      const labelDate = new Date(Number(year), Number(month) - 1, 1);
      return {
        month: labelDate.toLocaleDateString("pt-BR", { month: "short" }),
        gastos: value,
      };
    });
  }, [transactions]);

  const categoryExpenses = useMemo<CategoryPoint[]>(() => {
    const currentYM = toYearMonth(new Date());
    const grouped = new Map<string, number>();

    transactions
      .filter((t) => t.yearMonth === currentYM && t.type === "expense")
      .forEach((t) => {
        grouped.set(
          t.category,
          (grouped.get(t.category) ?? 0) + Math.abs(t.amount),
        );
      });

    recurringExpenses
      .filter((r) => r.status === "active")
      .forEach((r) => {
        grouped.set(
          r.category,
          (grouped.get(r.category) ?? 0) + Math.abs(r.amount),
        );
      });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      }));
  }, [transactions, recurringExpenses]);

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions],
  );

  return {
    loading,
    error,
    kpis,
    monthlyExpenses,
    categoryExpenses,
    recentTransactions,
    refetch: fetchDashboardData,
  };
}
