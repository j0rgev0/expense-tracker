import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CATEGORIES, EXPENSECAT, INCOMECAT } from '../../utils/consts';
import { allowedValuesValidatos } from '../../utils/validateForm';
import { TransactionService } from '../../Services/transactions.service';
import { Transaction } from '../../Interface/Transaction';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.component.html'
})
export class TransactionFormComponent {
  @Output() back = new EventEmitter<void>();
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {}

  private _formType: 'income' | 'expense' = 'income';

  get formType(): 'income' | 'expense' {
    return this._formType;
  }

  set formType(value: 'income' | 'expense') {
    this._formType = value;
    this.validForm.get('type')?.setValue(value);
  }

  allCategories = CATEGORIES;

  incomeCatList = INCOMECAT;

  expenseCatlist = EXPENSECAT;

  validForm = this.fb.group({
    type: ['income', [Validators.required, allowedValuesValidatos(['income', 'expense'])]],
    title: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: ['', [Validators.required, allowedValuesValidatos([...this.allCategories])]],
    date: ['', Validators.required]
  });

  onSubmit() {
    if (this.validForm.valid) {
      try {
        const data = this.validForm.value;
        const transaction: Transaction = {
          id: crypto.randomUUID(),
          type: this.formType.toLowerCase(),
          title: data.title!.toLowerCase(),
          amount: data.amount!,
          category: data.category!.toLowerCase(),
          date: data.date!
        };

        this.transactionService.addTransaction(transaction);

        console.log('Submitted data:', data);
        this.back.emit();
      } catch (e) {
        this.errorMessage = e + '';
        console.error(e);
      }
    } else {
      this.validForm.markAllAsTouched();
    }
  }

  onBack() {
    this.back.emit();
  }
}
