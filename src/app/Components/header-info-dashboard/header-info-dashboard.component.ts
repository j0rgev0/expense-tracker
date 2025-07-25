import { Component } from '@angular/core';
import { TransactionService } from '../../Services/transactions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-info-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-info-dashboard.component.html'
})
export class HeaderInfoDashboardComponent {
  constructor(private transactionService: TransactionService) {}

  get totalAmount(): number {
    return this.transactionService.calculateTotalAmount();
  }
}
