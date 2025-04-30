import { Route } from '@angular/router';
import { TripPlansComponent } from './trip-plans.component';
import { authGuard } from '../../shared/guards/auth.guard';

export const TRIP_PLANS_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TripPlansComponent,
    canActivate: [authGuard]
  }
];