import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
import { BarChartComponent } from '../../Components/bar-chart/bar-chart.component';

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
export class DashboardComponent implements OnInit {
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

  chartData: { category: string; amount: number }[] = [];
  transactions: Transaction[] = [];

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
      this.updateChartData();
    });
  }

  private updateChartData(): void {
    const categoryTotals = new Map<string, number>();

    this.transactions.forEach(transaction => {
      const currentTotal = categoryTotals.get(transaction.category) || 0;
      categoryTotals.set(transaction.category, currentTotal + transaction.amount);
    });

    // Convertir a formato requerido por el gráfico
    this.chartData = Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }

  get totalAmount(): number {
    return this.transactionService.calculateTotalAmount();
  }
}
