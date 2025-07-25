import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitExpense = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  expenseForm = this.fb.group({
    name: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  onSubmit() {}
  onClose() {
    this.close.emit();
  }
}
