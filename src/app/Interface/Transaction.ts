import { UUID } from 'crypto';

export interface Transaction {
  id: UUID;
  category: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}
