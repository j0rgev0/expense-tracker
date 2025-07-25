import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, HostListener } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../Interface/Transaction';
import { AddTransactionButtonComponent } from '../add-transaction-button/add-transaction-button.component';
import { getAllTransactions } from '../../Utils/manageTransaction';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddTransactionButtonComponent],
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submitExpense = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  transactionList: Transaction[] = [];

  ngOnInit(): void {
    this.transactionList = getAllTransactions();
  }

  expenseForm = this.fb.group({
    name: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  onSubmit() {}

  onClose() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress() {
    this.close.emit();
  }
}
