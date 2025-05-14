import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../db/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  readonly isAuthenticated = signal(false);
  readonly isLoading = signal(false);

  constructor() {
    this.initAuthState();
  }

  private async initAuthState(): Promise<void> {
    try {
      const { data: { user } } = await this.supabaseService.getSupabaseClient().auth.getUser();
      this.isAuthenticated.set(!!user);

      // Subscribe to auth state changes
      this.supabaseService.getSupabaseClient().auth.onAuthStateChange((_, session) => {
        this.isAuthenticated.set(!!session);
      });    
    } catch {
      this.isAuthenticated.set(false);
    }
  }

  async login(email: string, password: string): Promise<{ error: Error | null }> {
    this.isLoading.set(true);
    try {
      const { error } = await this.supabaseService.getSupabaseClient().auth.signInWithPassword({
        email,
        password
      });

      if (!error) {
        await this.router.navigate(['/']);
      }

      return { error };    
    } catch (error) {
      return { error: error as Error };
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(email: string, password: string): Promise<{ error: Error | null }> {
    this.isLoading.set(true);
    try {
      const { error } = await this.supabaseService.getSupabaseClient().auth.signUp({
        email,
        password
      });

      if (!error) {
        await this.router.navigate(['/']);
      }

      return { error };    
    } catch (error) {
      return { error: error as Error };
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    try {
      this.isLoading.set(true);
      await this.supabaseService.getSupabaseClient().auth.signOut();
      await this.router.navigate(['/auth/login']);    
    } finally {
      this.isLoading.set(false);
    }
  }

  async getCurrentUser() {    try {
      return await this.supabaseService.getSupabaseClient().auth.getUser();
    } catch (error) {
      return { data: { user: null }, error };
    }
  }
}