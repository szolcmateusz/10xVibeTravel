import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const { data: { user } } = await authService.getCurrentUser();
    if (user) return true;
    
    await router.navigate(['/auth/login']);
    return false;  
  } catch {
    await router.navigate(['/auth/login']);
    return false;
  }
};