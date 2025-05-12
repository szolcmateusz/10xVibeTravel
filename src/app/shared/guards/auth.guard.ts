import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { SupabaseService } from '../db/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  try {    const { data: { user } } = await supabase.getSupabaseClient().auth.getUser();
    if (user) return true;
    
    await router.navigate(['/auth/login']);
    return false;
  } catch (error) {
    console.error('Auth guard error:', error);
    await router.navigate(['/auth/login']);
    return false;
  }
};