import { Component, OnInit } from '@angular/core';
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
export class HeaderInfoDashboardComponent implements OnInit {
  chartData: { category: string; amount: number }[] = [];
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

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
