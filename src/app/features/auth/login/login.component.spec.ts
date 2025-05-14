import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../shared/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;  let authServiceMock: { 
    login: ReturnType<typeof vi.fn>,
    isLoading: ReturnType<typeof signal<boolean>>
  };

  beforeEach(async () => {
    // Create mock for AuthService and Router
    authServiceMock = {
      login: vi.fn(),
      isLoading: signal(false)
    };
    
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with an empty form', () => {
    const form = component['loginForm'];
    expect(form.value).toEqual({
      email: '',
      password: ''
    });
  });

  it('should mark email as invalid when empty', () => {
    const emailControl = component['loginForm'].controls.email;
    emailControl.setValue('');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.errors?.['required']).toBeTruthy();
  });

  it('should mark email as invalid when format is incorrect', () => {
    const emailControl = component['loginForm'].controls.email;
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.errors?.['email']).toBeTruthy();
  });

  it('should mark email as valid when format is correct', () => {
    const emailControl = component['loginForm'].controls.email;
    emailControl.setValue('valid@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should mark password as invalid when empty', () => {
    const passwordControl = component['loginForm'].controls.password;
    passwordControl.setValue('');
    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.errors?.['required']).toBeTruthy();
  });

  it('should mark password as invalid when too short', () => {
    const passwordControl = component['loginForm'].controls.password;
    passwordControl.setValue('12345'); // 5 chars, minimum is 6
    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.errors?.['minlength']).toBeTruthy();
  });

  it('should mark password as valid when it meets requirements', () => {
    const passwordControl = component['loginForm'].controls.password;
    passwordControl.setValue('123456'); // 6 chars, meets minimum length
    expect(passwordControl.valid).toBeTruthy();
  });  it('should not call authService.login when form is invalid', async () => {
    // Form is initially empty and invalid
    await component['onSubmit']();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with correct values when form is valid', async () => {
    // Setup successful login response
    authServiceMock.login.mockResolvedValue({ error: null });
    
    // Set valid form values
    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    await component['onSubmit']();
    
    expect(authServiceMock.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  it('should set error message when login fails', async () => {
    // Setup failed login response
    authServiceMock.login.mockResolvedValue({ error: 'Authentication error' });
    
    // Set valid form values
    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    await component['onSubmit']();
    
    expect(component['errorMessage']()).toEqual('Invalid email or password');
  });

  it('should reset error message before attempting login', async () => {
    // Setup successful login response
    authServiceMock.login.mockResolvedValue({ error: null });
    
    // Set initial error message
    component['errorMessage'].set('Previous error');
    
    // Set valid form values
    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    await component['onSubmit']();
    
    expect(component['errorMessage']()).toBeNull();
  });
  it('should have form controls accessible via getter methods', () => {
    expect(component['emailControl']).toBe(component['loginForm'].controls.email);
    expect(component['passwordControl']).toBe(component['loginForm'].controls.password);
  });

  // UI Interaction Tests
  
  it('should disable the submit button when form is invalid', () => {
    // Form is initially invalid
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should enable the submit button when form is valid', () => {
    // Make form valid
    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('should not display error message when not present', () => {
    // Ensure no error message is set
    component['errorMessage'].set(null);
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeFalsy();
  });
});
