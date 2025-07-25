import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../Interface/Transaction';
import { AddTransactionButtonComponent } from "../add-transaction-button/add-transaction-button.component";

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

  stored = localStorage.getItem('transactions');
  transactionList: Transaction[] = [];

  ngOnInit(): void {
    if (this.stored) {
      try {
        this.transactionList = JSON.parse(this.stored) as Transaction[];
      } catch (error) {
        console.error('Error parsing transactions:', error);
        this.transactionList = [];
      }
    }
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
}
