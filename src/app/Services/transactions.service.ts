// src/app/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../Interface/Transaction';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadTransactions());
  public transactions$ = this.transactionsSubject.asObservable();

  private loadTransactions(): Transaction[] {
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

  reloadTransactions(): void {
    this.transactionsSubject.next(this.loadTransactions());
  }
}
