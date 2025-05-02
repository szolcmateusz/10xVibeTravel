import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/login/routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: 'trips',
    loadChildren: () => import('./features/trip-plans/routes').then(m => m.TRIP_PLANS_ROUTES)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'trips'
  }
];
