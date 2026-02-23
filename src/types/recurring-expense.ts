export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  nextDueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: "active" | "paused";
}
