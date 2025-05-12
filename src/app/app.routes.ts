import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'trips',
    loadChildren: () => import('./features/trip-plans/routes').then(m => m.TRIP_PLANS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'trips'
  },
  {
    path: '**',
    redirectTo: 'trips'
  }
];
