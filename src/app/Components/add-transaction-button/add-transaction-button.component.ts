import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { addTransaction } from '../../Utils/manageTransaction';
import { Transaction } from '../../Interface/Transaction';
import { TransactionService } from '../../Services/transactions.service';

@Component({
  selector: 'app-add-transaction-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-transaction-button.component.html'
})
export class AddTransactionButtonComponent {
  constructor(private transactionService: TransactionService) {}

  incomes: Transaction[] = [
    {
      id: crypto.randomUUID(),
      type: 'income',
      category: 'salary',
      title: 'salario',
      amount: 300,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: crypto.randomUUID(),
      title: 'regalo de cumple',
      type: 'expense',
      category: 'donation',
      amount: 233,
      date: new Date().toISOString().split('T')[0]
    }
  ];

  addIncome() {
    for (const income of this.incomes) {
      this.transactionService.addTransaction(income);
    }
  }
}
