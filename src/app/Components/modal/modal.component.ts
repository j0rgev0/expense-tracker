import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  HostListener,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { Transaction } from '../../Interface/Transaction';
import { AddTransactionButtonComponent } from '../add-transaction-button/add-transaction-button.component';
import { TransactionService } from '../../Services/transactions.service';
import { ViewTransactionsComponent } from '../view-transactions/view-transactions.component';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    AddTransactionButtonComponent,
    ViewTransactionsComponent,
    TransactionFormComponent
  ],
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() defaultView!: 'view' | 'add';
  @Output() close = new EventEmitter<void>();

  modalMode: 'view' | 'add' = this.defaultView;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  transactionList: Transaction[] = [];

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactionList = transactions;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultView'] && changes['defaultView'].currentValue) {
      this.modalMode = changes['defaultView'].currentValue;
    }
  }

  loadTransactions() {
    this.transactionList = this.transactionService.getAllTransactions();
  }

  onNext() {
    this.router.navigate(['/dashboard']);
  }

  onClose() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress() {
    this.close.emit();
  }
}
