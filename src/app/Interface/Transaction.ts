import { UUID } from 'crypto';

export interface Transaction {
  id: UUID;
  category: Category;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export type Category =
  | 'all'
  | 'salary'
  | 'donation'
  | 'rent'
  | 'food'
  | 'transportation'
  | 'entertainment'
  | 'other';
