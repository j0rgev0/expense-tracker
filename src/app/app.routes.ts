import { Routes } from '@angular/router';
import { NextComponent } from './Pages/next/next.component';
import { HomeComponent } from './Pages/home/home.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'next', component: NextComponent },
  { path: 'dashboard', component: DashboardComponent }
];
