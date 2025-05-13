import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const unAuthGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const { data: { user } } = await authService.getCurrentUser();
    if (!user) return true;
    
    await router.navigate(['/']);
    return false;
  } catch (error) {
    console.error('UnAuth guard error:', error);
    return true;
  }
};
