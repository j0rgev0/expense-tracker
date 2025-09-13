import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  Firestore,
  orderBy,
  query
} from '@angular/fire/firestore';
import { Transaction } from '../Interface/Transaction';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsFirebaseService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private firestore: Firestore) {}

  private getTransactionCollection(userId: string): CollectionReference<Transaction> {
    return collection(
      this.firestore,
      `users/${userId}/transactions`
    ) as CollectionReference<Transaction>;
  }

  getTransaction(userId: string): void {
    const transactionCollection = this.getTransactionCollection(userId);
    const q = query(transactionCollection, orderBy('date', 'desc'));

    collectionData(q, { idField: 'id' }).subscribe(transactions => {
      this.transactionsSubject.next(transactions as Transaction[]);
    });
  }

  addTransaction(
    userId: string,
    transaction: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<string> {
    const transactionCollection = this.getTransactionCollection(userId);
    const newTransaction = { ...transaction, createdAt: new Date() };
    return addDoc(transactionCollection, newTransaction).then(docRef => docRef.id);
  }
}
