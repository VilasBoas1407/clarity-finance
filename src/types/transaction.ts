export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  type: "income" | "expense";
  yearMonth: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
