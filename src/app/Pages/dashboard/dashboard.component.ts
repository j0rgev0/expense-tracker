import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeaderInfoDashboardComponent } from '../../Components/header-info-dashboard/header-info-dashboard.component';
import { AccordionTransactionComponent } from '../../Components/accordion-transaction/accordion-transaction.component';
import { TransactionService } from '../../Services/transactions.service';
import {
  AllCategories,
  ExpenseCategory,
  IncomesCategory,
  Transaction
} from '../../Interface/Transaction';
import { AddTransactionButtonComponent } from '../../Components/add-transaction-button/add-transaction-button.component';
import { FiltersComponent } from '../../Components/filters/filters.component';
import { ModalComponent } from '../../Components/modal/modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderInfoDashboardComponent,
    AccordionTransactionComponent,
    FiltersComponent,
    ModalComponent,
    AddTransactionButtonComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  // lists
  transactionsListFiltered: Transaction[] = [];
  transactionsList: Transaction[] = [];

  // modal
  modalOpen: boolean = false;

  constructor(private transactionService: TransactionService) {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactionsList = transactions;
      this.transactionsListFiltered = [...this.transactionsList];
    });
  }

  // filters
  filterByType(typeSelected: 'income' | 'expense' | 'all') {
    console.log(typeSelected);
    if (typeSelected === 'all') {
      this.transactionsListFiltered = [...this.transactionsList];
    } else {
      this.transactionsListFiltered = this.transactionsList.filter(t => t.type === typeSelected);
    }
  }

  filterByCategory(categorySelected: AllCategories) {
    if (categorySelected === 'all') {
      this.transactionsListFiltered = [...this.transactionsList];
    } else {
      this.transactionsListFiltered = this.transactionsList.filter(
        c => c.category === categorySelected
      );
    }
  }

  filterByDate(date: string) {
    console.log(date);
    if (date === '') {
      this.transactionsListFiltered = [...this.transactionsList];
    } else {
      const selectedDate = new Date(date);

      this.transactionsListFiltered = this.transactionsList.filter(c => {
        const transactionDate = new Date(c.date);
        return transactionDate >= selectedDate;
      });
    }
  }

  filterByAmount(amount: number) {
    this.transactionsListFiltered = this.transactionsList.filter(c => c.amount >= amount);
  }

  filterByTitle(search: string) {
    console.log(search);
    this.transactionsListFiltered = this.transactionsList.filter(c => c.title.includes(search));
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
