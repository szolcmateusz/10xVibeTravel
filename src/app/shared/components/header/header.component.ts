import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material';
import { Router } from '@angular/router';
import { SupabaseService } from '../../db/supabase.service';

@Component({
  selector: 'trv-header',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly isAuthenticated = signal(false);

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
    } catch (error) {
      console.error('Auth state initialization error:', error);
      this.isAuthenticated.set(false);
    }
  }
  protected async handleLogout(): Promise<void> {
    try {
      this.isLoading.set(true);
      await this.supabaseService.getSupabaseClient().auth.signOut();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}