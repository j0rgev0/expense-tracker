import { Routes } from '@angular/router';
import { NextComponent } from './Pages/next/next.component';
import { HomeComponent } from './Pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'next', component: NextComponent }
];
