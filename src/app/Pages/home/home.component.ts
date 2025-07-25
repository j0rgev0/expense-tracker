import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalFormComponent } from '../../Components/modal-form/modal-form.component';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../Interface/Transaction';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ModalFormComponent, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private router: Router) {}

  income: Transaction[] = [
    {
      type: 'income',
      category: 'salary',
      title: 'salario',
      amount: 300,
      date: new Date().getDate() // new Date().toISOString().split('T')[0]
    },
    {
      type: 'income',
      category: 'donation',
      title: 'regalo de cumple',
      amount: 233,
      date: new Date().getDate()
    }
  ];

  modalOpen = false;

  addIncome() {
    localStorage.setItem('transactions', JSON.stringify(this.income));
  }
}
