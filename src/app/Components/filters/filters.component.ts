import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../Services/transactions.service';

import { CATEGORIES } from '../../utils/consts';
import { Category } from '../../Interface/Transaction';
@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filters.component.html'
})
export class FiltersComponent {
  listCategories = CATEGORIES;
  // flags
  @Output() selectedTypeChange = new EventEmitter<'income' | 'expense' | 'all'>();
  @Output() selectedCategoryChange = new EventEmitter<Category>();
  @Output() selectedDateChange = new EventEmitter<string>();
  @Output() selectedAmountChange = new EventEmitter<number>();
  @Output() selectedSearchChange = new EventEmitter<string>();

  selectedType: 'income' | 'expense' | 'all' = 'all';
  categorySelected: Category = 'all';
  selectedDate: string = '';
  selectedAmount: number = 0;
  search: string = '';

  constructor() {}

  emitByType(typeSelected: 'income' | 'expense' | 'all') {
    this.selectedTypeChange.emit(typeSelected);
  }

  emitByCategory(event: Category) {
    this.selectedCategoryChange.emit(event);
  }

  emitByDate(event: string) {
    this.selectedDateChange.emit(event);
  }

  emitByAmount(event: number) {
    this.selectedAmountChange.emit(event);
  }
  emitBySearch(event: string) {
    this.selectedSearchChange.emit(event);
  }
}
