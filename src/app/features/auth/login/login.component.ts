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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <mat-card class="w-full max-w-md mx-8">
        <mat-card-header class="mb-4">
          <mat-card-title>Login to VibeTravels</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" aria-label="Email użytkownika">
              @if (emailControl.invalid && emailControl.touched) {
                <mat-error>
                  @if (emailControl.errors?.['required']) {
                    Email is required
                  } @else if (emailControl.errors?.['email']) {
                    Please enter a valid email address
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" aria-label="Hasło">
              @if (passwordControl.invalid && passwordControl.touched) {
                <mat-error>
                  @if (passwordControl.errors?.['required']) {
                    Password is required
                  } @else if (passwordControl.errors?.['minlength']) {
                    Password must be at least 6 characters long
                  }
                </mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="bg-red-50 text-red-600 p-2 rounded" role="alert">
                {{ errorMessage() }}
              </div>
            }

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || isLoading()"
                    class="flex gap-2 justify-center items-center">
              @if (isLoading()) {
                <mat-spinner diameter="20" />
                <span>Logging in...</span>
              } @else {
                <span>Login</span>
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
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