import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TransactionService } from '../../Services/transactions.service';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { Transaction } from '../../Interface/Transaction';

@Component({
  selector: 'app-header-info-dashboard',
  standalone: true,
  imports: [CommonModule, BarChartComponent],
  templateUrl: './header-info-dashboard.component.html'
})
export class HeaderInfoDashboardComponent implements OnInit, OnChanges {
  @Input() filteredTransactions: Transaction[] = [];
  chartData: { category: string; amount: number }[] = [];
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
      this.updateChartData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredTransactions'] && this.filteredTransactions) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    // Usar las transacciones filtradas si están disponibles, sino usar todas las transacciones
    const transactionsToUse =
      this.filteredTransactions.length > 0 ? this.filteredTransactions : this.transactions;

    const categoryTotals = new Map<string, number>();

    transactionsToUse.forEach(transaction => {
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
