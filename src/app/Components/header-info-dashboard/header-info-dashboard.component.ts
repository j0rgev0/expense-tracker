import { Component, Input, OnInit } from '@angular/core';
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
  @Input() data: { category: string; amount: number }[] = [];
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  get totalAmount(): number {
    return this.transactionService.calculateTotalAmount();
  }
}
