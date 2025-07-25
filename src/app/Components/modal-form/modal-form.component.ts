import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, HostListener } from '@angular/core';
import { Transaction } from '../../Interface/Transaction';
import { AddTransactionButtonComponent } from '../add-transaction-button/add-transaction-button.component';
import { TransactionService } from '../../Services/transactions.service';
import { ViewTransactionsComponent } from '../view-transactions/view-transactions.component';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [
    CommonModule,
    AddTransactionButtonComponent,
    ViewTransactionsComponent,
    TransactionFormComponent
  ],
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submitExpense = new EventEmitter<any>();

  constructor(private transactionService: TransactionService) {}

  modalMode: 'view' | 'add' = 'view';

  transactionList: Transaction[] = [];

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactionList = transactions;
    });
  }

  loadTransactions() {
    this.transactionList = this.transactionService.getAllTransactions();
  }

  onClose() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress() {
    this.close.emit();
  }
}
