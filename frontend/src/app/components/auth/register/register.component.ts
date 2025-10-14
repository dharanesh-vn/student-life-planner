import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {}

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  getFieldError(field: string): string | null {
    const control = this.registerForm.get(field);
    if (control?.invalid && (control.touched || control.dirty)) {
      if (control.errors?.['required']) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      if (control.errors?.['email']) return 'Please enter a valid email address.';
      if (control.errors?.['pattern'] && field === 'name') return 'Name can only contain letters and spaces.';
      if (control.errors?.['minlength']) return 'Password must be at least 8 characters long.';
      if (control.errors?.['pattern'] && field === 'password') return 'Password is weak. Please include uppercase, lowercase, a number, and a special character.';
    }
    return null;
  }

  onRegister(): void {
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please correct the errors before submitting.';
      return;
    }
    
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Registration failed. The email may already be in use.';
      }
    });
  }

  togglePasswordVisibility(): void { this.showPassword = !this.showPassword; }
  toggleConfirmPasswordVisibility(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  hasUppercase(): boolean { return /[A-Z]/.test(this.password?.value || ''); }
  hasLowercase(): boolean { return /[a-z]/.test(this.password?.value || ''); }
  hasNumber(): boolean { return /[0-9]/.test(this.password?.value || ''); }
  hasSpecialChar(): boolean { return /[@$!%*?&]/.test(this.password?.value || ''); }
  hasMinLength(): boolean { return (this.password?.value || '').length >= 8; }
}