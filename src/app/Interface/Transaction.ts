import { UUID } from 'crypto';

export interface Transaction {
  id: UUID;
  category: IncomesCategory | ExpenseCategory | 'all';
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export type IncomesCategory =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'interest'
  | 'rental'
  | 'dividends'
  | 'business'
  | 'refund'
  | 'gift'
  | 'bonus'
  | 'sale'
  | 'other';

export type ExpenseCategory =
  | 'housing'
  | 'utilities'
  | 'groceries'
  | 'transportation'
  | 'insurance'
  | 'healthcare'
  | 'entertainment'
  | 'subscriptions'
  | 'education'
  | 'clothing'
  | 'personalCare'
  | 'debt'
  | 'savings'
  | 'donation'
  | 'travel'
  | 'taxes'
  | 'gift'
  | 'business'
  | 'other';

export type AllCategories =
  | 'all'
  | 'housing'
  | 'utilities'
  | 'groceries'
  | 'transportation'
  | 'insurance'
  | 'healthcare'
  | 'entertainment'
  | 'subscriptions'
  | 'education'
  | 'clothing'
  | 'personalCare'
  | 'debt'
  | 'savings'
  | 'donation'
  | 'travel'
  | 'taxes'
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'interest'
  | 'rental'
  | 'dividends'
  | 'business'
  | 'refund'
  | 'gift'
  | 'bonus'
  | 'sale'
  | 'other';
