import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from './Sections/hero/hero.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeroComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'expense-tracker';
  hola() {
    console.log('hola');
  }
}
