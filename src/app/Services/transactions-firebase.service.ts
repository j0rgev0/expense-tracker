import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Transaction } from '../Interface/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsFirebaseService {
  constructor(private firestore: Firestore) {}

  async saveTransaction(transaction: Transaction) {
    try {
    } catch {}
  }
}
