import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../Services/transactions.service';

import { CATEGORIES, INCOMECAT, EXPENSECAT } from '../../utils/consts';
import { AllCategories } from '../../Interface/Transaction';

// Interface para el estado de los filtros
export interface FilterState {
  type: 'income' | 'expense' | 'all';
  category: AllCategories;
  date: string;
  amount: number;
  search: string;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit {
  listCategories = CATEGORIES;

  @Output() filtersChange = new EventEmitter<FilterState>();

  selectedType: 'income' | 'expense' | 'all' = 'all';
  categorySelected: AllCategories = 'all';
  selectedDate: string = '';
  selectedAmount: number = 0;
  search: string = '';

  minAmount: number = 0;
  maxAmount: number = 1000;
  stepAmount: number = 10;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.calculateAmountRange();
    this.transactionService.transactions$.subscribe(() => {
      this.calculateAmountRange();
    });
  }

  private calculateAmountRange() {
    const transactions = this.transactionService.getAllTransactions();

    if (transactions.length === 0) {
      this.minAmount = 0;
      this.maxAmount = 1000;
      this.stepAmount = 10;
      return;
    }

    // Filtrar transacciones según el tipo seleccionado
    let filteredTransactions = transactions;
    if (this.selectedType === 'income') {
      filteredTransactions = transactions.filter(t => t.type === 'income');
    } else if (this.selectedType === 'expense') {
      filteredTransactions = transactions.filter(t => t.type === 'expense');
    }

    // Si no hay transacciones del tipo seleccionado, usar valores por defecto
    if (filteredTransactions.length === 0) {
      this.minAmount = 0;
      this.maxAmount = 1000;
      this.stepAmount = 10;
      return;
    }

    const amounts = filteredTransactions.map(t => t.amount);
    this.minAmount = Math.floor(Math.min(...amounts) / 10) * 10;
    this.maxAmount = Math.floor(Math.max(...amounts) / 10) * 10;

    // Asegurar un rango mínimo para mejor usabilidad
    if (this.maxAmount - this.minAmount < 100) {
      this.maxAmount = this.minAmount + 100;
    }

    const range = this.maxAmount - this.minAmount;
    if (range <= 100) {
      this.stepAmount = 5;
    } else if (range <= 500) {
      this.stepAmount = 10;
    } else if (range <= 1000) {
      this.stepAmount = 25;
    } else {
      this.stepAmount = 50;
    }

    // Ajustar el monto seleccionado si está fuera del nuevo rango
    if (this.selectedAmount < this.minAmount || this.selectedAmount > this.maxAmount) {
      this.selectedAmount = this.minAmount;
    }
  }

  private emitFilters() {
    const filterState: FilterState = {
      type: this.selectedType,
      category: this.categorySelected,
      date: this.selectedDate,
      amount: this.selectedAmount,
      search: this.search
    };
    this.filtersChange.emit(filterState);
  }

  // Getter para obtener el tipo de transacción actual en formato legible
  get currentTransactionType(): string {
    switch (this.selectedType) {
      case 'income':
        return 'Income';
      case 'expense':
        return 'Expense';
      default:
        return 'All';
    }
  }

  get filteredCategories(): AllCategories[] {
    if (this.selectedType === 'income') {
      return [...INCOMECAT] as AllCategories[];
    } else if (this.selectedType === 'expense') {
      return [...EXPENSECAT] as AllCategories[];
    } else {
      return [...CATEGORIES] as AllCategories[];
    }
  }

  emitByType(typeSelected: 'income' | 'expense' | 'all') {
    this.selectedType = typeSelected;
    this.categorySelected = 'all';
    // Recalcular el rango de montos para el nuevo tipo
    this.calculateAmountRange();
    this.emitFilters();
  }

  emitByCategory(event: AllCategories) {
    this.categorySelected = event;
    this.emitFilters();
  }

  emitByDate(event: string) {
    this.selectedDate = event;
    this.emitFilters();
  }

  emitByAmount(event: number) {
    this.selectedAmount = event;
    this.emitFilters();
  }

  onAmountInputChange(event: any) {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      this.selectedAmount = Math.max(this.minAmount, Math.min(this.maxAmount, value));
      this.emitFilters();
    }
  }

  emitBySearch(event: string) {
    this.search = event;
    this.emitFilters();
  }

  clearAllFilters() {
    this.selectedType = 'all';
    this.categorySelected = 'all';
    this.selectedDate = '';
    this.selectedAmount = this.minAmount;
    this.search = '';
    this.emitFilters();
  }

  getActiveFiltersCount(): number {
    let count = 0;

    if (this.selectedType !== 'all') count++;
    if (this.categorySelected !== 'all') count++;
    if (this.selectedDate !== '') count++;
    if (this.selectedAmount > this.minAmount) count++;
    if (this.search !== '') count++;

    return count;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('es-ES') + ' €';
  }
}
