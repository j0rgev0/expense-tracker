import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [],
  templateUrl: './auth-button.component.html',
  styles: ``
})
export class AuthButtonComponent {
  @Output() action = new EventEmitter<void>();
  @Input() text!: string;

  onAction() {
    this.action.emit();
  }
}
