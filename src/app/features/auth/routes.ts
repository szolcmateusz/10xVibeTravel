import { Route } from '@angular/router';
import { AuthLayoutComponent } from '../../shared/components/auth-layout/auth-layout.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      }
    ]
  }
];
