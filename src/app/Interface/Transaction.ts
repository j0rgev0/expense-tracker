import { UUID } from 'crypto';

export interface Transaction {
  id: UUID;
  category: incomesCategory | expenseCategory;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export type incomesCategory =
  | 'all'
  | 'salary'
  | 'donation'
  | 'rent'
  | 'food'
  | 'transportation'
  | 'entertainment'
  | 'other';

export type expenseCategory =
  | 'all'
  | 'salary'
  | 'donation'
  | 'rent'
  | 'food'
  | 'transportation'
  | 'entertainment'
  | 'other';
