export interface Transaction {
  category: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: number;
}
