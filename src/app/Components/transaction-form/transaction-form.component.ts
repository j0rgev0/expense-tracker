import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EXPENSECAT, INCOMECAT } from '../../utils/consts';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.component.html'
})
export class TransactionFormComponent {
  @Output() back = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  formType: 'income' | 'expense' = 'income';

  incomeCatList = INCOMECAT;

  expenseCatlist = EXPENSECAT;

  validForm = this.fb.group({
    name: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  onSubmit() {}

  onBack() {
    this.back.emit();
  }
}
