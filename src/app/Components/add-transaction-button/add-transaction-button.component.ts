import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
      type: 'income',
      category: 'donation',
      amount: 233,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: crypto.randomUUID(),
      title: 'transaccion 2',
      type: 'expense',
      category: 'donation',
      amount: 123,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: crypto.randomUUID(),
      title: 'transaccion 3',
      type: 'expense',
      category: 'donation',
      amount: 143,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: crypto.randomUUID(),
      title: 'transaccion 4',
      type: 'income',
      category: 'donation',
      amount: 250,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: crypto.randomUUID(),
      title: 'transaccion 5',
      type: 'expense',
      category: 'donation',
      amount: 50,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: crypto.randomUUID(),
      title: 'transaccion 6',
      type: 'expense',
      category: 'donation',
      amount: 50,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: crypto.randomUUID(),
      title: 'transaccion 7',
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
