import { RecurringExpense } from "./recurring-expense";

export interface User {
  uid: string;
  name: string;
  email: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  recurringExpenses?: RecurringExpense[];
}
