import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../Interface/Transaction';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadTransactions());
  public transactions$ = this.transactionsSubject.asObservable();

  private loadTransactions(): Transaction[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  }

  addTransaction(transaction: Transaction): void {
    const current = this.loadTransactions();

    if (current.find(t => t.title === transaction.title)) {
      console.error('Transaction already exists');
      return;
    }

    const updated = [...current, transaction];
    localStorage.setItem('transactions', JSON.stringify(updated));
    this.transactionsSubject.next(updated);
  }

  public getAllTransactions(): Transaction[] {
    return this.loadTransactions();
  }

  public deleteTransaction(id: UUID): void {
    const current = this.loadTransactions();

    const exists = current.some(t => t.id === id);

    if (!exists) {
      console.error('Transaction does not exist');
      return;
    }

    const updated = current.filter(t => t.id !== id);

    localStorage.setItem('transactions', JSON.stringify(updated));
    this.transactionsSubject.next(updated);
  }

  reloadTransactions(): void {
    this.transactionsSubject.next(this.loadTransactions());
  }

  calculateTotalAmount(): number {
    const transactions = this.loadTransactions();
    const transactionExpenses = transactions.filter(t => t.type === 'expense');
    const transactionIncomes = transactions.filter(t => t.type === 'income');
    return (
      transactionIncomes.reduce((total, trans) => total + trans.amount, 0) -
      transactionExpenses.reduce((total, trans) => total + trans.amount, 0)
    );
  }
}
