import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderInfoDashboardComponent } from '../../Components/header-info-dashboard/header-info-dashboard.component';
import { AccordionTransactionComponent } from '../../Components/accordion-transaction/accordion-transaction.component';
import { TransactionService } from '../../Services/transactions.service';
import { AllCategories, Transaction } from '../../Interface/Transaction';
import { AddTransactionButtonComponent } from '../../Components/add-transaction-button/add-transaction-button.component';
import { FiltersComponent, FilterState } from '../../Components/filters/filters.component';
import { ModalComponent } from '../../Components/modal/modal.component';
import { ModalService } from '../../Services/modal.service';
import { AuthService } from '../../Services/Auth/auth.service';
import { Router } from '@angular/router';

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
  transactionsListFiltered: Transaction[] = [];
  transactionsList: Transaction[] = [];
  isLoggedIn = false;
  loading = true;

  currentFilters: FilterState = {
    type: 'all',
    category: 'all',
    date: '',
    amount: 0,
    search: ''
  };

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    public modalService: ModalService
  ) {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactionsList = transactions;
      this.applyFilters();
    });

    this.authService.user$.subscribe(user => {
      this.loading = false; 
      this.isLoggedIn = user !== null;
    });
  }

  applyFilters() {
    let filteredTransactions = [...this.transactionsList];

    if (this.currentFilters.type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === this.currentFilters.type);
    }

    if (this.currentFilters.category !== 'all') {
      filteredTransactions = filteredTransactions.filter(
        t => t.category === this.currentFilters.category
      );
    }

    if (this.currentFilters.date !== '') {
      const selectedDate = new Date(this.currentFilters.date);
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= selectedDate;
      });
    }

    if (this.currentFilters.amount > 0) {
      filteredTransactions = filteredTransactions.filter(
        t => t.amount >= this.currentFilters.amount
      );
    }

    if (this.currentFilters.search !== '') {
      const searchTerm = this.currentFilters.search.toLowerCase().trim();
      filteredTransactions = filteredTransactions.filter(
        t =>
          t.title.toLowerCase().includes(searchTerm) ||
          t.category.toLowerCase().includes(searchTerm) ||
          t.amount.toString().includes(searchTerm)
      );
    }

    this.transactionsListFiltered = filteredTransactions;
  }

  onFiltersChange(filters: FilterState) {
    this.currentFilters = filters;
    this.applyFilters();
  }

  filterByType(typeSelected: 'income' | 'expense' | 'all') {
    this.currentFilters.type = typeSelected;
    this.applyFilters();
  }

  filterByCategory(categorySelected: AllCategories) {
    this.currentFilters.category = categorySelected;
    this.applyFilters();
  }

  filterByDate(date: string) {
    this.currentFilters.date = date;
    this.applyFilters();
  }

  filterByAmount(amount: number) {
    this.currentFilters.amount = amount;
    this.applyFilters();
  }

  filterByTitle(search: string) {
    this.currentFilters.search = search;
    this.applyFilters();
  }

  currentModalView: 'add' | 'view' = 'add';

  openModal(view: 'add' | 'view' = 'add') {
    this.currentModalView = view;
    this.modalService.open();
  }

  login() {
    this.loading = true;
    try {
      this.router.navigate(['/login']);
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.loading = true;
    try {
      this.authService.logout();
    } finally {
      this.loading = false;
    }
  }

  closeModal() {
    this.modalService.close();
  }
}
