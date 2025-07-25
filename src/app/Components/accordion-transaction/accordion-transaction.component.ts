import { Component, Input } from '@angular/core';
import { TransactionService } from '../../Services/transactions.service';
import { Transaction } from '../../Interface/Transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-transaction.component.html',
  styles: ``
})
export class AccordionTransactionComponent {
  @Input() transaction!: Transaction;
}
