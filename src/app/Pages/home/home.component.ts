import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../Components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../Services/modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ModalComponent, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(
    private router: Router,
    public modalService: ModalService
  ) {}

  openModal() {
    this.modalService.open();
  }

  closeModal() {
    this.modalService.close();
  }

  onNext() {
    this.router.navigate(['/dashboard']);
  }
}
