import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-transaction-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-transaction-button.component.html'
})
export class AddTransactionButtonComponent {
  @Output() action = new EventEmitter<void>();
  @Input() text = 'Add Transaction';
  @Input() svg = 'add';

  onAction() {
    this.action.emit();
  }
}
