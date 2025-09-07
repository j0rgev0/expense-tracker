import { Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Transaction } from '../Interface/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsFirebaseService {
  constructor(private firestore: Firestore) {}

  private getTransactionCollection(userId: string): CollectionReference<Transaction> {
    return collection(
      this.firestore,
      `users/${userId}/transactions`
    ) as CollectionReference<Transaction>;
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
