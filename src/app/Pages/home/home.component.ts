import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../Components/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ModalComponent, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private router: Router) {}

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onNext() {
    this.router.navigate(['/dashboard']);
  }
}
