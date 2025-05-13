import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material/material';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'trv-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  protected readonly authService = inject(AuthService);

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

  protected readonly errorMessage = signal<string | null>(null);

  protected get emailControl() {
    return this.loginForm.controls.email;
  }

  protected get passwordControl() {
    return this.loginForm.controls.password;
  }

  protected async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.errorMessage.set(null);

    const { error } = await this.authService.login(
      this.emailControl.value,
      this.passwordControl.value
    );

    if (error) {
      this.errorMessage.set('Invalid email or password');
    }
  }
}