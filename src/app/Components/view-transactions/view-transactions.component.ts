import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../Interface/Transaction';
import { CommonModule } from '@angular/common';
import { UUID } from 'crypto';
import { TransactionService } from '../../Services/transactions.service';

@Component({
  selector: 'app-view-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-transactions.component.html'
})
export class ViewTransactionsComponent implements OnInit {
  transactionList: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactionList = transactions;
    });
  }

  loadTransactions() {
    this.transactionList = this.transactionService.getAllTransactions();
  }

  deleteTransaction(id: UUID) {
    this.transactionService.deleteTransaction(id);
  }
}
