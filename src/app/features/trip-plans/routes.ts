import { Route } from '@angular/router';
import { TripPlansComponent } from './trip-plan-list/trip-plans.component';
import { authGuard } from '../../shared/guards/auth.guard';

export const TRIP_PLANS_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TripPlansComponent,
    canActivate: [authGuard]
  },
  {
    path: 'create',
    pathMatch: 'full',
    loadComponent: () => import('./trip-plan-form/trip-plan-form.component').then(m => m.TripPlanFormComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./trip-plan-form/trip-plan-form.component').then(m => m.TripPlanFormComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./trip-plan-details/trip-plan-detail.component').then(m => m.TripPlanDetailComponent),
    canActivate: [authGuard]
  }
];