import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material/material';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'trv-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  protected readonly authService = inject(AuthService);

  protected readonly registerForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  protected readonly errorMessage = signal<string | null>(null);

  protected get emailControl() {
    return this.registerForm.controls.email;
  }

  protected get passwordControl() {
    return this.registerForm.controls.password;
  }

  protected get confirmPasswordControl() {
    return this.registerForm.controls.confirmPassword;
  }

  protected async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;
    
    if (this.passwordControl.value !== this.confirmPasswordControl.value) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.errorMessage.set(null);

    const { error } = await this.authService.register(
      this.emailControl.value,
      this.passwordControl.value
    );

    if (error) {
      this.errorMessage.set('Registration failed. Please try again.');
    }
  }
}
