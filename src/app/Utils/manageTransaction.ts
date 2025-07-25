import { Transaction } from '../Interface/Transaction';

export const addTransaction = (newTransaction: Transaction) => {
  const transaction: Transaction[] = getAllTransactions();
};

export const getAllTransactions = () => {
  const stored = localStorage.getItem('transactions');

  let transactionList: Transaction[] = [];

  if (stored) {
    try {
      return (transactionList = JSON.parse(stored) as Transaction[]);
    } catch (error) {
      console.error('Error parsing transactions:', error);
      return (transactionList = []);
    }
  }

  return [];
};
