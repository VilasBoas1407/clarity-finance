export type CreditCardBrand = "visa" | "mastercard" | "elo" | "amex" | "hipercard";

export interface CreditCard {
  id: string;
  name: string;
  brand: CreditCardBrand;
  lastDigits: string;
  limit: number;
  used: number;
  closeDay: number;
  dueDay: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
