import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material/material';
import { SupabaseService } from '../../../shared/db/supabase.service';

@Component({
  selector: 'trv-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected get emailControl() {
    return this.loginForm.controls.email;
  }

  protected get passwordControl() {
    return this.loginForm.controls.password;
  }

  protected async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { error } = await this.supabaseService.getSupabaseClient().auth.signInWithPassword({
        email: this.emailControl.value,
        password: this.passwordControl.value
      });

      if (error) throw error;

      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage.set('Invalid email or password');
    } finally {
      this.isLoading.set(false);
    }
  }
}