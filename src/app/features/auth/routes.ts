import { Route } from '@angular/router';
import { unAuthGuard } from '../../shared/guards/un-auth.guard';
import { AuthLayoutComponent } from '../../shared/components/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [unAuthGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
