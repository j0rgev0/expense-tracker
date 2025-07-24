import { Routes } from '@angular/router';
import { NextComponent } from './Sections/next/next.component';
import { HeroComponent } from './Sections/hero/hero.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'next', component: NextComponent },
];
