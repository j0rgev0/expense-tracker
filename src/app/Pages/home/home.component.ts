import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalFormComponent } from '../../Components/modal-form/modal-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ModalFormComponent, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private router: Router) {}
  modalOpen = false;
}
